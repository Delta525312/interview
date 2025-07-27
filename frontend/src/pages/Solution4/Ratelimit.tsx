import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Play, Square, Download, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import  styles  from 'components/solution4/styles';


// --- Interfaces and Types ---
interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'SYSTEM';
  message: string;
}

type SimulationStatus = 'IDLE' | 'RUNNING' | 'FINISHED' | 'STOPPING' | 'STOPPED';

// --- Constants ---
const SIMULATION_MODES = [
  { label: 'Full Test (All 4 Minutes)', value: 0 },
  { label: 'Minute 1 (16 calls)', value: 1 },
  { label: 'Minute 2 (256 calls)', value: 2 },
  { label: 'Minute 3 (4,096 calls)', value: 3 },
  { label: 'Minute 4 (65,536 calls)', value: 4 },
];

// --- Components ---

// LogLine Component: Renders a single log entry with appropriate styling.
const LogLine: React.FC<{ log: LogEntry }> = React.memo(({ log }) => {
  const levelClass = `log-level-${log.level}`;

  return (
    <div className="log-line">
      <span className="log-timestamp">{log.timestamp}</span>
      <span className={`log-level ${levelClass}`}>{`[${log.level}]`}</span>
      <span className="log-message">{log.message}</span>
    </div>
  );
});

// Main App Component
export const Ratelimit: React.FC = () => {
  const { t } = useTranslation();
  const { themeMode } = useTheme();
  const [mode, setMode] = useState<number>(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [status, setStatus] = useState<SimulationStatus>('IDLE');
  const ws = useRef<WebSocket | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const backendUrl = useRef(process.env.REACT_APP_API_URL || 'http://localhost:8000');
  const wsUrl = useRef(`${process.env.REACT_APP_WS_URL || 'ws://localhost:8000'}/api/v1/simulation/ws/logs`);


  // WebSocket connection logic
  const connectWebSocket = useCallback(() => {
    ws.current = new WebSocket(wsUrl.current);

    ws.current.onopen = () => {
      console.log('WebSocket Connected');
    };

    ws.current.onmessage = (event) => {
      try {
        const logData: LogEntry = JSON.parse(event.data);
        // Special message from backend to signal the end of the simulation
        if (logData.level === 'SYSTEM' && logData.message === 'SIMULATION_ENDED') {
          setStatus(prev => (prev === 'STOPPING' ? 'STOPPED' : 'FINISHED'));
        } else {
          setLogs(prevLogs => [...prevLogs, logData]);
        }
      } catch (error) {
        console.error("Failed to parse log data:", event.data);
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    ws.current.onclose = () => {
      console.log('WebSocket Disconnected');
    };
  }, []);

  // Effect to establish and close WebSocket connection
  useEffect(() => {
    connectWebSocket();
    return () => {
      ws.current?.close();
    };
  }, [connectWebSocket]);

  // Effect to auto-scroll log container
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Function to start the simulation via API call
  const startSimulation = async () => {
    setLogs([]); // Clear old logs
    setStatus('RUNNING');
    try {
      const res = await fetch(`${backendUrl.current}/api/v1/simulation/start-simulation?mode=${mode}`, {
        method: 'POST',
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to start simulation');
      }
    } catch (err) {
      // Using console.error instead of alert for better debugging
      console.error('Error starting simulation: ', (err as Error).message);
      setStatus('IDLE');
    }
  };

  // Function to stop the simulation
  const stopSimulation = async () => {
    setStatus('STOPPING');
    try {
      await fetch(`${backendUrl.current}/api/v1/simulation/stop-simulation`, { method: 'POST' });
    } catch (err) {
      console.error('Error stopping simulation: ', (err as Error).message);
      setStatus('RUNNING'); // Revert status if stop fails
    }
  };
  
  // Function to export logs to a CSV file
  const exportCSV = () => {
    const csvHeader = ['Timestamp', 'Level', 'Message'];
    const csvRows = [
      csvHeader.join(','),
      ...logs.map(log => 
        [
          `"${log.timestamp.replace(/"/g, '""')}"`,
          `"${log.level.replace(/"/g, '""')}"`,
          `"${log.message.replace(/"/g, '""')}"`
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `simulation_log_${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const isRunning = status === 'RUNNING' || status === 'STOPPING';

  return (
    <>
      <style>{styles}</style>
      <div className="simulation-app" data-theme={themeMode}>
        <header className="app-header">
          <h1 className="app-title">{t('ratelimit.title', 'Rate Limit & Throttle Simulation')}</h1>
          <div className="header-actions">
            <button
              onClick={exportCSV}
              disabled={logs.length === 0}
              className="btn btn-success"
            >
              <Download size={18} />
              {t('ratelimit.exportCSV', 'Export CSV')}
            </button>
          </div>
        </header>

        <main className="main-content">
          {/* Control Panel */}
          <div className="panel control-panel">
            <h2 className="panel-title">{t('ratelimit.controls', 'Controls')}</h2>
            <div className="controls-container">
              <div className="form-group">
                <label htmlFor="sim-mode">{t('ratelimit.simMode', 'Simulation Mode')}</label>
                <select 
                  id="sim-mode" 
                  value={mode} 
                  onChange={e => setMode(Number(e.target.value))}
                  disabled={isRunning}
                  className="select-input"
                >
                 {SIMULATION_MODES.map(m => (
  <option key={m.value} value={m.value}>
    {m.label}
  </option>
))}

                </select>
              </div>
              
              <div className="button-group">
                <button
                  onClick={startSimulation}
                  disabled={isRunning}
                  className="btn btn-primary"
                >
                  <Play size={20} />
                  {t('ratelimit.start', 'Start')}
                </button>
                <button
                  onClick={stopSimulation}
                  disabled={!isRunning}
                  className="btn btn-danger"
                >
                  <Square size={20} />
                  {t('ratelimit.stop', 'Stop')}
                </button>
              </div>
              
              <div className="form-group">
                 <h3 style={{fontSize: '0.875rem', fontWeight: 600, color: '#9ca3af', marginBottom: '0.5rem'}}>{t('ratelimit.status', 'Status')}</h3>
                 <div className="status-display">
                   {status === 'RUNNING' && <Activity size={20} className="status-icon-running" />}
                   <span className="status-text">{t(`ratelimit.status.${status.toLowerCase()}`, status)}</span>
                 </div>
              </div>
            </div>
          </div>
          
          {/* Log Viewer */}
          <div className="panel log-viewer">
            <div className="log-viewer-header">
                <h2 className="panel-title">{t('ratelimit.logTitle', 'Real-time Log Stream')}</h2>
            </div>
            <div 
              ref={logContainerRef}
              className="log-container"
              style={{ maxHeight: '70vh', minHeight: 200, overflowY: 'auto' }}
            >
              {logs.length > 0 ? (
                logs.slice(-10000).map((log, index) => <LogLine key={index} log={log} />)
              ) : (
                <div className="log-placeholder">
                  <p>{t('ratelimit.logEmpty', 'Logs will appear here once the simulation starts.')}</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};
export default Ratelimit;
