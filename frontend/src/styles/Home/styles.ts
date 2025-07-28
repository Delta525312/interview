import { CSSProperties } from 'react';

export interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
}
const styles = {
  container: (maxWidth: string): CSSProperties => ({
    maxWidth,
    margin: '0 auto',
    
    padding: '0 24px'
  }),
  
  flexCenter: (): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }),
  
  flexBetween: (): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }),
  
  grid: (cols: number, gap: number = 24): CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: `${gap}px`,
    width: '100%'
  }),
  
  card: (colors: ThemeColors): CSSProperties => ({
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: '12px',
    padding: '24px',
    transition: 'all 0.3s ease'
  }),
  
  button: (bgColor: string): CSSProperties => ({
    backgroundColor: bgColor,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'opacity 0.3s ease',
    fontSize: '14px',
    fontWeight: '500'
  }),
  
  iconContainer: (bgColor: string, size: number = 48): CSSProperties => ({
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: bgColor,
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  }),
  
  gradientText: (): CSSProperties => ({
    background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  })
};
export default styles;