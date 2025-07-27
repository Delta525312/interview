import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useSound } from 'contexts/SoundContext';

interface IconButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'solid' | 'outline';
  active?: boolean;
}

const sizes = {
  sm: '36px',
  md: '44px',
  lg: '52px',
};

const StyledButton = styled(motion.button)<{
  $size: string;
  $variant: string;
  $active?: boolean;
}>`
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;
  overflow: hidden;

  ${({ $variant, theme, $active }) => {
    switch ($variant) {
      case 'ghost':
        return `
          background: ${$active ? theme.colors.primary + '20' : 'transparent'};
          border: none;
          color: ${$active ? theme.colors.primary : theme.colors.text.secondary};
          
          &:hover {
            background: ${theme.colors.surfaceHover};
            color: ${theme.colors.text.primary};
          }
        `;
      case 'solid':
        return `
          background: ${theme.colors.primary};
          border: none;
          color: white;
          box-shadow: ${theme.shadows.md};
          
          &:hover {
            background: ${theme.colors.primaryDark};
            box-shadow: ${theme.shadows.lg};
            transform: translateY(-1px);
          }
        `;
      case 'outline':
        return `
          background: transparent;
          border: 2px solid ${theme.colors.border};
          color: ${theme.colors.text.secondary};
          
          &:hover {
            border-color: ${theme.colors.primary};
            color: ${theme.colors.primary};
            background: ${theme.colors.primary + '10'};
          }
        `;
      default:
        return '';
    }
  }}

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  onClick,
  size = 'md',
  variant = 'ghost',
  active = false,
}) => {
  const { playSound } = useSound();

  const handleClick = () => {
    playSound('click');
    onClick?.();
  };

  return (
    <StyledButton
      $size={sizes[size]}
      $variant={variant}
      $active={active}
      onClick={handleClick}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
    >
      {children}
    </StyledButton>
  );
};
