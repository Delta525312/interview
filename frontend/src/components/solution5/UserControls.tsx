// solution5/UserControls.tsx

import React from 'react';
import { Search, Plus, Grid, List, LayoutGrid } from 'lucide-react';
import { ViewMode } from './types';
import { 
  Controls, SearchWrapper, SearchInput, ActionButton, 
  ViewToggle, ViewButton, RowSelector
} from './styles';
import { TFunction } from 'i18next';

interface UserControlsProps {
  searchQuery: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rowsPerPage: number;
  handleRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  handleCreate: () => void;
  t: TFunction;
}

export const UserControls: React.FC<UserControlsProps> = ({
  searchQuery,
  handleSearch,
  rowsPerPage,
  handleRowsPerPageChange,
  viewMode,
  setViewMode,
  handleCreate,
  t
}) => {
  return (
    <Controls>
      <SearchWrapper>
        <Search size={20} />
        <SearchInput
          type="text"
          placeholder={t('userpage.search')}
          value={searchQuery}
          onChange={handleSearch}
        />
      </SearchWrapper>
      <RowSelector>
        <label>{t('userpage.rowsPerPage')}</label>
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
    </Controls>
  );
};