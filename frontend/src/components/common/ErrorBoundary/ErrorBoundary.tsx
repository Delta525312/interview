import React, { Component, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import { withTranslation, WithTranslation } from 'react-i18next';

const ErrorFallback = ({ isDark, t }: { isDark: boolean; t: any }) => {
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '2rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    background: isDark
      ? 'radial-gradient(ellipse at bottom, #1e1b4b 0%, #111827 50%, #030712 100%)'
      : 'radial-gradient(ellipse at bottom, #fef3c7 0%, #fde68a 50%, #fbbf24 100%)',
    color: isDark ? '#f1f5f9' : '#1e293b',
    position: 'relative',
    overflow: 'hidden',
  };

  const backgroundPatternStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0zm40 0h20v20H40zm40 0h20v20H80zM20 20h20v20H20zm40 0h20v20H60zM0 40h20v20H0zm40 0h20v20H40zm40 0h20v20H80zM20 60h20v20H20zm40 0h20v20H60zM0 80h20v20H0zm40 0h20v20H40zm40 0h20v20H80z' fill='${isDark ? '%23ef4444' : '%23dc2626'}' fill-opacity='0.03'/%3E%3C/svg%3E")`,
    opacity: 0.5,
  };

  const contentWrapperStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
    animation: 'fadeInUp 0.8s ease-out',
  };

  const iconStyle: React.CSSProperties = {
    width: '120px',
    height: '120px',
    margin: '0 auto 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: isDark
      ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%)',
    boxShadow: isDark
      ? '0 8px 32px rgba(239, 68, 68, 0.2)'
      : '0 8px 32px rgba(251, 191, 36, 0.3)',
    animation: 'pulse 2s ease-in-out infinite',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
    margin: '0 0 1rem 0',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    background: isDark
      ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
      : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: 'clamp(1rem, 2vw, 1.125rem)',
    maxWidth: '500px',
    marginBottom: '2rem',
    opacity: 0.8,
    lineHeight: 1.7,
    fontWeight: 400,
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '0.875rem 1.75rem',
    fontSize: '1rem',
    fontWeight: 600,
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
  };

  const primaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    color: '#ffffff',
    background: isDark
      ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
      : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    boxShadow: isDark
      ? '0 4px 25px rgba(239, 68, 68, 0.25)'
      : '0 4px 25px rgba(245, 158, 11, 0.25)',
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    color: isDark ? '#ef4444' : '#f59e0b',
    background: 'transparent',
    border: `2px solid ${isDark ? '#ef4444' : '#f59e0b'}`,
  };

  const glowStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '400px',
    height: '400px',
    background: isDark
      ? 'radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, transparent 70%)'
      : 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    animation: 'glow 4s ease-in-out infinite',
  };

  const decorativeStyle: React.CSSProperties = {
    position: 'absolute',
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    background: isDark
      ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)',
    filter: 'blur(60px)',
  };

  const keyframesStyle = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.05);
        opacity: 0.9;
      }
    }
    @keyframes glow {
      0%, 100% {
        opacity: 0.5;
        transform: translate(-50%, -50%) scale(1);
      }
      50% {
        opacity: 0.8;
        transform: translate(-50%, -50%) scale(1.2);
      }
    }
  `;

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      <style>{keyframesStyle}</style>
      <div style={containerStyle}>
        <div style={backgroundPatternStyle} />
        <div style={glowStyle} />
        <div style={{ ...decorativeStyle, top: '15%', right: '10%' }} />
        <div style={{ ...decorativeStyle, bottom: '10%', left: '5%' }} />
        
        <div style={contentWrapperStyle}>
          <div style={iconStyle}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#ef4444' : '#f59e0b'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          
          <h2 style={titleStyle}>{t('error.title', 'Oops! Something went wrong')}</h2>
          <p style={descriptionStyle}>
            {t(
              'error.description',
              'We encountered an unexpected error. Don\'t worry, you can try refreshing the page or return to the home page.'
            )}
          </p>
          
          <div style={buttonContainerStyle}>
            <button
              onClick={handleRefresh}
              style={primaryButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = isDark
                  ? '0 6px 35px rgba(239, 68, 68, 0.35)'
                  : '0 6px 35px rgba(245, 158, 11, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = isDark
                  ? '0 4px 25px rgba(239, 68, 68, 0.25)'
                  : '0 4px 25px rgba(245, 158, 11, 0.25)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              {t('error.refresh', 'Refresh Page')}
            </button>
            
            <Link 
              to="/" 
              style={secondaryButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = isDark
                  ? 'rgba(239, 68, 68, 0.1)'
                  : 'rgba(245, 158, 11, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              {t('error.backHome', 'Back to Home')}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

interface ErrorBoundaryProps extends WithTranslation {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class RawErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ThemeWrapper>
          {(isDark) => <ErrorFallback isDark={isDark} t={this.props.t} />}
        </ThemeWrapper>
      );
    }

    return this.props.children;
  }
}

const ThemeWrapper = ({ children }: { children: (isDark: boolean) => JSX.Element }) => {
  const { themeMode } = useTheme();
  const isDark = themeMode === 'dark';
  return children(isDark);
};

export const ErrorBoundary = withTranslation()(RawErrorBoundary);