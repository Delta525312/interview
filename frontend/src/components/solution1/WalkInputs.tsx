import React from 'react';
import { useTranslation } from 'react-i18next';
import { styles } from './turtle-styles';

type WalkType = 'zigzag' | 'spiral' | 'findPath';

interface Props {
  activeWalk: WalkType | null;
  inputs: { [key: string]: string };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const WalkInputs: React.FC<Props> = ({ activeWalk, inputs, onInputChange }) => {
  const { t } = useTranslation();

  if (!activeWalk || activeWalk === 'zigzag') return null;

  const handleValidatedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Allow only single digits
    if (/^[0-9]?$/.test(value)) {
      onInputChange(e);
    }
  };

  return (
    <div style={styles.inputPanel}>
      {activeWalk === 'spiral' && (
        <>
          <span style={{ color: '#6b7280' }}>X:</span>
          <input name="spiralX" value={inputs.spiralX} onChange={handleValidatedChange} placeholder={t('num')} style={styles.inputField} required />
          <span style={{ color: '#6b7280' }}>Y:</span>
          <input name="spiralY" value={inputs.spiralY} onChange={handleValidatedChange} placeholder={t('num')} style={styles.inputField} required />
        </>
      )}
      {activeWalk === 'findPath' && (
        <>
          <span style={{ color: '#6b7280' }}>Start:</span>
          <input name="startValue" value={inputs.startValue} onChange={handleValidatedChange} placeholder={t('num')} style={styles.inputField} required />
          <span style={{ color: '#6b7280' }}>End:</span>
          <input name="endValue" value={inputs.endValue} onChange={handleValidatedChange} placeholder={t('num')} style={styles.inputField} required />
        </>
      )}
    </div>
  );
};
