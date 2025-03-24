export interface Society {
  _id: string;
  name: string;
  code: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'society_admin' | 'resident' | 'cashier' | 'committee member';
  societyCode?: string;
  flatNo?: string;
  isApproved: boolean;
  profilePicture?: string;
  contactNo?: string;
}

export interface AuthResponse {
  data: { token: any; user: any; };
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: User['role'];
  societyCode?: string;
  flatNo?: string;
  contactNo?: string;
}