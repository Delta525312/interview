// solution5/UserModal.tsx

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { lightTheme } from '../../styles/themes/light';
import { darkTheme } from '../../styles/themes/dark';
import { User as UserIcon, X, Upload } from 'lucide-react';
import { User } from './types';
import {
  Modal, ModalContent, ModalHeader, ModalTitle, ModalBody, Form, FormGroup,
  Label, Input, Select, FileInput, FileLabel, ButtonGroup, SubmitButton,
  CancelButton, CloseButton, FormSection, SectionTitle, FormRow,
  ProfilePhotoSection, ProfilePhotoWrapper, ProfilePhoto, ProfilePhotoPlaceholder,
  TextArea
} from '../../styles/Solution5/styles';
import { TFunction } from 'i18next';

interface UserModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  modalMode: 'create' | 'edit' | 'view';
  selectedUser: User | null;
  formData: Partial<User>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<User>>>;
  formErrors: { [key: string]: string };
  setFormErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  selectedFile: File | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFile: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleTextAreaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  getUserImage: (user: User) => string | undefined;
  t: TFunction;
}

export const UserModal: React.FC<UserModalProps> = ({
  showModal, setShowModal, modalMode, selectedUser, formData, setFormData, formErrors, setFormErrors,
  selectedFile, handleFileChange, handleRemoveFile, handleSubmit, handleInputChange,
  handleTextAreaChange, getUserImage, t
}) => {
  const { themeMode } = useTheme();
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;
  const bg = theme.colors.surface;
  const textColor = theme.colors.text.primary;
  const borderColor = theme.colors.border;
  if (!showModal) return null;

  const formatDateTime = (dt?: string) => {
    if (!dt) return '-';
    const d = new Date(dt);
    if (isNaN(d.getTime())) return '-';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hour = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} | ${hour}:${min}`;
  };

  const userForMeta = selectedUser || formData;

  const modalActionBtnStyle = `
    .modal-action-btn { height: 44px; min-width: 120px; font-size: 16px; border-radius: 8px; font-weight: 500; box-shadow: none; margin-left: 0; margin-right: 0; transition: background 0.15s, color 0.15s; display: inline-flex; align-items: center; justify-content: center; }
    .modal-action-btn.cancel { background: #f3f4f6; color: #374151; border: 1px solid #d1d5db; }
    .modal-action-btn.submit { background: #2563eb; color: #fff; border: none; }
    .modal-action-btn:active { opacity: 0.9; }
  `;

  return (
    <>
      <style>{modalActionBtnStyle}</style>
      <Modal onClick={() => setShowModal(false)} style={{ background: 'rgba(0,0,0,0.25)' }}>
        <ModalContent onClick={(e) => e.stopPropagation()} style={{ background: bg, color: textColor, border: `1px solid ${borderColor}` }}>
          <ModalHeader style={{ background: bg, color: textColor, borderBottom: `1px solid ${borderColor}` }}>
            <ModalTitle>
              {modalMode === 'create' && t('userpage.createUser')}
              {modalMode === 'edit' && t('userpage.editUser')}
              {modalMode === 'view' && t('userpage.viewUser')}
            </ModalTitle>
            <CloseButton onClick={() => setShowModal(false)}><X size={20} /></CloseButton>
          </ModalHeader>
          <ModalBody style={{ background: bg, color: textColor }}>
            <Form onSubmit={handleSubmit}>
              <ProfilePhotoSection>
                <ProfilePhotoWrapper>
                  {modalMode === 'view' ? (
                    getUserImage(selectedUser || formData as User) ? (
                      <ProfilePhoto src={getUserImage(selectedUser || formData as User)} alt={(selectedUser?.display_name || formData.display_name || '')} style={{ width: 160, height: 160 }} />
                    ) : (
                      <ProfilePhotoPlaceholder style={{ width: 160, height: 160 }}>
                        {((selectedUser?.first_name || formData.first_name) && (selectedUser?.last_name || formData.last_name)) ? (
                          <span style={{ fontSize: 60, fontWeight: 600 }}>
                            {((selectedUser?.first_name || formData.first_name) as string)[0]?.toUpperCase()}
                            {((selectedUser?.last_name || formData.last_name) as string)[0]?.toUpperCase()}
                          </span>
                        ) : <UserIcon size={96} />}
                      </ProfilePhotoPlaceholder>
                    )
                  ) : (selectedFile || formData.avatar_url) ? (
                    <ProfilePhoto src={selectedFile ? URL.createObjectURL(selectedFile) : getUserImage(formData as User)} alt={formData.display_name || ''} style={{ width: 160, height: 160 }} />
                  ) : (
                    <ProfilePhotoPlaceholder style={{ width: 160, height: 160 }}>
                      {(formData.first_name && formData.last_name) ? (
                        <span style={{ fontSize: 60, fontWeight: 600 }}>{formData.first_name[0]?.toUpperCase()}{formData.last_name[0]?.toUpperCase()}</span>
                      ) : <UserIcon size={96} />}
                    </ProfilePhotoPlaceholder>
                  )}
                    {modalMode !== 'view' && (
    <FileInput
      style={{
        position: 'absolute',
        bottom: 8,
        right: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 40,
        width: 40,        // กำหนดขนาดกล่องไอคอน
        zIndex: 10        // ให้อยู่เหนือรูปภาพ
      }}
    >
      {selectedFile || formData.avatar_url ? (
        <button
          type="button"
          onClick={handleRemoveFile}
          style={{
            background: '#dc2626',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            width: 32,
            height: 32,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
          title={t('userpage.removePhoto') || 'Remove'}
        >
          <X size={20} color="#fff" />
        </button>
      ) : (
        <>
          <input
            type="file"
            id="avatar_url"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <FileLabel
            htmlFor="avatar_url"
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%'
            }}
          >
            <Upload size={16} />
          </FileLabel>
        </>
      )}
    </FileInput>
  )}
</ProfilePhotoWrapper>
              </ProfilePhotoSection>
              {/* Form sections are collapsed for brevity, but they are identical to your original code */}
              <FormSection style={{ background: bg, color: textColor, border: `1px solid ${borderColor}`, borderRadius: 12, marginBottom: 24, boxShadow: themeMode === 'dark' ? '0 2px 8px rgba(0,0,0,0.25)' : '0 2px 8px rgba(0,0,0,0.06)' }}>
                <SectionTitle style={{ color: textColor }}>{t('userpage.accountLogin')}</SectionTitle>
                <FormRow style={{ background: 'transparent' }}>
                  <FormGroup style={{ background: 'transparent' }}>
                    <Label style={{ color: textColor }}>{t('userpage.username')}<span>*</span></Label>
                    <Input type="text" name="username" value={formData.username || ''} onChange={handleInputChange} placeholder={t('userpage.usernamePlaceholder')} required maxLength={20} disabled={modalMode === 'view'} />
                    {formErrors.username && <div style={{ color: 'red', fontSize: 12 }}>{formErrors.username}</div>}
                  </FormGroup>
                  <FormGroup style={{ background: 'transparent' }}>
                    <Label style={{ color: textColor }}>{t('userpage.displayName')}</Label>
                    <Input type="text" name="display_name" value={formData.display_name || ''} onChange={handleInputChange} placeholder={t('userpage.displayNamePlaceholder')} maxLength={20} disabled={modalMode === 'view'} />
                  </FormGroup>
                </FormRow>
                <FormRow style={{ background: 'transparent' }}>
                  <FormGroup style={{ background: 'transparent' }}>
                    <Label style={{ color: textColor }}>{t('userpage.email')}<span>*</span></Label>
                    <Input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} placeholder={t('userpage.emailPlaceholder')} required maxLength={30} disabled={modalMode === 'view'} />
                    {formErrors.email && <div style={{ color: 'red', fontSize: 12 }}>{formErrors.email}</div>}
                  </FormGroup>
                </FormRow>
              </FormSection>

              <FormSection style={{ background: bg, color: textColor, border: `1px solid ${borderColor}`, borderRadius: 12, marginBottom: 24, boxShadow: themeMode === 'dark' ? '0 2px 8px rgba(0,0,0,0.25)' : '0 2px 8px rgba(0,0,0,0.06)' }}>
                <SectionTitle style={{ color: textColor }}>{t('userpage.personalDetails')}</SectionTitle>
                <FormRow style={{ gridTemplateColumns: 'minmax(100px, 0.7fr) 1.5fr 0.6fr 1.5fr', marginBottom: '24px', background: 'transparent' }}>
                  <FormGroup style={{ background: 'transparent' }}>
                    <Label style={{ color: textColor }}>{t('userpage.title')}</Label>
                    <Select name="title" value={formData.title || ''} onChange={handleInputChange} disabled={modalMode === 'view'}>
                        <option value="">{t('userpage.selectTitle')}</option>
                        <option value="Mr.">{t('userpage.mr')}</option>
                        <option value="Mrs.">{t('userpage.mrs')}</option>
                        <option value="Ms.">{t('userpage.ms')}</option>
                        <option value="Dr.">{t('userpage.dr')}</option>
                        <option value="Prof.">{t('userpage.prof')}</option>
                    </Select>
                  </FormGroup>
                  <FormGroup style={{ background: 'transparent' }}>
                    <Label style={{ color: textColor }}>{t('userpage.firstName')}<span>*</span></Label>
                    <Input type="text" name="first_name" value={formData.first_name || ''} onChange={handleInputChange} placeholder={t('userpage.firstNamePlaceholder')} required maxLength={20} disabled={modalMode === 'view'} />
                    {formErrors.first_name && <div style={{ color: 'red', fontSize: 12 }}>{formErrors.first_name}</div>}
                  </FormGroup>
                  <FormGroup style={{ maxWidth: '100px', background: 'transparent' }}>
                    <Label style={{ color: textColor }}>{t('userpage.middleName')}</Label>
                    <Input type="text" name="middle_name" value={formData.middle_name || ''} onChange={handleInputChange} placeholder={t('userpage.middleNamePlaceholder')} maxLength={5} disabled={modalMode === 'view'} />
                  </FormGroup>
                  <FormGroup style={{ background: 'transparent' }}>
                    <Label style={{ color: textColor }}>{t('userpage.lastName')}<span>*</span></Label>
                    <Input type="text" name="last_name" value={formData.last_name || ''} onChange={handleInputChange} placeholder={t('userpage.lastNamePlaceholder')} required maxLength={20} disabled={modalMode === 'view'} />
                    {formErrors.last_name && <div style={{ color: 'red', fontSize: 12 }}>{formErrors.last_name}</div>}
                  </FormGroup>
                </FormRow>
                <FormRow style={{ background: 'transparent' }}>
                  <FormGroup style={{ background: 'transparent' }}>
                    <Label style={{ color: textColor }}>{t('userpage.citizenId')}</Label>
                    <Input type="text" name="citizen_id" value={formData.citizen_id || ''} onChange={e => { const val = e.target.value.replace(/\D/g, '').slice(0, 13); setFormData({ ...formData, citizen_id: val }); setFormErrors((prev) => ({ ...prev, citizen_id: '' })); }} maxLength={13} inputMode="numeric" pattern="[0-9]{13}" placeholder={t('userpage.citizenIdPlaceholder')} disabled={modalMode === 'view'} />
                    {formErrors.citizen_id && <div style={{ color: 'red', fontSize: 12 }}>{formErrors.citizen_id}</div>}
                  </FormGroup>
                  <FormGroup style={{ background: 'transparent' }}>
                    <Label style={{ color: textColor }}>{t('userpage.mobileNo')}</Label>
                    <Input type="tel" name="mobile_no" value={formData.mobile_no || ''} onChange={e => { const val = e.target.value.replace(/\D/g, '').slice(0, 10); setFormData({ ...formData, mobile_no: val }); setFormErrors((prev) => ({ ...prev, mobile_no: '' })); }} maxLength={10} inputMode="numeric" pattern="[0-9]{10}" placeholder={t('userpage.mobileNoPlaceholder')} disabled={modalMode === 'view'} />
                    {formErrors.mobile_no && <div style={{ color: 'red', fontSize: 12 }}>{formErrors.mobile_no}</div>}
                  </FormGroup>
                  <FormGroup style={{ background: 'transparent' }}>
                    <Label style={{ color: textColor }}>{t('userpage.birthDate')}</Label>
                    <Input type="date" name="birth_date" value={formData.birth_date ? formData.birth_date.split('T')[0] : ''} onChange={handleInputChange} disabled={modalMode === 'view'} />
                  </FormGroup>
                </FormRow>
                <FormRow>
                  <FormGroup>
                    <Label style={{ color: textColor }}>{t('userpage.gender')}</Label>
                    <Select name="gender" value={formData.gender || ''} onChange={handleInputChange} disabled={modalMode === 'view'}>
                      <option value="">{t('userpage.selectGender')}</option>
                      <option value="Male">{t('userpage.male')}</option>
                      <option value="Female">{t('userpage.female')}</option>
                      <option value="Other">{t('userpage.other')}</option>
                      <option value="Prefer not to say">{t('userpage.preferNotToSay')}</option>
                    </Select>
                  </FormGroup>
                  <FormGroup>
                    <Label style={{ color: textColor }}>{t('userpage.bloodType')}</Label>
                    <Select name="blood_type" value={formData.blood_type || ''} onChange={handleInputChange} disabled={modalMode === 'view'}>
                      <option value="">{t('userpage.selectBloodType')}</option>
                      <option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option>
                      <option value="AB+">AB+</option><option value="AB-">AB-</option><option value="O+">O+</option><option value="O-">O-</option>
                    </Select>
                  </FormGroup>
                </FormRow>
                <FormRow style={{ background: 'transparent' }}>
                  <FormGroup style={{ gridColumn: '1 / -1', background: 'transparent' }}>
                    <Label style={{ color: textColor }}>{t('userpage.address')}</Label>
                    <TextArea name="address" value={formData.address || ''} onChange={handleTextAreaChange} placeholder={t('userpage.addressPlaceholder')} disabled={modalMode === 'view'} />
                  </FormGroup>
                </FormRow>
              </FormSection>

              <FormSection style={{ background: bg, color: textColor, border: `1px solid ${borderColor}`, borderRadius: 12, marginBottom: 24, boxShadow: themeMode === 'dark' ? '0 2px 8px rgba(0,0,0,0.25)' : '0 2px 8px rgba(0,0,0,0.06)' }}>
                <SectionTitle style={{ color: textColor }}>{t('userpage.organizationalInfo')}</SectionTitle>
                <FormRow style={{ background: 'transparent' }}>
                 <FormGroup style={{ background: 'transparent' }}>
  <Label style={{ color: textColor }}>{t('userpage.department')}</Label>
  <Select name="department" value={formData.department || ''} onChange={handleInputChange} disabled={modalMode === 'view'}>
    <option value="">{t('userpage.selectDepartment')}</option>
    <option value="IT">{t('userpage.departmentIT')}</option>
    <option value="Human Resources">{t('userpage.departmentHR')}</option>
    <option value="Finance">{t('userpage.departmentFinance')}</option>
    <option value="Marketing">{t('userpage.departmentMarketing')}</option>
    <option value="Sales">{t('userpage.departmentSales')}</option>
    <option value="Support">{t('userpage.departmentSupport')}</option>
    <option value="Operations">{t('userpage.departmentOperations')}</option>
    <option value="Development">{t('userpage.departmentDevelopment')}</option>
  </Select>
</FormGroup>

<FormGroup style={{ background: 'transparent' }}>
  <Label style={{ color: textColor }}>{t('userpage.role')}</Label>
  <Select name="role" value={formData.role || ''} onChange={handleInputChange} disabled={modalMode === 'view'}>
    <option value="">{t('userpage.selectRole')}</option>
    <option value="Admin">{t('userpage.roleAdmin')}</option>
    <option value="Manager">{t('userpage.roleManager')}</option>
    <option value="Staff">{t('userpage.roleStaff')}</option>
    <option value="Guest">{t('userpage.roleGuest')}</option>
    <option value="Developer">{t('userpage.roleDeveloper')}</option>
    <option value="Analyst">{t('userpage.roleAnalyst')}</option>
    <option value="Intern">{t('userpage.roleIntern')}</option>
    <option value="Consultant">{t('userpage.roleConsultant')}</option>
  </Select>
</FormGroup>

                </FormRow>
              </FormSection>
            </Form>
          </ModalBody>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: `1px solid ${borderColor}`, padding: '12px 20px', marginTop: 16, background: theme.colors.surfaceHover }}>
            <div style={{ fontSize: 13, color: theme.colors.text.secondary, whiteSpace: 'nowrap' }}>
              {modalMode !== 'create' && (
                <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
                  <span>Created At: {formatDateTime(userForMeta.created_at)}</span>
                  <span>Last Updated: {formatDateTime(userForMeta.updated_at)}</span>
                </div>
              )}
            </div>
            <ButtonGroup style={{ background: bg, borderRadius: 8 }}>
              <CancelButton type="button" onClick={() => setShowModal(false)} className="modal-action-btn cancel">{t('userpage.cancel')}</CancelButton>
              {modalMode === 'create' && <SubmitButton type="submit" onClick={handleSubmit} className="modal-action-btn submit">{t('userpage.create')}</SubmitButton>}
              {modalMode === 'edit' && <SubmitButton type="submit" onClick={handleSubmit} className="modal-action-btn submit">{t('userpage.update')}</SubmitButton>}
            </ButtonGroup>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};