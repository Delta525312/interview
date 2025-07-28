import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';


//-----------------------------------ยังบ่ได้ใช้-----------------------------------

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'dots' | 'pulse' | 'bars' | 'ring';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  variant = 'default',
  color,
  text,
  fullScreen = false,
}) => {
  const { themeMode } = useTheme();
  const isDark = themeMode === 'dark';

  const sizeMap = {
    small: 24,
    medium: 40,
    large: 64,
  };

  const spinnerSize = sizeMap[size];
  const primaryColor = color || '#8b5cf6';

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    ...(fullScreen && {
      position: 'fixed',
      inset: 0,
      backgroundColor: isDark ? 'rgba(26, 29, 41, 0.9)' : 'rgba(243, 244, 246, 0.9)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
    }),
  };

  const textStyle: React.CSSProperties = {
    fontSize: size === 'small' ? '0.875rem' : '1rem',
    fontWeight: 500,
    color: isDark ? '#e5e7eb' : '#4b5563',
    marginTop: '0.5rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  };

  const keyframesStyle = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.9); }
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-${spinnerSize / 4}px); }
    }
    @keyframes scaleIn {
      0%, 100% { transform: scale(0); opacity: 0; }
      50% { transform: scale(1); opacity: 1; }
    }
    @keyframes slideIn {
      0% { transform: scaleX(0); }
      50% { transform: scaleX(1); }
      100% { transform: scaleX(0); }
    }
  `;

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div style={{ display: 'flex', gap: `${spinnerSize / 8}px` }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: `${spinnerSize / 3}px`,
                  height: `${spinnerSize / 3}px`,
                  borderRadius: '50%',
                  backgroundColor: primaryColor,
                  animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite`,
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div style={{ position: 'relative', width: spinnerSize, height: spinnerSize }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                backgroundColor: primaryColor,
                opacity: 0.6,
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: `${spinnerSize / 4}px`,
                borderRadius: '50%',
                backgroundColor: primaryColor,
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) 0.5s infinite',
              }}
            />
          </div>
        );

      case 'bars':
        return (
          <div style={{ display: 'flex', gap: `${spinnerSize / 10}px`, alignItems: 'center' }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  width: `${spinnerSize / 8}px`,
                  height: `${spinnerSize}px`,
                  backgroundColor: primaryColor,
                  borderRadius: `${spinnerSize / 16}px`,
                  animation: `scaleIn 1.2s ease-in-out ${i * 0.1}s infinite`,
                  transformOrigin: 'center',
                }}
              />
            ))}
          </div>
        );

      case 'ring':
        return (
          <div style={{ position: 'relative', width: spinnerSize, height: spinnerSize }}>
            <svg
              width={spinnerSize}
              height={spinnerSize}
              viewBox={`0 0 ${spinnerSize} ${spinnerSize}`}
              style={{ animation: 'spin 2s linear infinite' }}
            >
              <circle
                cx={spinnerSize / 2}
                cy={spinnerSize / 2}
                r={spinnerSize / 2 - 4}
                fill="none"
                stroke={isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
                strokeWidth="3"
              />
              <circle
                cx={spinnerSize / 2}
                cy={spinnerSize / 2}
                r={spinnerSize / 2 - 4}
                fill="none"
                stroke={primaryColor}
                strokeWidth="3"
                strokeDasharray={`${Math.PI * (spinnerSize - 8) * 0.25} ${Math.PI * (spinnerSize - 8) * 0.75}`}
                strokeLinecap="round"
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: '25%',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${primaryColor}20 0%, transparent 70%)`,
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
          </div>
        );

      default:
        return (
          <div style={{ position: 'relative', width: spinnerSize, height: spinnerSize }}>
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: `${spinnerSize / 10}px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                borderTopColor: primaryColor,
                animation: 'spin 0.8s linear infinite',
                boxShadow: `0 0 ${spinnerSize / 2}px ${primaryColor}30`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: '30%',
                borderRadius: '50%',
                border: `${spinnerSize / 15}px solid transparent`,
                borderTopColor: primaryColor,
                borderRightColor: primaryColor,
                animation: 'spin 1.2s linear reverse infinite',
                opacity: 0.5,
              }}
            />
          </div>
        );
    }
  };

  return (
    <>
      <style>{keyframesStyle}</style>
      <div style={containerStyle}>
        {renderSpinner()}
        {text && <div style={textStyle}>{text}</div>}
      </div>
    </>
  );
};

// Standalone loading overlay component
export const LoadingOverlay: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => {
  return <LoadingSpinner fullScreen size="large" variant="ring" text={text} />;
};