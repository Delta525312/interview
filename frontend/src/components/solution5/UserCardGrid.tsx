// solution5/UserCardGrid.tsx

import React from 'react';
import { User as UserIcon, Mail, Phone, Calendar, Building2, Briefcase, Eye, Edit2, Trash2 } from 'lucide-react';
import { User } from './types';
import { Card, CardImage, CardContent, CardInfo, CardActions, ActionButton } from './styles';
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
  return (
    <>
      {users.map((user) => (
        <Card key={user.id}>
          <CardImage src={getUserImage(user)} alt={user.display_name} />
          <CardContent>
            <h3>{user.display_name}</h3>
            <CardInfo>
              <span><UserIcon size={14} /> {user.username}</span>
              <span><Mail size={14} /> {user.email}</span>
              <span><Phone size={14} /> {user.mobile_no || '-'}</span>
              <span><Calendar size={14} /> {formatDate(user.birth_date)}</span>
              <span><Building2 size={14} /> {user.department || '-'}</span>
              <span><Briefcase size={14} /> {user.role || '-'}</span>
            </CardInfo>
          </CardContent>
          <CardActions>
            <ActionButton onClick={() => handleView(user)} title={t('userpage.view')} style={{ background: 'none' }}>
              <Eye size={16} style={{ color: '#3b82f6' }} />
            </ActionButton>
            <ActionButton onClick={() => handleEdit(user)} title={t('userpage.edit')} style={{ background: 'none' }}>
              <Edit2 size={16} style={{ color: '#f59e42' }} />
            </ActionButton>
            <ActionButton 
              onClick={() => handleDelete(user)} 
              title={t('userpage.delete')}
              className="delete"
              style={{ background: 'none' }}
              onMouseOver={e => (e.currentTarget.firstChild && ((e.currentTarget.firstChild as HTMLElement).style.color = '#b91c1c'))}
              onMouseOut={e => (e.currentTarget.firstChild && ((e.currentTarget.firstChild as HTMLElement).style.color = '#ef4444'))}
            >
              <Trash2 size={16} style={{ color: '#ef4444', transition: 'color 0.2s' }} />
            </ActionButton>
          </CardActions>
        </Card>
      ))}
    </>
  );
};