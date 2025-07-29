
// Define the structure for our theme palettes
interface Palette {
  background: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  cardBg: string;
  cardBorder: string;
  inputBg: string;
  inputBorder: string;
  inputPlaceholder: string;
  accent: string;
  accentLight: string;
  buttonBg: string;
  buttonText: string;
  success: string;
  successBg: string;
  successBorder: string;
  error: string;
  errorBg: string;
  errorBorder: string;
  listItemBg: string;
  listItemBgHover: string;
  urlItemBg: string;
  urlItemBgHover: string;
  panelBg: string;
}

// Define NEW color palettes for both light and dark themes
const palettes: { light: Palette; dark: Palette } = {
  light: {
    background: '#f9fafb',
    text: '#1f2937',
    textSecondary: '#4b5563',
    textTertiary: '#6b7280',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    cardBorder: '1px solid #e5e7eb',
    inputBg: '#ffffff',
    inputBorder: '#d1d5db',
    inputPlaceholder: '#9ca3af',
    accent: '#4f46e5',
    accentLight: '#6366f1',
    buttonBg: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    buttonText: '#ffffff',
    success: '#059669',
    successBg: 'rgba(16, 185, 129, 0.1)',
    successBorder: '1px solid rgba(16, 185, 129, 0.2)',
    error: '#dc2626',
    errorBg: 'rgba(220, 38, 38, 0.1)',
    errorBorder: '1px solid rgba(220, 38, 38, 0.2)',
    listItemBg: '#f3f4f6',
    listItemBgHover: '#e5e7eb',
    urlItemBg: '#f3f4f6',
    urlItemBgHover: '#e5e7eb',
    panelBg: 'rgba(255,255,255,0.98)',
  },
  dark: {
    background: '#111827',
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    textTertiary: '#9ca3af',
    cardBg: 'rgba(31, 41, 55, 0.5)',
    cardBorder: '1px solid #4b5563',
    inputBg: '#1f2937',
    inputBorder: '#4b5563',
    inputPlaceholder: '#6b7280',
    accent: '#818cf8',
    accentLight: '#a5b4fc',
    buttonBg: 'linear-gradient(135deg, #6366f1, #a78bfa)',
    buttonText: '#ffffff',
    success: '#6ee7b7',
    successBg: 'rgba(16, 185, 129, 0.15)',
    successBorder: '1px solid rgba(16, 185, 129, 0.3)',
    error: '#fca5a5',
    errorBg: 'rgba(220, 38, 38, 0.15)',
    errorBorder: '1px solid rgba(220, 38, 38, 0.3)',
    listItemBg: '#1f2937',
    listItemBgHover: '#374151',
    urlItemBg: '#1f2937',
    urlItemBgHover: '#374151',
    panelBg: 'rgba(31,41,55,0.98)',
  }
};

// Function to generate styles based on the current theme
export const getStyles = (theme: 'light' | 'dark' = 'dark') => {
  const palette = palettes[theme];

  return {
    palette,
    container: {
        minHeight: '100vh',
        background: palette.background,
        color: palette.text,
        padding: '1.5rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        transition: 'background 0.3s ease, color 0.3s ease'
    },
    wrapper: {
        maxWidth: '1200px',
        margin: '0 auto'
    },
    header: {
        textAlign: 'center' as const,
        marginBottom: '2rem'
    },
    iconContainer: {
        display: 'inline-block',
        padding: '0.8rem',
        background: palette.buttonBg,
        borderRadius: '1rem',
        marginBottom: '1rem',
        boxShadow: `0 10px 25px -5px rgba(100, 100, 200, 0.2)`,
        transition: 'transform 0.3s ease'
    },
    title: {
        fontSize: 'clamp(1.8rem, 5vw, 2.2rem)',
        fontWeight: '900',
        color: palette.text
    },
    subtitle: {
        fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
        color: palette.textSecondary,
        fontWeight: 300,
        maxWidth: '600px',
        margin: '0.5rem auto 0 auto'
    },
    layoutGrid: {
        display: 'grid',
        gridTemplateColumns: '2fr minmax(420px, 1fr)',
        gap: '1.5rem',
        alignItems: 'start',
        className: 'layout-grid',
    },
    leftColumn: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '1.5rem'
    },
    rightColumn: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '1.5rem'
    },
    authContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: palette.background,
        padding: '1.5rem'
    },
    authCard: {
        background: palette.cardBg,
        backdropFilter: 'blur(10px)',
        border: palette.cardBorder,
        borderRadius: '1rem',
        padding: 'clamp(1.5rem, 5vw, 2.5rem)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '420px',
        textAlign: 'center' as const
    },
    authForm: {
        marginTop: '1.5rem',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '1rem'
    },
    mainCard: {
        background: palette.cardBg,
        backdropFilter: 'blur(10px)',
        border: palette.cardBorder,
        borderRadius: '1rem',
        padding: '1.5rem',
        marginBottom: 0,
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.07)'
    },
    inputBox: {
        display: 'flex',
        alignItems: 'center',
        background: palette.inputBg,
        borderRadius: '0.6rem',
        border: `1px solid ${palette.inputBorder}`,
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        overflow: 'hidden'
    },
    input: {
        flex: 1,
        background: 'transparent',
        border: 'none',
        outline: 'none',
        padding: '0.9rem',
        color: palette.text,
        fontSize: '0.95rem',
        fontFamily: 'inherit',
        minWidth: '150px'
    },
    button: {
        padding: '0.75rem 1.25rem',
        background: palette.buttonBg,
        color: palette.buttonText,
        border: 'none',
        borderRadius: '0.5rem',
        margin: '0.25rem',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        justifyContent: 'center',
        transition: 'all 0.3s ease'
    },
    errorBox: {
        background: palette.errorBg,
        border: `1px solid ${palette.errorBorder}`,
        color: palette.error,
        padding: '0.8rem 1rem',
        borderRadius: '0.6rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.9rem'
    },
    successBox: {
        background: palette.successBg,
        border: `1px solid ${palette.successBorder}`,
        padding: '1rem',
        borderRadius: '0.75rem'
    },
    successHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.75rem'
    },
    successTitle: {
        color: palette.success,
        fontSize: '1rem',
        fontWeight: 'bold'
    },
    urlDisplay: {
        background: theme === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(243, 244, 246, 0.7)',
        padding: '0.75rem',
        borderRadius: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap' as const
    },
    urlLink: {
        color: palette.accent,
        fontFamily: 'monospace',
        fontSize: '0.9rem',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        flex: 1,
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap' as const
    },
    copyButton: {
        padding: '0.4rem 0.8rem',
        borderRadius: '0.5rem',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontWeight: 600,
        background: theme === 'dark' ? palette.listItemBgHover : palette.listItemBg,
        color: palette.textSecondary,
        transition: 'all 0.3s ease',
        fontSize: '0.8rem'
    },
    featuresGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem',
        marginTop: '1.5rem'
    },
    featureCard: {
        textAlign: 'center' as const,
        padding: '0.75rem',
        transition: 'all 0.2s ease',
        borderRadius: '0.75rem',
        cursor: 'pointer',
        background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
        border: `1px solid ${palette.cardBorder}`
    },
    featureIcon: {
        display: 'inline-flex',
        padding: '0.6rem',
        borderRadius: '50%',
        marginBottom: '0.5rem',
        background: 'rgba(139, 92, 246, 0.1)'
    },
    featureTitle: {
        fontSize: '0.9rem',
        fontWeight: 'bold',
        marginBottom: '0.25rem',
        color: palette.text
    },
    featureDesc: {
        color: palette.textSecondary,
        fontSize: '0.8rem',
        lineHeight: 1.4
    },
    recentCard: {
        background: palette.cardBg,
        backdropFilter: 'blur(10px)',
        border: palette.cardBorder,
        borderRadius: '1rem',
        padding: '1.5rem',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.07)'
    },
    recentHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        flexWrap: 'wrap' as const
    },
    recentTitle: {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: palette.text
    },
    clearButton: {
        background: 'none',
        border: 'none',
        color: palette.textTertiary,
        cursor: 'pointer',
        fontSize: '0.8rem',
        transition: 'color 0.3s ease'
    },
    managementCard: {
        background: palette.cardBg,
        backdropFilter: 'blur(10px)',
        border: palette.cardBorder,
        borderRadius: '1rem',
        padding: '0',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.07)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column' as const,
        height: 'calc(100vh - 220px)',
        minHeight: '500px'
    },
    lookupForm: {
        padding: '1.25rem',
        borderBottom: `1px solid ${palette.cardBorder}`,
    },
    tabsContainer: {
        display: 'flex',
        background: theme === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
        borderBottom: `1px solid ${palette.cardBorder}`
    },
    tabButton: {
        flex: 1,
        padding: '0.8rem',
        background: 'transparent',
        border: 'none',
        color: palette.textTertiary,
        fontSize: '0.9rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        borderBottom: '2px solid transparent'
    },
    tabButtonActive: {
        flex: 1,
        padding: '0.8rem',
        background: 'transparent',
        border: 'none',
        color: palette.accent,
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        borderBottom: `2px solid ${palette.accent}`
    },
    tabContent: {
        padding: '1.25rem',
        flex: 1,
        overflowY: 'auto' as const
    },
    listItem: {
        background: palette.listItemBg,
        borderRadius: '0.6rem',
        padding: '0.8rem 1rem',
        marginBottom: '0.75rem',
        border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`
    },
    listItemContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
    },
    urlItemLeft: {
        flex: 1,
        minWidth: 0
    },
    urlItem: {
        padding: '0.8rem',
        borderRadius: '0.6rem',
        marginBottom: '0.5rem',
        transition: 'all 0.3s ease'
    },
    urlItemContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
    },
    urlItemLink: {
        color: palette.accent,
        fontFamily: 'monospace',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        transition: 'color 0.3s ease',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap' as const,
        fontSize: '0.9rem'
    },
    urlItemOriginal: {
        color: palette.textTertiary,
        fontSize: '0.8rem',
        marginTop: '0.2rem',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap' as const
    },
    urlItemButton: {
        padding: '0.4rem',
        borderRadius: '0.5rem',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    listItemActions: {
        display: 'flex',
        gap: '0.25rem'
    },
    actionButton: {
        background: 'transparent',
        border: 'none',
        color: palette.textTertiary,
        padding: '0.4rem',
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease'
    },
    editInput: {
        width: '100%',
        background: palette.inputBg,
        border: `1px solid ${palette.inputBorder}`,
        outline: 'none',
        padding: '0.6rem',
        borderRadius: '0.5rem',
        color: palette.text,
        fontSize: '0.9rem'
    },
    logAction: {
        color: palette.textSecondary,
        fontWeight: '500',
        fontSize: '0.9rem'
    },
    logMeta: {
        color: palette.textTertiary,
        fontSize: '0.75rem',
        marginTop: '0.2rem'
    },
    modal: {
        background: palette.cardBg,
        backdropFilter: 'blur(15px)',
        border: palette.cardBorder,
        borderRadius: '0.75rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column' as const,
        overflow: 'hidden',
        zIndex: 1000,
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 1rem',
        borderBottom: palette.cardBorder,
        cursor: 'move',
        fontWeight: 600,
        color: palette.text,
    },
    modalContent: {
        padding: '1rem 1.5rem',
        flex: 1,
        overflowY: 'auto' as const,
        color: palette.textSecondary,
        lineHeight: 1.6,
    },
    modalCloseButton: {
        background: 'transparent',
        border: 'none',
        color: palette.textTertiary,
        cursor: 'pointer',
        padding: '0.25rem',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '50%',
        transition: 'color 0.2s, background-color 0.2s',
    },
  };
};