// solution5/UserCardGrid.tsx

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { lightTheme } from '../../styles/themes/light';
import { darkTheme } from '../../styles/themes/dark';
import { User as UserIcon, Mail, Phone, Calendar, Building2, Briefcase, Eye, Edit2, Trash2 } from 'lucide-react';
import { User } from './types';
import { Card, CardImage, CardContent, CardInfo, CardActions, ActionButton } from '../../styles/Solution5/styles';
import { TFunction } from 'i18next';

interface UserCardGridProps {
  users: User[];
  handleView: (user: User) => void;
  handleEdit: (user: User) => void;
  handleDelete: (user: User) => void;
  getUserImage: (user: User) => string | undefined; 
  formatDate: (dateString?: string) => string;
  t: TFunction;
}

export const UserCardGrid: React.FC<UserCardGridProps> = ({ users, handleView, handleEdit, handleDelete, getUserImage, formatDate, t }) => {
  const { themeMode } = useTheme();
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;
  const bg = theme.colors.surface;
  const textColor = theme.colors.text.primary;
  const infoColor = theme.colors.text.secondary;
  return (
    <>
      {users.map((user) => (
        <Card key={user.id} style={{ background: bg, border: `1px solid ${theme.colors.border}` }}>
          <CardImage src={getUserImage(user)} alt={user.display_name} />
          <CardContent>
            <h3 style={{ color: textColor }}>{user.display_name}</h3>
            <CardInfo style={{ color: infoColor }}>
              <span><UserIcon size={14} /> {user.username}</span>
              <span><Mail size={14} /> {user.email}</span>
              <span><Phone size={14} /> {user.mobile_no || '-'}</span>
              <span><Calendar size={14} /> {formatDate(user.birth_date)}</span>
              <span><Building2 size={14} /> {user.department || '-'}</span>
              <span><Briefcase size={14} /> {user.role || '-'}</span>
            </CardInfo>
          </CardContent>
        <CardActions style={{ background: theme.colors.surfaceHover, borderTop: `1px solid ${theme.colors.border}` }}>
  <ActionButton onClick={() => handleView(user)} title={t('userpage.view')} className="view">
    <Eye size={16} style={{ color: 'currentColor', transition: 'color 0.3s' }} />
  </ActionButton>
  <ActionButton onClick={() => handleEdit(user)} title={t('userpage.edit')} className="edit">
    <Edit2 size={16} style={{ color: 'currentColor', transition: 'color 0.3s' }} />
  </ActionButton>
  <ActionButton onClick={() => handleDelete(user)} title={t('userpage.delete')} className="delete">
    <Trash2 size={16} style={{ color: 'currentColor', transition: 'color 0.3s' }} />
  </ActionButton>
</CardActions>
        </Card>
      ))}
    </>
  );
};