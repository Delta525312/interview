// solution5/index.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';
import { useTheme } from '../../contexts/ThemeContext'; // NOTE: Adjust this import path if needed

// Import newly created components
import { UserTable } from '../../components/solution5//UserTable';
import { UserCardGrid } from '../../components/solution5/UserCardGrid';
import { UserList } from '../../components/solution5/UserList';
import { UserControls } from '../../components/solution5/UserControls';
import { UserModal } from '../../components/solution5/UserModal';

// Import types and styles
import { User, ViewMode } from '../../components/solution5/types';
import {
  Container, Header, Title, MainContent, TableView,
  CardGrid, ListView, Pagination, PageInfo, PageButton,
  EmptyState, LoadingState
} from '../../styles/Solution5/styles';


export const Solution5: React.FC = () => {
  const { t } = useTranslation();
  const { themeMode } = useTheme();

  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]); // keep all users for frontend filtering
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const baseUrl = process.env.REACT_APP_API_URL || 'https://api.example.com';

  // Fetch all users for frontend filtering
  const fetchAllUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/v1/user/?q=&start=0&limit=1000`);
      const data = await response.json();
      let all = [];
      if (Array.isArray(data.data)) all = data.data;
      else if (Array.isArray(data.items)) all = data.items;
      else if (Array.isArray(data)) all = data;
      setAllUsers(all);
    } catch (error) {
      setAllUsers([]);
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  // Fetch paginated users (for backend search)
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const start = (currentPage - 1) * rowsPerPage;
      const response = await fetch(
        `${baseUrl}/api/v1/user/?q=${searchQuery}&start=${start}&limit=${rowsPerPage}`
      );
      const data = await response.json();
      let pageUsers = [];
      let total = 1;
      if (Array.isArray(data.data) && typeof data.total_pages === 'number') {
        pageUsers = data.data;
        total = data.total_pages;
      } else if (Array.isArray(data.items) && typeof data.total === 'number') {
        pageUsers = data.items;
        total = Math.ceil(data.total / rowsPerPage);
      } else if (Array.isArray(data)) {
        pageUsers = data;
        total = 1;
      }
      setUsers(pageUsers);
      setTotalPages(total);
    } catch (error) {
      setUsers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, currentPage, rowsPerPage, baseUrl]);

  // Initial load: fetch all users for filtering, and paginated users for display
  useEffect(() => {
    fetchAllUsers();
    fetchUsers();
  }, [fetchAllUsers, fetchUsers]);

  // Filter users by department and role (frontend)
  useEffect(() => {
    let filtered = allUsers;
    if (department) filtered = filtered.filter(u => u.department === department);
    if (role) filtered = filtered.filter(u => u.role === role);
    setUsers(filtered);
    setTotalPages(Math.max(1, Math.ceil(filtered.length / rowsPerPage)));
    setCurrentPage(1);
  }, [department, role, allUsers, rowsPerPage]);

  const handleSearch = (e: React.FormEvent | React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault?.();
    setSearchQuery(searchInput);
    setCurrentPage(1);
    fetchUsers();
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleCreate = () => {
    setModalMode('create');
    setSelectedUser(null);
    setFormData({});
    setSelectedFile(null);
    setFormErrors({});
    setShowModal(true);
  };

  const handleEdit = (user: User) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData(user);
    setSelectedFile(null);
    setFormErrors({});
    setShowModal(true);
  };
  
  const handleView = async (user: User) => {
    setModalMode('view');
    setShowModal(true);
    setSelectedUser(null);
    setFormData({});
    try {
        const response = await fetch(`${baseUrl}/api/v1/user/${user.id}`);
        if (!response.ok) throw new Error('Failed to fetch user details');
        const data = await response.json();
        setSelectedUser(data);
        setFormData(data);
    } catch (err) {
        Swal.fire({ icon: 'error', title: t('error'), text: (err as Error).message });
        setShowModal(false);
    }
  };

  const handleDelete = async (user: User) => {
    const result = await Swal.fire({
      title: t('deleteConfirm'),
      text: t('deleteWarning', { name: user.display_name }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: t('delete'),
      cancelButtonText: t('cancel'),
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${baseUrl}/api/v1/user/${user.id}`, { method: 'DELETE' });
        if (response.ok) {
          Swal.fire(t('deleted'), t('deleteSuccess'), 'success');
          fetchAllUsers();
          fetchUsers();
        } else {
          throw new Error('Delete failed');
        }
      } catch (error) {
        Swal.fire(t('error'), t('deleteError'), 'error');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setFormErrors((prev) => ({ ...prev, avatar_url: '' }));
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFormData({ ...formData, avatar_url: undefined });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = t('userpage.errorEmail') || 'Invalid email format';
    if (formData.mobile_no && !/^\d{10}$/.test(formData.mobile_no)) errors.mobile_no = t('userpage.errorMobile') || 'Mobile number must be 10 digits';
    if (formData.citizen_id && !/^\d{13}$/.test(formData.citizen_id)) errors.citizen_id = t('userpage.errorCitizenId') || 'Citizen ID must be 13 digits';
    if (!formData.first_name) errors.first_name = t('userpage.errorFirstName') || 'First name is required';
    if (!formData.last_name) errors.last_name = t('userpage.errorLastName') || 'Last name is required';
    if (!formData.username) errors.username = t('userpage.errorUsername') || 'Username is required';
    if (selectedFile && !selectedFile.type.match(/^image\/(jpeg|png|jpg|gif)$/)) errors.avatar_url = t('userpage.errorAvatarType') || 'Invalid image type';
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) formDataToSend.append(key, value.toString());
    });
    if (selectedFile) formDataToSend.append('file', selectedFile);
    
    try {
      const url = modalMode === 'create' ? `${baseUrl}/api/v1/user/` : `${baseUrl}/api/v1/user/${selectedUser?.id}`;
      const response = await fetch(url, {
        method: modalMode === 'create' ? 'POST' : 'PUT',
        body: formDataToSend,
      });

      if (response.ok) {
        Swal.fire({ icon: 'success', title: 'Success', text: modalMode === 'create' ? 'Create success' : 'Update success' });
        setShowModal(false);
        fetchAllUsers();
        fetchUsers();
      } else {
        const error = await response.json();
        throw new Error(error.detail || 'Operation failed');
      }
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.message || 'Operation failed' });
    }
  };

  const getUserImage = (user: User): string | undefined => user.avatar_url;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('en-GB'); // dd/mm/yyyy format
  };

  // Paginate filtered users
  const paginatedUsers = users.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const renderContent = () => {
    if (loading) return <LoadingState>{t('userpage.loading')}</LoadingState>;
    if (users.length === 0) return <EmptyState>{t('userpage.noData')}</EmptyState>;
    
    switch (viewMode) {
      case 'table':
        return <TableView><UserTable users={paginatedUsers} handleView={handleView} handleEdit={handleEdit} handleDelete={handleDelete} t={t} /></TableView>;
      case 'card':
        return <CardGrid><UserCardGrid users={paginatedUsers} handleView={handleView} handleEdit={handleEdit} handleDelete={handleDelete} getUserImage={getUserImage} formatDate={formatDate} t={t} /></CardGrid>;
      case 'list':
        return <ListView><UserList users={paginatedUsers} handleView={handleView} handleEdit={handleEdit} handleDelete={handleDelete} getUserImage={getUserImage} formatDate={formatDate} t={t} /></ListView>;
      default:
        return null;
    }
  };

  return (
    <Container data-theme={themeMode}>
      <Header>
       <>
  <style>{`
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `}</style>
  <Title style={{
    background: 'linear-gradient(90deg, #7c3aed, #8b5cf6, #6366f1, #3b82f6, #7c3aed)',
    backgroundSize: '200% 100%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontSize: '2.5rem',
    fontWeight: 800,
    letterSpacing: '-0.025em',
    animation: 'gradientShift 5s ease infinite',
  }}>
    {t('userpage.userManagement')}
  </Title>
</>
        <UserControls
          searchQuery={searchQuery}
          handleSearch={handleSearch}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          rowsPerPage={rowsPerPage}
          handleRowsPerPageChange={handleRowsPerPageChange}
          viewMode={viewMode}
          setViewMode={setViewMode}
          handleCreate={handleCreate}
          t={t}
          department={department}
          setDepartment={setDepartment}
          role={role}
          setRole={setRole}
          onRefresh={() => {
            setDepartment('');
            setRole('');
            setSearchInput('');
            setSearchQuery('');
            setCurrentPage(1);
            fetchUsers();
          }}
        />
      </Header>
      
      <MainContent>{renderContent()}</MainContent>
      
      {users.length > 0 && (
          <Pagination>
            <PageButton onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>
              <ChevronLeft size={20} />
            </PageButton>
            <PageInfo>{t('userpage.page')} {currentPage} {t('userpage.of')} {totalPages}</PageInfo>
            <PageButton onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>
              <ChevronRight size={20} />
            </PageButton>
          </Pagination>
      )}

      <UserModal
        showModal={showModal} setShowModal={setShowModal}
        modalMode={modalMode} selectedUser={selectedUser}
        formData={formData} setFormData={setFormData}
        formErrors={formErrors} setFormErrors={setFormErrors}
        selectedFile={selectedFile} handleFileChange={handleFileChange}
        handleRemoveFile={handleRemoveFile} handleSubmit={handleSubmit}
        handleInputChange={handleInputChange} handleTextAreaChange={handleTextAreaChange}
        getUserImage={getUserImage} t={t}
      />
    </Container>
  );
};

export default Solution5;