import React from 'react';

// --- Paleta de Colores de Referencia (Tema Claro) ---
const lightThemeColors = {
  primary: '#7c3aed',
  primaryLight: '#f5f3ff',
  success: '#10b981',
  successLight: '#d1fae5',
  successDarkText: '#065f46',
  text: '#1f2937',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
  background: '#f9fafb',
  white: '#ffffff',
};

// --- Estilos de Componentes (usando variables CSS para el tema) ---
export const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    fontFamily: "'Inter', sans-serif",
    padding: '2rem',
    backgroundColor: 'var(--page-bg)',
    color: 'var(--text-primary)',
    minHeight: '100vh',
    transition: 'background-color 0.3s, color 0.3s',
  },
  // --- MODIFICADO: Layout หลักเป็น Flexbox แบบ responsive ---
  mainLayout: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexWrap: 'wrap', // เพิ่ม wrap สำหรับหน้าจอเล็ก
  },
  // --- MODIFICADO: Panel ซ้ายสำหรับส่วนควบคุม ---
  leftPanel: {
    flex: '0 0 350px',
    position: 'sticky',
    top: '2rem',
    minWidth: '300px', // ขนาดต่ำสุด
  },
  // --- ใหม่: Panel กลางสำหรับ Matrix ---
  centerPanel: {
    flex: '1 1 auto',
    display: 'flex',
    justifyContent: 'center',
    minWidth: '300px', // ขนาดต่ำสุด
  },
  // --- MODIFICADO: Panel ขวาสำหรับ Log ---
  rightPanel: {
    flex: '0 0 340px',
    position: 'sticky',
    top: '2rem',
    minWidth: '300px', // ขนาดต่ำสุด
  },
  sectionHeader: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  controlPanel: {
    padding: '1.5rem',
    backgroundColor: 'var(--panel-bg)',
    borderRadius: '14px',
    boxShadow: 'var(--shadow-md)',
    border: '1px solid',
    transition: 'box-shadow 0.3s ease, background-color 0.3s, border-color 0.3s',
  },
  actionsContainer: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'flex-start',
    marginTop: '1.5rem',
  },
  controlsSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  actionButtons: {
      display: 'flex',
      gap: '1rem',
  },
  routeOptionsSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  routeButtonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '0.75rem',
  },
  walkButtonsContainer: {
    display: 'flex',
    gap: '1rem',
    flexDirection: 'column',
   
  },
  // --- MODIFICADO: Matrix Container แบบ responsive ---
matrixContainer: {
  padding: '2rem',
  backgroundColor: 'var(--panel-bg)',
  borderRadius: '14px',
  boxShadow: 'var(--shadow-lg)',
  width: '100%',
  maxWidth: '500px',  

  margin: '3rem auto 2rem auto',
},

grid: {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, minmax(50px, 1fr))', // ⬅️ กำหนดขั้นต่ำต่อคอลัมน์ให้ใหญ่ขึ้น
  gap: 'clamp(6px, 1vw, 10px)', // เพิ่มช่องห่างเล็กน้อย
  aspectRatio: '7/5',
  width: '100%',
  maxWidth: '540px',  
  rowGap: 'clamp(25px, 1.5vw, 16px)',
},

cell: {
  aspectRatio: '1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1.5px solid',
  borderRadius: 'clamp(8px, 1.5vw, 12px)', // กว้างขึ้นเล็กน้อย
  fontSize: 'clamp(1.2rem, 3.5vw, 1.8rem)', // ⬅️ ใหญ่ขึ้น
  fontWeight: 700,
  color: 'var(--text-primary)',
  backgroundColor: 'var(--cell-bg)',
  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  minHeight: '50px', // เพิ่มความสูงต่ำสุด
},

  cellVisited: {
    backgroundColor: 'var(--success-light)',
    borderColor: 'black',
    color: 'var(--success-dark-text)',
    transform: 'scale(1.05)',
    boxShadow: `0 0 12px var(--success-glow)`,
  },
  turtle: {
    width: '85%',
    height: '85%',
    objectFit: 'contain',
    animation: 'turtle-bounce 0.5s infinite alternate',
  },
  logPanel: {
    height: 'calc(100vh - 4rem)', // ทำให้สูงเกือบเต็มจอ
    maxHeight: '600px', // ความสูงสูงสุด
    backgroundColor: 'var(--panel-bg)',
    borderRadius: '14px',
    boxShadow: 'var(--shadow-lg)',
    border: '1px solid',
    display: 'flex',
    flexDirection: 'column',
    fontSize: '1rem',
  },
  logHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    borderBottom: `1.5px solid var(--border-color)`,
    fontWeight: 600,
    color: 'var(--text-secondary)',
    userSelect: 'none',
  },
  logContent: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: '0 1.5rem 1.5rem 1.5rem',
    marginTop: '1rem',
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.7,
  },
  inputPanel: {
    marginTop: '1.5rem',
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  inputField: {
    borderRadius: '6px',
    padding: '6px 10px',
    fontSize: '0.9rem',
    width: '50px',
    border: '1px solid',
    backgroundColor: 'var(--page-bg)',
    color: 'var(--text-primary)',
  },
};

// --- Estilos Dinámicos (Clases y Animaciones) ---
export function addDynamicStyles() {
  const styleSheetId = 'turtle-dynamic-styles-responsive'; // Version update
  if (document.getElementById(styleSheetId)) return;

  const styleSheet = document.createElement("style");
  styleSheet.id = styleSheetId;
  styleSheet.innerText = `
    /* === VARIABLES DE TEMA === */
    :root, [data-theme="light"] {
      --page-bg: ${lightThemeColors.background};
      --panel-bg: ${lightThemeColors.white};
      --cell-bg: ${lightThemeColors.white};
      --border-color: ${lightThemeColors.border};
      --text-primary: ${lightThemeColors.text};
      --text-secondary: ${lightThemeColors.textSecondary};
      --primary: ${lightThemeColors.primary};
      --primary-light: ${lightThemeColors.primaryLight};
      --success: ${lightThemeColors.success};
      --success-light: ${lightThemeColors.successLight};
      --success-dark-text: ${lightThemeColors.successDarkText};
      --success-glow: ${lightThemeColors.success}55;
      --shadow-md: 0 8px 15px rgba(124, 58, 237, 0.1);
      --shadow-lg: 0 10px 20px rgba(0,0,0,0.07);
    }
    [data-theme="dark"] {
      --page-bg: #111827;
      --panel-bg: #1f2937;
      --cell-bg: #374151;
      --border-color: #374151;
      --text-primary: #f9fafb;
      --text-secondary: #9ca3af;
      --primary: #a78bfa;
      --primary-light: #3730a3;
      --success: #34d399;
      --success-light: #047857;
      --success-dark-text: #a7f3d0;
      --success-glow: #34d39944;
      --shadow-md: 0 8px 15px rgba(0, 0, 0, 0.2);
      --shadow-lg: 0 10px 20px rgba(0,0,0,0.25);
    }

    /* === ANIMACIONES === */
    @keyframes turtle-bounce {
      from { transform: translateY(0); }
      to { transform: translateY(-5px); }
    }

    /* === ESTILOS DE BOTONES === */
    .walk-button {
      padding: 12px 24px;
      font-size: 1rem;
      border: 1.5px solid var(--border-color);
      border-radius: 12px;
      background-color: var(--panel-bg);
      color: var(--text-primary);
      cursor: pointer;
      font-weight: 700;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 3px 6px rgba(0,0,0,0.05);
      user-select: none;
    }
    .walk-button:hover {
      border-color: var(--primary);
      transform: translateY(-3px);
      box-shadow: var(--shadow-md);
    }
    .walk-button.active {
      background-color: var(--success);
      color: white;
      border-color: var(--success);
      transform: translateY(-3px);
      box-shadow: 0 12px 25px ${lightThemeColors.success}40;
    }
    [data-theme="dark"] .walk-button.active {
        box-shadow: 0 12px 25px #34d39930;
    }
    .walk-button:disabled {
      opacity: 0.55;
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    }

    .icon-button {
      background: var(--primary-light);
      border: none;
      border-radius: 50%;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      color: var(--primary);
      cursor: pointer;
      transition: all 0.3s ease;
      user-select: none;
      box-shadow: 0 3px 10px rgba(124, 58, 237, 0.15);
    }
    .icon-button:hover {
      transform: scale(1.15);
      box-shadow: 0 6px 15px rgba(124, 58, 237, 0.35);
    }
    [data-theme="dark"] .icon-button {
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
    }
    [data-theme="dark"] .icon-button:hover {
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
    }

    .clear-button {
      background: var(--page-bg);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      color: var(--text-secondary);
      cursor: pointer;
      font-weight: 600;
      padding: 10px 16px;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      user-select: none;
    }
    .clear-button:hover {
      color: var(--text-primary);
      border-color: var(--text-secondary);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .route-button {
      padding: 0.75rem 1rem;
      font-size: 0.9rem;
      border: 1.5px solid var(--border-color);
      border-radius: 10px;
      background-color: var(--panel-bg);
      color: var(--text-secondary);
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s ease;
      text-align: center;
    }
    .route-button:hover {
        background-color: var(--page-bg);
        color: var(--primary);
        border-color: var(--primary);
        transform: translateY(-2px);
    }
    
    /* === BARRA DE SCROLL PERSONALIZADA === */
    .log-content::-webkit-scrollbar { width: 10px; }
    .log-content::-webkit-scrollbar-track { background: var(--page-bg); border-radius: 10px;}
    .log-content::-webkit-scrollbar-thumb { background: var(--primary-light); border-radius: 10px;}
    .log-content::-webkit-scrollbar-thumb:hover { background: var(--primary); }

    /* === RESPONSIVE STYLES === */
    @media (max-width: 1200px) {
      .main-layout {
        flex-direction: column;
        align-items: center;
      }
      
      .left-panel, .right-panel {
        position: relative;
        width: 100%;
        max-width: 500px;
      }
      
      .center-panel {
        width: 100%;
        order: -1; /* ให้ matrix อยู่ข้างบนในมือถือ */
      }
    }
    
    @media (max-width: 768px) {
      .page-container {
        padding: 1rem;
      }
      
      .main-layout {
        gap: 1rem;
      }
      
      .control-panel, .log-panel {
        padding: 1rem;
      }
      
      .grid {
        gap: clamp(2px, 0.5vw, 6px);
        max-width: 300px;
      }
      
      .cell {
        font-size: clamp(0.8rem, 2.5vw, 1.2rem);
        border-radius: 6px;
        min-height: 35px;
      }
      
      .actions-container {
        flex-direction: column;
        gap: 1rem;
      }
      
      .action-buttons {
        justify-content: center;
      }
      
      .route-buttons-container {
        justify-content: center;
      }
    }
    
    @media (max-width: 480px) {
      .page-container {
        padding: 0.5rem;
      }
      
      .grid {
        max-width: 280px;
        gap: clamp(1px, 0.3vw, 4px);
      }
      
      .cell {
        font-size: clamp(0.7rem, 2vw, 1rem);
        min-height: 30px;
        border-radius: 4px;
      }
      
      .control-panel, .log-panel {
        padding: 0.75rem;
        border-radius: 10px;
      }
      
      .section-header {
        font-size: 0.8rem;
        margin-bottom: 0.75rem;
      }
      
      .walk-button {
        padding: 10px 16px;
        font-size: 0.9rem;
      }
      
      .route-button {
        padding: 0.5rem 0.75rem;
        font-size: 0.8rem;
      }
      
      .icon-button {
        width: 36px;
        height: 36px;
        font-size: 1.1rem;
      }
      
      .log-panel {
        height: auto;
        max-height: 400px;
      }
      
      .input-field {
        width: 40px;
        padding: 4px 6px;
        font-size: 0.8rem;
      }
    }
    
    @media (max-width: 360px) {
      .grid {
        max-width: 250px;
      }
      
      .cell {
        font-size: clamp(0.6rem, 1.8vw, 0.9rem);
        min-height: 25px;
      }
      
      .walk-button {
        padding: 8px 12px;
        font-size: 0.8rem;
      }
      
      .route-buttons-container {
        gap: 0.5rem;
      }
      
      .route-button {
        padding: 0.4rem 0.6rem;
        font-size: 0.75rem;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}