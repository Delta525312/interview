// solution5/UserList.tsx

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { lightTheme } from '../../styles/themes/light';
import { darkTheme } from '../../styles/themes/dark';
import { User as UserIcon, Mail, Phone, Calendar, Building2, Briefcase, Eye, Edit2, Trash2 } from 'lucide-react';
import { User } from './types';
import { ListItem, ListImage, ListContent, ListInfo, ListActions, ActionButton } from '../../styles/Solution5/styles';
import { TFunction } from 'i18next';

interface UserListProps {
  users: User[];
  handleView: (user: User) => void;
  handleEdit: (user: User) => void;
  handleDelete: (user: User) => void;
  getUserImage: (user: User) => string | undefined;
  formatDate: (dateString?: string) => string;
  t: TFunction;
}

export const UserList: React.FC<UserListProps> = ({ users, handleView, handleEdit, handleDelete, getUserImage, formatDate, t }) => {
  const { themeMode } = useTheme();
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;
  const bg = theme.colors.surface;
  return (
    <>
      {users.map((user) => (
        <ListItem key={user.id} style={{ background: bg, border: `1px solid ${theme.colors.border}` }}>
          <ListImage src={getUserImage(user)} alt={user.display_name} />
          <ListContent>
            <h3 style={{ color: theme.colors.text.primary }}>{user.display_name}</h3>
            <ListInfo style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 24px', color: theme.colors.text.secondary }}>
              <span><UserIcon size={14} /> {user.username}</span>
              <span><Mail size={14} /> {user.email}</span>
              <span><Phone size={14} /> {user.mobile_no || '-'}</span>
              <span><Calendar size={14} /> {formatDate(user.birth_date)}</span>
              <span><Building2 size={14} /> {user.department || '-'}</span>
              <span><Briefcase size={14} /> {user.role || '-'}</span>
            </ListInfo>
          </ListContent>
         <ListActions>
  <ActionButton onClick={() => handleView(user)} title={t('userpage.view')} className="view">
    <Eye size={16} style={{ color: 'currentColor', transition: 'color 0.3s' }} />
  </ActionButton>
  <ActionButton onClick={() => handleEdit(user)} title={t('userpage.edit')} className="edit">
    <Edit2 size={16} style={{ color: 'currentColor', transition: 'color 0.3s' }} />
  </ActionButton>
  <ActionButton onClick={() => handleDelete(user)} title={t('userpage.delete')} className="delete">
    <Trash2 size={16} style={{ color: 'currentColor', transition: 'color 0.3s' }} />
  </ActionButton>
</ListActions>
        </ListItem>
      ))}
    </>
  );
};
