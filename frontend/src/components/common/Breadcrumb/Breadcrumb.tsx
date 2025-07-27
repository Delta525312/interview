import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Home, ChevronLeft } from 'lucide-react';

const BreadcrumbWrapper = styled(motion.nav)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: linear-gradient(135deg, #6b8de3, #4a63c7);
  border: none;
  color: white;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(74, 99, 199, 0.4);
  transition: all 0.3s ease;
  user-select: none;

  svg {
    width: 20px;
    height: 20px;
    stroke-width: 2.5;
  }

  &:hover {
    background: linear-gradient(135deg, #4a63c7, #3751a3);
    box-shadow: 0 6px 16px rgba(57, 81, 163, 0.6);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const BreadcrumbLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all ${({ theme }) => theme.transitions.fast};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primary}10;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Separator = styled(ChevronRight)`
  width: 16px;
  height: 16px;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const CurrentPage = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 600;
  font-size: 14px;
`;

export const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const pathSegments = location.pathname
    .split('/')
    .filter((segment) => segment);

  const getLabel = (segment: string): string => {
    const labelMap: { [key: string]: string } = {
      'solution-1': 'nav.solution1',
      'solution-2': 'nav.solution2',
      'solution-3': 'nav.solution3',
      'solution-4': 'nav.solution4',
      'solution-5': 'nav.solution5',
    };
    return t(labelMap[segment] || segment);
  };

  return (
    <BreadcrumbWrapper
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* แสดงปุ่ม Back เฉพาะหน้าอื่นที่ไม่ใช่ Home */}
      {pathSegments.length > 0 && (
        <BackButton onClick={() => navigate('/')}>
          <ChevronLeft />
          {t('nav.home')}
        </BackButton>
      )}

      {/* Home Link */}
      <BreadcrumbLink to="/">
        <Home />
        {pathSegments.length === 0 && <span>{t('nav.home')}</span>}
      </BreadcrumbLink>

      {pathSegments.map((segment, index) => (
        <React.Fragment key={segment}>
          <Separator />
          {index === pathSegments.length - 1 ? (
            <CurrentPage>{getLabel(segment)}</CurrentPage>
          ) : (
            <BreadcrumbLink to={`/${pathSegments.slice(0, index + 1).join('/')}`}>
              {getLabel(segment)}
            </BreadcrumbLink>
          )}
        </React.Fragment>
      ))}
    </BreadcrumbWrapper>
  );
};
