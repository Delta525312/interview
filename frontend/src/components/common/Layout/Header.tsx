import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'contexts/ThemeContext';
import { useSound } from 'contexts/SoundContext';
import { Breadcrumb } from '../Breadcrumb/Breadcrumb';
import { IconButton } from 'components/ui/Button/IconButton/IconButton';
import { 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  Globe
} from 'lucide-react';

const HeaderWrapper = styled(motion.header)`
  background: ${({ theme }) => theme.colors.surface};
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Controls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
  position: relative;
`;

const LanguageDropdownWrapper = styled.div`
  position: relative;
`;

const LanguageDropdownMenu = styled(motion.ul)`
  position: absolute;
  top: 40px;
  right: 0;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  list-style: none;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  margin: 0;
  width: 100px;
  z-index: 200;
`;

const LanguageOption = styled.li<{ $active?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  background: ${({ $active, theme }) => ($active ? theme.colors.primary : 'transparent')};
  color: ${({ $active, theme }) => ($active ? 'white' : theme.colors.text.primary)};
  font-weight: ${({ $active }) => ($active ? '700' : '400')};
  font-size: 0.75rem;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}cc;
    color: white;
  }
`;

export const Header: React.FC = () => {
  const { i18n } = useTranslation();
  const { themeMode, toggleTheme } = useTheme();
  const { isMuted, toggleMute } = useSound();

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
useEffect(() => {
  const storedLang = localStorage.getItem('i18nextLng');
  if (storedLang && storedLang !== i18n.language) {
    i18n.changeLanguage(storedLang);
  }
}, [i18n]);

  // ปิด dropdown เวลาคลิกนอก
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLangDropdownOpen(false);
  };

  return (
    <HeaderWrapper
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <LeftSection>
        <Breadcrumb />
      </LeftSection>

      <Controls>
        <LanguageDropdownWrapper ref={langRef}>
          <IconButton
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            variant="ghost"
            aria-haspopup="true"
            aria-expanded={langDropdownOpen}
            aria-label="Select language"
          >
            <Globe />
          </IconButton>
            {langDropdownOpen && (
         <LanguageDropdownMenu
         initial={{ opacity: 0, y: -10 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -10 }}
         transition={{ duration: 0.2 }}
         role="menu"
       >
         <LanguageOption
           onClick={() => changeLanguage('en')}
           $active={i18n.language === 'en'}
           role="menuitem"
         >
           English (EN)
         </LanguageOption>
         <LanguageOption
           onClick={() => changeLanguage('th')}
           $active={i18n.language === 'th'}
           role="menuitem"
         >
           ไทย (TH)
         </LanguageOption>
         <LanguageOption
           onClick={() => changeLanguage('zh')}
           $active={i18n.language.startsWith('zh')}
           role="menuitem"
         >
           中文 (ZH)
         </LanguageOption>
       </LanguageDropdownMenu>
       
         
            )}
        
        </LanguageDropdownWrapper>

        <IconButton onClick={toggleTheme} variant="ghost" aria-label="Toggle theme">
          {themeMode === 'light' ? <Moon /> : <Sun />}
        </IconButton>

        <IconButton onClick={toggleMute} variant="ghost" active={!isMuted} aria-label="Toggle sound">
          {isMuted ? < VolumeX/> : < Volume2/>}
        </IconButton>
      </Controls>
    </HeaderWrapper>
  );
};
