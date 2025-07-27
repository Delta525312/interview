// solution5/UserTable.tsx

import React from 'react';
import { Edit2, Eye, Trash2 } from 'lucide-react';
import { User } from './types';
import { ActionButton } from './styles';
import { TFunction } from 'i18next';

interface UserTableProps {
  users: User[];
  handleView: (user: User) => void;
  handleEdit: (user: User) => void;
  handleDelete: (user: User) => void;
  t: TFunction;
}

export const UserTable: React.FC<UserTableProps> = ({ users, handleView, handleEdit, handleDelete, t }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>{t('userpage.firstname')}</th>
          <th>{t('userpage.lastname')}</th>
          <th>{t('userpage.email')}</th>
          <th>{t('userpage.department')}</th>
          <th>{t('userpage.role')}</th>
          <th>{t('userpage.create_at')}</th>
          <th>{t('userpage.actions')}</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.first_name || '-'}</td>
            <td>{user.last_name || '-'}</td>
            <td>{user.email || '-'}</td>
            <td>{user.department || '-'}</td>
            <td>{user.role || '-'}</td>
            <td>{user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}</td>
            <td>
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
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};