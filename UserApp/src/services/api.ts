import axios from 'axios';
import { API_URL, ENDPOINTS } from '../config/api';
import { AuthResponse, LoginCredentials, RegisterData, Society, User } from '../types/auth';
import { Post } from '@/components/noticeBoard/NoticeBoard';
import { Notice } from '@/components/noticeBoard/AdminNoticeBoard';
import { Expense, FinancialBalance, Fund } from '@/components/finance/finance';
import AsyncStorage from '@react-native-async-storage/async-storage';


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface AddFundData {
  date: string;
  flatNo: string;
  reason: string;
  amount: number;
  paidForMonth: string;
  societyCode: string;
  memberId: string;
  createdBy: string;
}

interface GuestEntry {
  _id: string;
  createdBy: {
      _id: string;
      name: string;
      flatNo: string;
  };
  guestName: string;
  purpose: string;
  visitDateTime: string;
  flatNo: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

class ApiService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data } = await api.post<AuthResponse>(ENDPOINTS.LOGIN, credentials);
      console.log("login data", data)
      // console.log("User stored in AsyncStorage:", response.user);
      return data;
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Login failed');
      }
      throw error;
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      console.log("Sending registration data:", data); // Debugging
      const response = await api.post<AuthResponse>(ENDPOINTS.REGISTER, data);
      console.log("register data", data)
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Registration failed');
      }
      throw error;
    }
  }

  async getSocietyResidents(societyCode: string): Promise<{ residents: User[] }> {
    try {
      const { data } = await api.get(ENDPOINTS.SOCIETY_RESIDENTS(societyCode));
      // console.log("data", data)
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Failed to fetch residents');
      }
      throw error;
    }
  }

  async getSocietyCommitteeResidents(societyCode: string): Promise<{ member: User[] }> {
    try {
      const { data } = await api.get(ENDPOINTS.SOCIETY_COMMITTEE_RESIDENTS(societyCode));
      // console.log("data", data)
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Failed to fetch committee members');
      }
      throw error;
    }
  }

  async approveUser(societyCode: string, userId: string): Promise<void> {
    try {
      await api.post(ENDPOINTS.APPROVE_USER(societyCode, userId));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Failed to approve user');
      }
      throw error;
    }
  }

  async disApproveUser(societyCode: string, userId: string): Promise<void> {
    // async disApproveUser(id: string): Promise<void> {
    try {
      await api.post(ENDPOINTS.DISAPPROVE_USER(societyCode, userId));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Failed to disApprove user');
      }
      throw error;
    }
  }

  async approveUserRole (societyCode: string, userId: string,
    newRole: 'cashier' | 'committee member'): Promise<void>  {
    try {
      const response = await api.post(ENDPOINTS.CASHIER(societyCode), {
        userId,
        newRole,
      });
      // return response.data; // Optionally process response
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || `Failed to assign ${newRole} role`);
      }
      throw error;
    }
  };

  async getSocietyPosts(): Promise<{ data: Post[] }> {
    try {
      const { data } = await api.get(ENDPOINTS.FETCH_SOCIETY_POSTS);
      // console.log("Post data", data)
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Failed to fetch residents');
      }
      throw error;
    }
  }

  async getNoticeBoardPosts(): Promise<{ data: Notice[]}> {
    try{
      const {data} = await api.get(ENDPOINTS.FETCH_NOTICE_BOARD_POSTS);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Failed to fetch residents');
      }
      throw error;
    }
  }

  async createSocietyPosts(postData: FormData) : Promise<void> {
    try{
      const response = await api.post(ENDPOINTS.SOCIETY_POSTS, postData, {
        headers: {
          'Content-Type' : 'multipart/form-data',
        },
    });
      // console.log("CREATED POST", response)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Failed to fetch residents');
      }
      throw error;
    }
  }

  async createNoticePosts(postData: {title: string; description: string}) : Promise<void> {
    try {
      const response = await api.post(ENDPOINTS.CREATE_NOTICE_POST, postData, {
        headers: {
          'Content-Type' : 'application/json',
        },
      });
      console.log("Created Notice Post: ", response)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Failed to fetch residents');
      }
      throw error;
    }
  }

  async toggleLike(postId: string, action: "like" | "dislike"): Promise<void> {
    try{
      await api.post(ENDPOINTS.LIKE (postId), {action});
    } catch(error) {
      throw new Error('Failed to toggle like');
    }
  }

  async addComment(postId: string, data: string) : Promise<void> {
    try {
      await api.post(ENDPOINTS.COMMENT (postId), {data});
    } catch (error) {
      throw new Error('Failed to add Comment');
    }
  }

  async getExpenses() : Promise<Expense[]> {
    try {
      const response = await api.get(ENDPOINTS.GET_EXPENSES);
      return response.data.data;
    } catch (error) {
      throw new Error('Failed to show expenses');
    }
  }

  async addExpense(expenseData: {spentDate: string; description: string; amount: number}) : Promise<void> {
    try {
      await api.post(ENDPOINTS.ADD_EXPENSE, expenseData)
    } catch (error) {
      throw new Error('Failed to add Expenses');
    }
  }

  async getFunds() : Promise<Fund[]> {
    try {
      const response = await api.get(ENDPOINTS.GET_FUNDS);
      return response.data.data;
    } catch (error) {
      throw new Error('Failed to show Funds');
    }
  }

  async addFund(fundData: {flatNo: string; description: string; amount: number;
                paidForMonth: string; }) : Promise<void> {
    // async addFund(fundData: AddFundData): Promise<void> {
    try {
      console.log('API request data: ', fundData);
      const response = await api.post(ENDPOINTS.ADD_FUND, fundData);
      console.log('API RESPONSE: ', response.data);
    } catch (error) {
      throw new Error('Failed to add Funds');
    }
  }

  async getFinancialBalance() : Promise<FinancialBalance> {
    try {
      const response = await api.get(ENDPOINTS.GET_BALANCE);
      return response.data.data;
    } catch (error) {
      throw new Error('Failed to show Balance');
    }
  }

  async addGuestEntryFromResident(data: Record<string, any>): Promise<{qrCodeImage: string; guestDetails: {guestName: string; visitDateTime: string; code: string;}}> {
    try{
      const response = await api.post(ENDPOINTS.GUEST_ENTRY_FROM_USER, data, {
             headers: {
          'Content-Type': 'application/json',
      },
      })
      // console.log("Guest entry created: ", response)
      return response.data;
    } catch (error) {
      throw new Error('Failed to add Guest Entry from Resident / User');
    }
  }

  // async guestEntryHistoryByUser() : Promise <{data: {guestName: string; visitDateTime: string}}> {
    async guestEntryHistoryByUser() : Promise<{ data: GuestEntry[] }> {
    try {
      const response = await api.get(ENDPOINTS.GUEST_HISTORY)
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch guest entry history');
  }
  }

  async savePushToken(token: string): Promise<void> {
    try {
      const user = await AsyncStorage.getItem("user"); // Fetch user ID
      if (!user) {
        console.error("User ID not found in storage");
        return;
      }

      const parsedUser = JSON.parse(user);

      if (!parsedUser._id) {
        console.error("User ID is missing in stored user data");
            return;
      }
      console.log("Saving push token with:", {
        userId: parsedUser._id,
        pushToken: token,
      });

      // await api.post("http://46.202.162.203:3002/api/auth/save-push-token", {
        await api.post("http://192.168.29.202:3000/api/auth/save-push-token", {

      // await api.post("https://1d32-2405-201-5012-38a5-dd15-1b1-4413-5846.ngrok-free.app/api/auth/save-push-token", {

        userId: parsedUser._id,
        pushToken: token
      });
    } catch (error) {
      console.error("Failed to save push token", error);
    }
}

  setAuthToken(token: string | null) {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }
}

export const apiService = new ApiService();