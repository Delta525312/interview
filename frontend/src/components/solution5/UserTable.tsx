// solution5/UserTable.tsx
import React, { useContext } from 'react';
import { Edit2, Eye, Trash2 } from 'lucide-react';
import { User } from './types';
import { ActionButton } from '../../styles/Solution5/styles';
import { useTheme } from '../../contexts/ThemeContext';
import { TFunction } from 'i18next';

interface UserTableProps {
  users: User[];
  handleView: (user: User) => void;
  handleEdit: (user: User) => void;
  handleDelete: (user: User) => void;
  t: TFunction;
}

export const UserTable: React.FC<UserTableProps> = ({ 
  users, 
  handleView, 
  handleEdit, 
  handleDelete, 
  t 
}) => {
  const { themeMode } = useTheme();
  // @ts-ignore
  const { lightTheme } = require('../../styles/themes/light');
  // @ts-ignore
  const { darkTheme } = require('../../styles/themes/dark');
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;
  const lightRow = theme.colors.surface;
  const darkRow = theme.colors.surfaceHover;
  const borderColor = theme.colors.border;

  return (
    <div style={{ overflow: 'auto' }}>
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse',
        tableLayout: 'fixed' // ช่วยให้ column กว้างเท่ากัน
      }}>
        <thead>
          <tr>
            <th style={{ 
              textAlign: 'center', 
              padding: '12px 8px',
              borderBottom: `2px solid ${borderColor}`,
              fontWeight: '600',
              fontSize: '14px',
              width: '12%'
            }}>
              {t('userpage.firstname')}
            </th>
            <th style={{ 
              textAlign: 'center', 
              padding: '12px 8px',
              borderBottom: `2px solid ${borderColor}`,
              fontWeight: '600',
              fontSize: '14px',
              width: '12%'
            }}>
              {t('userpage.lastname')}
            </th>
            <th style={{ 
              textAlign: 'center', 
              padding: '12px 8px',
              borderBottom: `2px solid ${borderColor}`,
              fontWeight: '600',
              fontSize: '14px',
              width: '20%'
            }}>
              {t('userpage.email')}
            </th>
            <th style={{ 
              textAlign: 'center', 
              padding: '12px 8px',
              borderBottom: `2px solid ${borderColor}`,
              fontWeight: '600',
              fontSize: '14px',
              width: '15%'
            }}>
              {t('userpage.department')}
            </th>
            <th style={{ 
              textAlign: 'center', 
              padding: '12px 8px',
              borderBottom: `2px solid ${borderColor}`,
              fontWeight: '600',
              fontSize: '14px',
              width: '13%'
            }}>
              {t('userpage.role')}
            </th>
            <th style={{ 
              textAlign: 'center', 
              padding: '12px 8px',
              borderBottom: `2px solid ${borderColor}`,
              fontWeight: '600',
              fontSize: '14px',
              width: '13%'
            }}>
              {t('userpage.create_at')}
            </th>
            <th style={{ 
              textAlign: 'center', 
              padding: '12px 8px',
              borderBottom: `2px solid ${borderColor}`,
              fontWeight: '600',
              fontSize: '14px',
              width: '15%'
            }}>
              {t('userpage.actions')}
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr
              key={user.id}
              style={{
                background: idx % 2 === 0 ? lightRow : darkRow,
                borderBottom: `1px solid ${borderColor}`
              }}
            >
              <td style={{ 
                textAlign: 'center', 
                padding: '12px 8px',
                fontSize: '14px',
                verticalAlign: 'middle'
              }}>
                {user.first_name || '-'}
              </td>
              <td style={{ 
                textAlign: 'center', 
                padding: '12px 8px',
                fontSize: '14px',
                verticalAlign: 'middle'
              }}>
                {user.last_name || '-'}
              </td>
              <td style={{ 
                textAlign: 'center', 
                padding: '12px 8px',
                fontSize: '14px',
                verticalAlign: 'middle'
              }}>
                {user.email || '-'}
              </td>
              <td style={{ 
                textAlign: 'center', 
                padding: '12px 8px',
                fontSize: '14px',
                verticalAlign: 'middle'
              }}>
                {user.department || '-'}
              </td>
              <td style={{ 
                textAlign: 'center', 
                padding: '12px 8px',
                fontSize: '14px',
                verticalAlign: 'middle'
              }}>
                {user.role || '-'}
              </td>
              <td style={{ 
                textAlign: 'center', 
                padding: '12px 8px',
                fontSize: '14px',
                verticalAlign: 'middle'
              }}>
                {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
              </td>
              <td style={{ 
                textAlign: 'center', 
                padding: '12px 8px',
                verticalAlign: 'middle'
              }}>
                <div style={{ 
                  display: 'flex', 
                  gap: '4px', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  margin: '0 auto'
                }}>
                  <ActionButton 
                    onClick={() => handleView(user)} 
                    title={t('userpage.view')} 
                    className="view"
                  >
                    <Eye size={18} style={{ color: 'currentColor', transition: 'color 0.3s' }} />
                  </ActionButton>
                  <ActionButton 
                    onClick={() => handleEdit(user)} 
                    title={t('userpage.edit')} 
                    className="edit"
                  >
                    <Edit2 size={18} style={{ color: 'currentColor', transition: 'color 0.3s' }} />
                  </ActionButton>
                  <ActionButton 
                    onClick={() => handleDelete(user)} 
                    title={t('userpage.delete')} 
                    className="delete"
                  >
                    <Trash2 size={18} style={{ color: 'currentColor', transition: 'color 0.3s' }} />
                  </ActionButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};