import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
  const { themeMode } = useTheme();
  const { t } = useTranslation();

  const isDark = themeMode === 'dark';

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '2rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: isDark ? '#1a1d29' : '#f3f4f6',
    color: isDark ? '#e5e7eb' : '#1f2937',
    position: 'relative',
    overflow: 'hidden',
  };

  const contentWrapperStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
    maxWidth: '600px',
    width: '100%',
    animation: 'fadeIn 0.6s ease-out',
  };

  const numberStyle: React.CSSProperties = {
    fontSize: 'clamp(8rem, 20vw, 12rem)',
    fontWeight: 800,
    margin: '0',
    lineHeight: 1,
    color: '#8b5cf6',
    letterSpacing: '-0.05em',
    marginBottom: '2rem',
    position: 'relative',
    textShadow: isDark 
      ? '0 0 80px rgba(139, 92, 246, 0.5)' 
      : '0 0 60px rgba(139, 92, 246, 0.3)',
  };

  const glowStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: 'clamp(8rem, 20vw, 12rem)',
    fontWeight: 800,
    color: '#8b5cf6',
    opacity: 0.15,
    filter: 'blur(30px)',
    zIndex: -1,
    pointerEvents: 'none',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
    fontWeight: 700,
    margin: '0 0 1rem 0',
    color: isDark ? '#f3f4f6' : '#111827',
    letterSpacing: '-0.025em',
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '1.125rem',
    margin: '0 0 2.5rem 0',
    opacity: 0.8,
    lineHeight: 1.6,
    color: isDark ? '#d1d5db' : '#4b5563',
  };

  const buttonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.875rem 2rem',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#ffffff',
    backgroundColor: '#8b5cf6',
    border: 'none',
    borderRadius: '12px',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.25)',
  };

  const buttonHoverStyle: React.CSSProperties = {
    backgroundColor: '#7c3aed',
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 20px 0 rgba(139, 92, 246, 0.35)',
  };

  const decorativeCircleStyle = (size: number, position: any): React.CSSProperties => ({
    position: 'absolute',
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    background: isDark
      ? 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)'
      : 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
    filter: 'blur(40px)',
    ...position,
  });

  const keyframesStyle = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  return (
    <>
      <style>{keyframesStyle}</style>
      <div style={containerStyle}>
        <div style={decorativeCircleStyle(300, { top: '-10%', left: '-5%' })} />
        <div style={decorativeCircleStyle(200, { bottom: '10%', right: '-10%' })} />
        <div style={decorativeCircleStyle(150, { top: '60%', left: '70%' })} />
        
        <div style={contentWrapperStyle}>
          <div style={{ position: 'relative' }}>
            <h1 style={numberStyle}>404</h1>
            <div style={glowStyle}>404</div>
          </div>
          
          <h2 style={titleStyle}>
            {t('notFound.title', 'Page Not Found')}
          </h2>
          
          <p style={descriptionStyle}>
            {t('notFound.description', 'The page you are looking for might have been removed or is temporarily unavailable.')}
          </p>
          
          <Link 
            to="/" 
            style={buttonStyle}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            {t('notFound.backHome', 'Back to Home')}
          </Link>
        </div>
      </div>
    </>
  );
};  
export default NotFound;