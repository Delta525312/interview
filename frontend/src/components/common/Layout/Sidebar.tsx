import React, { useState } from 'react';
import { NavLink} from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSound } from 'contexts/SoundContext';
import {
  Home,
  Layers,
  Package,
  Box,
  Briefcase,
  FileText,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const SidebarWrapper = styled(motion.nav)`
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  position: relative; /* ไม่ fix */
  height: 100%;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto; /* เผื่อเนื้อหามากกว่า viewport */
`;

const LogoSection = styled(motion.div)<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.gradients.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      transparent 30%,
      rgba(255, 255, 255, 0.1) 50%,
      transparent 70%
    );
    transform: translateX(-100%);
    animation: shimmer 3s infinite;
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }

  svg {
    width: 32px;
    height: 32px;
    color: white;
    flex-shrink: 0;
  }

  h1 {
    font-size: 20px;
    color: white;
    font-weight: 700;
    white-space: nowrap;
    opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
    transition: opacity ${({ theme }) => theme.transitions.fast};
  }
`;
const NavContainer = styled.div`
  position: sticky;
  top: 0; /* ติดบน viewport */
  height: 100vh; /* เต็มหน้าจอแนวตั้ง */
 
  display: flex;
  flex-direction: column;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
`;

const NavItem = styled(motion.li)`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StyledNavLink = styled(NavLink)<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;
  overflow: hidden; /* ป้องกัน overflow */

  box-sizing: border-box; /* รวม border และ padding ในขนาด */

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.text.primary};
    transform: translateX(4px);
  }

  &.active {
    background: ${({ theme }) => theme.colors.primary}15;
    color: ${({ theme }) => theme.colors.primary};

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: ${({ theme }) => theme.colors.primary};
      border-radius: 0 4px 4px 0;
    }
  }

  svg {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }

  span {
    font-weight: 500;
    white-space: nowrap;
    opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
    max-width: ${({ $collapsed }) => ($collapsed ? '0' : '200px')};
    overflow: hidden;
    display: inline-block;
    transition: all ${({ theme }) => theme.transitions.fast};
  }
`;


const CollapseButton = styled(motion.button)<{ $collapsed: boolean }>`
 position: absolute;
  right: 8px; 
  bottom: 24px; 
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.md};
  z-index: 10;

  svg {
    width: 30px;
    height: 30px;
  }

  &:hover {
    transform: scale(1.1);
  }
`;

export const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const { playSound } = useSound();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { path: '/solution-1', label: t('nav.solution1'), icon: Layers },
    { path: '/solution-2', label: t('nav.solution2'), icon: Package },
    { path: '/solution-3', label: t('nav.solution3'), icon: Box },
    { path: '/solution-4', label: t('nav.solution4'), icon: Briefcase },
    { path: '/solution-5', label: t('nav.solution5'), icon: FileText },
  ];

  const handleNavClick = () => {
    playSound('click');
  };

  return (
   <SidebarWrapper
  initial={false}
  animate={{ width: collapsed ? 120 : 280 }}
  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
>
  <NavContainer>
      <LogoSection $collapsed={collapsed} layout>
        <Sparkles />
        <AnimatePresence>
          {!collapsed && (
            <motion.h1
              key="logo-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              Algorithm Test
            </motion.h1>
          )}
        </AnimatePresence>
      </LogoSection>

      <NavList>
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <NavItem
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              layout
            >
              <StyledNavLink
                to={item.path}
                $collapsed={collapsed}
                onClick={handleNavClick}
              >
                <Icon />
                <span>{item.label}</span>
              </StyledNavLink>
            </NavItem>
          );
        })}
       </NavList>

    <CollapseButton
      onClick={() => setCollapsed(!collapsed)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      $collapsed={collapsed}
      aria-label="Toggle sidebar"
    >
      {collapsed ? <ChevronRight /> : <ChevronLeft />}
    </CollapseButton>
  </NavContainer>
</SidebarWrapper>
  );
};
