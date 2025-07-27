import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.background || '#f5f5f5'};
  color: ${({ theme }) => theme.colors.text.primary || '#333333'};
  min-height: 100vh;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.colors.info || '#3b82f6'};
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

export const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 12px;
    color: #6b7280;
    pointer-events: none;
  }
`;

export const SearchInput = styled.input`
  padding: 8px 12px 8px 40px;
  border: 1px solid ${({ theme }) => theme.colors.border || '#e5e7eb'};
  border-radius: 8px;
  font-size: 14px;
  width: 300px;
  background-color: ${({ theme }) => theme.colors.surface || '#ffffff'};
  color: ${({ theme }) => theme.colors.text.primary || '#333333'};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.info || '#3b82f6'};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary || '#9ca3af'};
  }
`;

export const RowSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  label {
    font-size: 14px;
    color: #6b7280;
  }

  select {
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background-color: #ffffff;
    color: #333333;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #3b82f6;
    }
  }
`;

export const ViewToggle = styled.div`
  display: flex;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
`;

export const ViewButton = styled.button<{ active: boolean }>`
  padding: 8px 12px;
  border: none;
  background-color: ${({ active }) => 
    active ? '#3b82f6' : 'transparent'};
  color: ${({ active }) => 
    active ? '#ffffff' : '#333333'};
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ active }) => 
      active ? '#2563eb' : '#f3f4f6'};
  }

  &:not(:last-child) {
    border-right: 1px solid #e5e7eb;
  }
`;

export const ActionButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background-color: #ffffff;
  color: #333333;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-size: 14px;

  &:hover {
    background-color: #f3f4f6;
    transform: translateY(-1px);
  }

  &.primary {
    background-color: #3b82f6;
    color: #ffffff;

    &:hover {
      background-color: #2563eb;
    }
  }

  &.delete {
    color: #ef4444;

    &:hover {
      background-color: #fee2e2;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const MainContent = styled.div`
  min-height: calc(100vh - 250px);
`;

export const TableView = styled.div`
  overflow-x: auto;
  background-color: ${({ theme }) => theme.colors.surface || '#ffffff'};
  border-radius: 12px;
  box-shadow: 0 2px 8px ${({ theme }) => theme.shadows.md || 'rgba(0, 0, 0, 0.1)'};

  table {
    width: 100%;
    border-collapse: collapse;

    thead {
      background-color: ${({ theme }) => theme.colors.surfaceHover || '#f9fafb'};

      th {
        padding: 16px;
        text-align: left;
        font-weight: 600;
        color: ${({ theme }) => theme.colors.text.secondary || '#6b7280'};
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-bottom: 2px solid ${({ theme }) => theme.colors.border || '#e5e7eb'};
      }
    }

    tbody {
      tr {
        border-bottom: 1px solid ${({ theme }) => theme.colors.border || '#e5e7eb'};
        transition: all 0.3s ease;

        &:hover {
          background-color: ${({ theme }) => theme.colors.surfaceHover || '#f9fafb'};
        }

        td {
          padding: 16px;
          font-size: 14px;

          img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
          }

          &:last-child {
            display: flex;
            gap: 8px;
          }
        }
      }
    }
  }
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

export const Card = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
`;

export const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

export const CardContent = styled.div`
  padding: 16px;

  h3 {
    margin: 0 0 12px 0;
    font-size: 18px;
    font-weight: 600;
    color: #333333;
  }
`;

export const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  span {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: #6b7280;

    svg {
      color: #3b82f6;
    }
  }
`;

export const CardActions = styled.div`
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  background-color: #f9fafb;
`;

export const ListView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ListItem = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const ListImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

export const ListContent = styled.div`
  flex: 1;

  h3 {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 600;
    color: #333333;
  }
`;

export const ListInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;

  span {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: #6b7280;

    svg {
      color: #3b82f6;
    }
  }
`;

export const ListActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 32px;
`;

export const PageInfo = styled.span`
  font-size: 14px;
  color: #6b7280;
`;

export const PageButton = styled.button`
  padding: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: #ffffff;
  color: #333333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background-color: #3b82f6;
    color: #ffffff;
    border-color: #3b82f6;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// เพิ่ม styled components สำหรับ Modal ที่ปรับปรุงแล้ว
export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(4px);
`;

export const ModalContent = styled.div`
  background-color: #ffffff;
  border-radius: 20px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
`;

export const ModalHeader = styled.div`
  padding: 32px 32px 0 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
`;

export const CloseButton = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background-color: #f3f4f6;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e5e7eb;
    color: #4b5563;
  }
`;

export const ModalBody = styled.div`
  padding: 32px;
  overflow-y: auto;
  flex: 1;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
    
    &:hover {
      background: #9ca3af;
    }
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const FormSection = styled.div`
  background-color: #f9fafb;
  border-radius: 16px;
  padding: 24px;
`;

export const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 20px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  
  span {
    color: #ef4444;
    margin-left: 2px;
  }
`;

export const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
  background-color: #ffffff;
  color: #1a1a1a;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
    color: #9ca3af;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
  background-color: #ffffff;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 20px;
  padding-right: 40px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
    color: #9ca3af;
  }
`;

export const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
  background-color: #ffffff;
  color: #1a1a1a;
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
    color: #9ca3af;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const ProfilePhotoSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
`;

export const ProfilePhotoWrapper = styled.div`
  position: relative;
`;

export const ProfilePhoto = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e5e7eb;
`;

export const ProfilePhotoPlaceholder = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #e5e7eb;
  
  svg {
    color: #9ca3af;
  }
`;

export const FileInput = styled.div`
  position: relative;

  input[type="file"] {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    z-index: 2;
  }
`;

export const FileLabel = styled.label`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  background-color: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  svg {
    color: #ffffff;
  }

  &:hover {
    background-color: #2563eb;
    transform: scale(1.05);
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 24px 32px;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
`;

export const SubmitButton = styled.button`
  padding: 12px 32px;
  border: none;
  border-radius: 10px;
  background-color: #3b82f6;
  color: #ffffff;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const CancelButton = styled.button`
  padding: 12px 32px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  background-color: #ffffff;
  color: #6b7280;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f3f4f6;
    border-color: #d1d5db;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  font-size: 16px;
  color: #6b7280;
  background-color: #ffffff;
  border-radius: 12px;
`;

export const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  font-size: 16px;
  color: #6b7280;
  background-color: #ffffff;
  border-radius: 12px;
`;
export {};