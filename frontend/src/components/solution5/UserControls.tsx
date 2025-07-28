// solution5/UserControls.tsx

import React from 'react';
import { Search, Plus, Grid, List, LayoutGrid, RefreshCw } from 'lucide-react';
import { ViewMode } from './types';
import { 
  Controls, SearchWrapper, SearchInput, ActionButton, 
  ViewToggle, ViewButton, RowSelector
} from '../../styles/Solution5/styles';
import { TFunction } from 'i18next';

interface UserControlsProps {
  searchQuery: string;
  handleSearch: (e: React.FormEvent | React.ChangeEvent<HTMLInputElement>) => void;
  searchInput: string;
  setSearchInput: (val: string) => void;
  rowsPerPage: number;
  handleRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  handleCreate: () => void;
  t: TFunction;
  department: string;
  setDepartment: (val: string) => void;
  role: string;
  setRole: (val: string) => void;
  onRefresh: () => void;
}

export const UserControls: React.FC<UserControlsProps> = ({
  handleSearch,
  searchInput,
  setSearchInput,
  rowsPerPage,
  handleRowsPerPageChange,
  viewMode,
  setViewMode,
  handleCreate,
  t,
  department,
  setDepartment,
  role,
  setRole,
  onRefresh
}) => {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 12,
      width: '100%',
      justifyContent: 'space-between',
      rowGap: 10,
      marginBottom: 12,
      minHeight: 48
    }}>
      {/* Department & Role Filter Dropdowns (inline, no label) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 40, flex: '0 1 auto' }}>
        <select value={department} onChange={e => setDepartment(e.target.value)}
          style={{
            borderRadius: 8,
            padding: '7px 14px',
            fontSize: 15,
            width: 160,
            background: '#f8fafc',
            border: '1.5px solid #cbd5e1',
            color: '#334155',
            outline: 'none',
            boxShadow: '0 1px 4px 0 rgba(0,0,0,0.03)',
            transition: 'border 0.2s',
            height: 38,
          }}
          onFocus={e => (e.currentTarget.style.border = '#2563eb 1.5px solid')}
          onBlur={e => (e.currentTarget.style.border = '#cbd5e1 1.5px solid')}
        >
          <option value="">{t('userpage.selectDepartment')}</option>
          <option value="IT">{t('userpage.departmentIT')}</option>
          <option value="Human Resources">{t('userpage.departmentHR')}</option>
          <option value="Finance">{t('userpage.departmentFinance')}</option>
          <option value="Marketing">{t('userpage.departmentMarketing')}</option>
          <option value="Sales">{t('userpage.departmentSales')}</option>
          <option value="Support">{t('userpage.departmentSupport')}</option>
          <option value="Operations">{t('userpage.departmentOperations')}</option>
          <option value="Development">{t('userpage.departmentDevelopment')}</option>
        </select>
        <select value={role} onChange={e => setRole(e.target.value)}
          style={{
            borderRadius: 8,
            padding: '7px 14px',
            fontSize: 15,
            width: 160,
            background: '#f8fafc',
            border: '1.5px solid #cbd5e1',
            color: '#334155',
            outline: 'none',
            boxShadow: '0 1px 4px 0 rgba(0,0,0,0.03)',
            transition: 'border 0.2s',
            height: 38,
          }}
          onFocus={e => (e.currentTarget.style.border = '#2563eb 1.5px solid')}
          onBlur={e => (e.currentTarget.style.border = '#cbd5e1 1.5px solid')}
        >
          <option value="">{t('userpage.selectRole')}</option>
          <option value="Admin">{t('userpage.roleAdmin')}</option>
          <option value="Manager">{t('userpage.roleManager')}</option>
          <option value="Staff">{t('userpage.roleStaff')}</option>
          <option value="Guest">{t('userpage.roleGuest')}</option>
          <option value="Developer">{t('userpage.roleDeveloper')}</option>
          <option value="Analyst">{t('userpage.roleAnalyst')}</option>
          <option value="Intern">{t('userpage.roleIntern')}</option>
          <option value="Consultant">{t('userpage.roleConsultant')}</option>
        </select>
      </div>
      {/* Search with icon and label */}
      <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 320px', minWidth: 220, maxWidth: 700 }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={20} style={{ position: 'absolute', left: 8, color: '#888' }} />
          <SearchInput
            type="text"
            placeholder={t('userpage.search')}
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            style={{ paddingLeft: 32, fontSize: 16, width: 500, minWidth: 220, maxWidth: 500 }}
          />
        </div>
        <ActionButton
          type="submit"
          style={{
            height: 36,
            minWidth: 36,
            marginLeft: 4,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#e0e7ff',
            borderRadius: 8,
            transition: 'background 0.2s',
            border: 'none',
            boxShadow: 'none',
            cursor: 'pointer',
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = '#2563eb';
            const icon = e.currentTarget.querySelector('svg');
            if (icon) icon.style.color = '#fff';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = '#e0e7ff';
            const icon = e.currentTarget.querySelector('svg');
            if (icon) icon.style.color = '#2563eb';
          }}
        >
          <Search size={20} style={{ color: '#2563eb', transition: 'color 0.2s' }} />
        </ActionButton>
        <ActionButton
          type="button"
          style={{
            height: 36,
            minWidth: 36,
            marginLeft: 4,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f1f5f9',
            borderRadius: 8,
            transition: 'background 0.2s',
            border: 'none',
            boxShadow: 'none',
            cursor: 'pointer',
          }}
          title={t('userpage.refresh') || 'Refresh'}
          onClick={() => {
            setDepartment('');
            setRole('');
            setSearchInput('');
            if (onRefresh) onRefresh();
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = '#bae6fd';
            const icon = e.currentTarget.querySelector('svg');
            if (icon) icon.style.color = '#0ea5e9';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = '#f1f5f9';
            const icon = e.currentTarget.querySelector('svg');
            if (icon) icon.style.color = '#2563eb';
          }}
        >
          <RefreshCw size={20} style={{ color: '#2563eb', transition: 'color 0.2s' }} />
        </ActionButton>
      </form>
      <RowSelector>
        <label style={{ fontWeight: 600, fontSize: 15 }}>{t('userpage.rowsPerPage')}</label>
        <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
          <option value="1">1</option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </RowSelector>
      <ViewToggle>
        <ViewButton
          active={viewMode === 'table'}
          onClick={() => setViewMode('table')}
          title={t('userpage.tableView')}
        >
          <LayoutGrid size={20} />
        </ViewButton>
        <ViewButton
          active={viewMode === 'card'}
          onClick={() => setViewMode('card')}
          title={t('userpage.cardView')}
        >
          <Grid size={20} />
        </ViewButton>
        <ViewButton
          active={viewMode === 'list'}
          onClick={() => setViewMode('list')}
          title={t('userpage.listView')}
        >
          <List size={20} />
        </ViewButton>
      </ViewToggle>
      <ActionButton className="primary" onClick={handleCreate}>
        <Plus size={20} />
        {t('userpage.addUser')}
      </ActionButton>
    </div>
  );
};