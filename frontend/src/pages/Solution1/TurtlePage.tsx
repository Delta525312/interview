import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, RefreshCw, Compass, Route, SlidersHorizontal, FileText, Square } from 'lucide-react';

// --- Importar Componentes y Lógica ---
import { type Position, type RouteResult, type LogEntry } from '../../components/solution1/types';
import { calculateZigZagPath, calculateSpiralPath, findAndLabelRoutes } from '../../components/solution1/turtle-logic';
import { styles, addDynamicStyles } from '../../styles/Solution1/turtle-styles';
import { MatrixDisplay } from '../../components/solution1/MatrixDisplay';
import { WalkInputs } from '../../components/solution1/WalkInputs';
// --- NOTA: Ajusta la siguiente ruta para que coincida con la ubicación de tu ThemeProvider ---
import { useTheme } from '../../contexts/ThemeContext'; 

// --- CONFIGURACIÓN Y DATOS ---
const TURTLE_IMAGE_URL = '/solution1/turtle.png';
const WALK_SOUND_URL = '/solution1/walk.mp3';
const initialMatrix: number[][] = [[7,2,0,1,0,2,9], [8,4,8,6,9,3,3], [7,8,8,8,9,0,6], [4,7,2,7,0,0,7], [6,5,7,8,0,7,2], [8,1,8,5,4,5,2]];
type WalkType = 'zigzag' | 'spiral' | 'findPath';

export const TurtlePage: React.FC = () => {
    const { t } = useTranslation();
    // --- El tema ahora se obtiene del Contexto global ---
    const { themeMode } = useTheme();

    // --- ESTADO ---
    const [turtlePos, setTurtlePos] = useState<Position | null>(null);
    const [visited, setVisited] = useState<Set<string>>(new Set());
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [animationState, setAnimationState] = useState<'idle' | 'running'>('idle');
    const [activeWalk, setActiveWalk] = useState<WalkType | null>(null);
    const [inputs, setInputs] = useState({ spiralX: '1', spiralY: '1', startValue: '2', endValue: '8' });
    const [foundRoutes, setFoundRoutes] = useState<RouteResult[]>([]);

    // --- REFS ---
    const pathRef = useRef<Position[]>([]);
    const stepRef = useRef(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
const isSoundOn = localStorage.getItem('soundMuted') === 'false';

    // --- EFECTOS ---
useEffect(() => {
  addDynamicStyles(); 

}, []);

    // --- FUNCIONES ---
    const addLog = (message: string) => {
        const timestamp = new Date().toLocaleTimeString('en-GB');
        setLogs(prev => [{ timestamp, message }, ...prev].slice(0, 100));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
 const runAnimation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setAnimationState('running');

    intervalRef.current = setInterval(() => {
        if (stepRef.current >= pathRef.current.length) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setAnimationState('idle');
            addLog(t('log.end'));
            return;
        }

        const currentPos = pathRef.current[stepRef.current];
        const currentValue = initialMatrix[currentPos.row][currentPos.col];
        addLog(t('log.step', { row: currentPos.row, col: currentPos.col, value: currentValue }));
        setTurtlePos(currentPos);
        setVisited(prev => new Set(prev).add(`${currentPos.row}-${currentPos.col}`));
        stepRef.current++;

      if (isSoundOn) {
        if (!audioRef.current) {
          audioRef.current = new window.Audio(WALK_SOUND_URL);
          audioRef.current.volume = 0.5;
        }
        // Always reset to start and play
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {
          // In case play() is blocked, try to resume
          audioRef.current?.pause();
          audioRef.current?.play().catch(console.error);
        });
      }
    }, 500);
};
     
    const handlePathButtonClick = (route: RouteResult) => {
        if (animationState !== 'idle') handleReset(true);
        // NOTA: Se ha añadido la clave 'log.animating' para la traducción.
        addLog(t('log.animating', 'Animating route: {{path}}', { path: route.pathValues.join(' -> ') }));
        pathRef.current = route.pathCoords;
        stepRef.current = 0;
        setVisited(new Set());
        setTurtlePos(null);
        runAnimation();
    };

    const handleStart = () => {
        handleReset(true);
        if (!activeWalk) return;
        addLog(t('log.start', { walkType: t(`walks.${activeWalk}`) }));

        if (activeWalk === 'findPath') {
            const startVal = parseInt(inputs.startValue, 10);
            const endVal = parseInt(inputs.endValue, 10);
            const results = findAndLabelRoutes(initialMatrix, startVal, endVal);
            if (results.length === 0) { addLog(t('log.notFound')); return; }
            // NOTA: Se ha añadido la clave 'log.foundRoutes' para la traducción.
            addLog(t('log.foundRoutes', 'Found {{count}} routes. Select a route to start.', { count: results.length }));
            setFoundRoutes(results);
        } else {
            let newPath: Position[] = [];
            if (activeWalk === 'zigzag') newPath = calculateZigZagPath(initialMatrix);
            else if (activeWalk === 'spiral') {
                const x = parseInt(inputs.spiralX, 10), y = parseInt(inputs.spiralY, 10);
                if (!isNaN(x) && !isNaN(y)) newPath = calculateSpiralPath(initialMatrix, { row: x, col: y });
            }
            if (newPath.length > 0) {
                pathRef.current = newPath;
                stepRef.current = 0;
                runAnimation();
            } else {
                // NOTA: Se ha añadido la clave 'log.noPath' para la traducción.
                addLog(t('log.noPath', 'No path generated.'));
            }
        }
    };

    const handleStop = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        setAnimationState('idle');
        // NOTA: Se ha añadido la clave 'log.stopped' para la traducción.
        addLog(t('log.stopped', 'Animation stopped by user.'));
    };

    const handleReset = (silent: boolean = false) => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setTurtlePos(null);
        setVisited(new Set());
        setFoundRoutes([]);
        pathRef.current = [];
        stepRef.current = 0;
        setAnimationState('idle');
        if (!silent) addLog(t('log.reset'));
    };

    // --- RENDER ---
    return (
        <div style={styles.pageContainer} data-theme={themeMode}>
            <div style={styles.mainLayout}>

                {/* --- 1. Columna Izquierda (Controles) --- */}
                <div style={styles.leftPanel}>
                    <div style={styles.controlPanel}>
                        <h3 style={styles.sectionHeader}><Compass size={16} /> {t('walks.title')}</h3>
                        <div style={styles.walkButtonsContainer}>
                            {(['zigzag', 'spiral', 'findPath'] as WalkType[]).map(type => (
                                <button key={type} className={`walk-button ${activeWalk === type ? 'active' : ''}`} onClick={() => setActiveWalk(type)}>
                                    {t(`walks.${type}`)}
                                </button>
                            ))}
                        </div>
                        
                        {(activeWalk === 'spiral' || activeWalk === 'findPath') && (
                            <div style={styles.inputPanel}>
                                <span style={{ marginTop: '20px', fontWeight: 600, color: 'var(--text-secondary)' }}>{t('input.input')}:</span>
                                <WalkInputs activeWalk={activeWalk} inputs={inputs} onInputChange={handleInputChange} />
                            </div>
                        )}
                        
                        <div style={{...styles.sectionHeader, marginTop: '2rem'}}><SlidersHorizontal size={16} /> {t('controls.title')}</div>
                         <div style={styles.actionButtons}>
                            <button className="icon-button" onClick={handleStart} disabled={!activeWalk} title={t('controls.play')}>
                                <Play size={20} />
                            </button>
                            {animationState === 'running' && (
                                // NOTA: Se ha añadido la clave 'controls.stop' para la traducción.
                                <button className="icon-button" onClick={handleStop} title={t('controls.stop', 'Stop')}>
                                    <Square size={20} />
                                </button>
                            )}
                            <button title={t('controls.reset')} className="icon-button" onClick={() => handleReset(false)}>
                                <RefreshCw size={20} />
                            </button>
                        </div>

                        {foundRoutes.length > 0 && (
                            <div style={{marginTop: '2rem'}}>
                                {/* NOTA: Se ha añadido la clave 'routeOptions.title' para la traducción. */}
                                <h3 style={styles.sectionHeader}><Route size={16} /> {t('controls.routeoption', 'Route Options')}</h3>
                                <div style={styles.routeButtonsContainer}>
                                    {foundRoutes.map((route, index) => {
                                        // NOTA: Se han añadido las claves 'routeOptions.shortest', 'routeOptions.longest', 'routeOptions.any'.
                                        const label = route.isShortest 
                                            ? t('routeOptions.shortest', 'Shortest') 
                                            : route.isLongest 
                                            ? t('routeOptions.longest', 'Longest') 
                                            : t('routeOptions.any', 'Any ({{direction}})', { direction: route.direction });
                                        const tooltipText = `${label}: ${route.pathValues.join(' → ')}`;
                                        return (
                                            <button key={index} className="route-button" onClick={() => handlePathButtonClick(route)} title={tooltipText}>
                                                {label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- 2. Columna Central (Matriz) --- */}
                <div style={styles.centerPanel}>
                    <div style={styles.matrixContainer}>
                      
                        <MatrixDisplay matrix={initialMatrix} turtlePos={turtlePos} visited={visited} turtleImage={TURTLE_IMAGE_URL}/>
                    </div>
                </div>

                {/* --- 3. Columna Derecha (Log) --- */}
                <div style={styles.rightPanel}>
                    <div style={styles.logPanel}>
                        <div style={styles.logHeader}>
                            <span><FileText size={16} /> {t('log.header')}</span>
                            <button className="clear-button" onClick={() => { setLogs([]); addLog(t('log.cleared')); }}>{t('log.clear')}</button>
                        </div>
                        <div style={styles.logContent} className="log-content">
                            {logs.map((log, i) => <div key={i}><strong>{log.timestamp}</strong>: {log.message}</div>)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default TurtlePage;
