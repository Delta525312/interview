const styles = `
  @keyframes pulse {
    50% {
      opacity: .5;
    }
  }

  .simulation-app {
    min-height: 100vh;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    font-family: sans-serif;
    transition: background 0.2s, color 0.2s;
  }
  [data-theme='dark'] .simulation-app {
    background-color: #111827;
    color: #f9fafb;
  }
  [data-theme='light'] .simulation-app {
    background-color: #f9fafb;
    color: #111827;
  }

  .app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #374151;
    padding-bottom: 1rem;
  }

  .app-title {
    font-size: 1.875rem;
    line-height: 2.25rem;
    font-weight: 700;
    transition: color 0.2s;
  }
  [data-theme='dark'] .app-title {
    color: #ffffff;
  }
  [data-theme='light'] .app-title {
    color: #111827;
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .main-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    flex-grow: 1;
  }

  @media (min-width: 1024px) {
    .main-content {
      grid-template-columns: repeat(3, 1fr);
    }
    .control-panel {
       grid-column: span 1 / span 1;
    }
    .log-viewer {
       grid-column: span 2 / span 2;
    }
  }

  .panel {
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    transition: background 0.2s;
  }
  [data-theme='dark'] .panel {
    background-color: #1f2937;
  }
  [data-theme='light'] .panel {
    background-color: #ffffff;
  }

  .control-panel {
    height: fit-content;
  }
  
  .panel-title {
    font-size: 1.25rem;
    line-height: 1.75rem;
    font-weight: 600;
    margin-bottom: 1rem;
    transition: color 0.2s;
  }
  [data-theme='dark'] .panel-title {
    color: #ffffff;
  }
  [data-theme='light'] .panel-title {
    color: #111827;
  }
  
  .controls-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group label {
    display: block;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    transition: color 0.2s;
  }
  [data-theme='dark'] .form-group label {
    color: #9ca3af;
  }
  [data-theme='light'] .form-group label {
    color: #374151;
  }

  .select-input {
    width: 100%;
    padding: 0.5rem;
    border-radius: 0.375rem;
    border: 1px solid #4b5563;
    transition: background 0.2s, color 0.2s;
  }
  [data-theme='dark'] .select-input {
    background-color: #374151;
    color: #ffffff;
  }
  [data-theme='light'] .select-input {
    background-color: #f3f4f6;
    color: #111827;
  }
  .select-input:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    border-color: #3b82f6;
  }
  .select-input:disabled {
    opacity: 0.5;
  }

  .button-group {
    display: flex;
    gap: 1rem;
  }

  .btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    font-weight: 700;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }

  .btn:hover {
    transform: scale(1.05);
  }
  
  .btn:disabled {
    background-color: #4b5563;
    cursor: not-allowed;
    transform: none;
  }

  .btn-primary {
    background-color: #2563eb;
    color: #ffffff;
  }
  .btn-primary:hover:not(:disabled) {
    background-color: #3b82f6;
  }
  
  .btn-danger {
    background-color: #dc2626;
    color: #ffffff;
  }
  .btn-danger:hover:not(:disabled) {
    background-color: #ef4444;
  }

  .btn-success {
    background-color: #16a34a;
    color: #ffffff;
  }
  .btn-success:hover:not(:disabled) {
    background-color: #22c55e;
  }
  .btn-success:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .status-display {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border-radius: 0.5rem;
    transition: background 0.2s;
  }
  [data-theme='dark'] .status-display {
    background-color: #374151;
  }
  [data-theme='light'] .status-display {
    background-color: #f3f4f6;
  }

  .status-text {
    font-weight: 500;
    font-size: 1.125rem;
    line-height: 1.75rem;
    transition: color 0.2s;
  }
  [data-theme='dark'] .status-text {
    color: #ffffff;
  }
  [data-theme='light'] .status-text {
    color: #111827;
  }

  .status-icon-running {
    color: #facc15;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .log-viewer {
    display: flex;
    flex-direction: column;
  }
  
  .log-viewer-header {
    padding: 1.25rem;
    border-bottom: 1px solid #374151;
  }

  .log-container {
    flex-grow: 1;
    padding: 1.25rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .log-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    transition: color 0.2s;
  }
  [data-theme='dark'] .log-placeholder {
    color: #6b7280;
  }
  [data-theme='light'] .log-placeholder {
    color: #9ca3af;
  }
  
  .log-line {
    display: flex;
    font-family: monospace;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
  
  .log-timestamp {
    margin-right: 0.75rem;
    white-space: nowrap;
    transition: color 0.2s;
  }
  [data-theme='dark'] .log-timestamp {
    color: #6b7280;
  }
  [data-theme='light'] .log-timestamp {
    color: #9ca3af;
  }
  
  .log-level {
    width: 80px;
    font-weight: 700;
    margin-right: 0.75rem;
  }
  
  .log-message {
    flex: 1;
    transition: color 0.2s;
  }
  [data-theme='dark'] .log-message {
    color: #e5e7eb;
  }
  [data-theme='light'] .log-message {
    color: #374151;
  }
  
  .log-level-INFO { color: #9ca3af; }
  .log-level-WARNING { color: #facc15; }
  .log-level-ERROR { color: #ef4444; }
  .log-level-SYSTEM { color: #60a5fa; font-weight: 700; }
`;
export default styles;