import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const HomeWrapper = styled.div`
  h1 {
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }

  p {
    color: ${({ theme }) => theme.colors.text.secondary};
    line-height: 1.6;
  }
`;

export const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <HomeWrapper>
      <h1>{t('nav.home')}</h1>
      <p>Welcome to the Interview Challenge Application</p>
      <p>This is a professional React template with i18n and theme support.</p>
    </HomeWrapper>
  );
};