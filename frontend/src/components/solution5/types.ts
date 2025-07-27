// solution5/types.ts

export interface User {
  id: string;
  avatar_url?: string;
  display_name: string;
  title?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  citizen_id?: string;
  birth_date?: string;
  blood_type?: string;
  gender?: string;
  mobile_no?: string;
  address?: string;
  username: string;
  email: string;
  role?: string;
  department?: string;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
}

export type ViewMode = 'table' | 'card' | 'list';