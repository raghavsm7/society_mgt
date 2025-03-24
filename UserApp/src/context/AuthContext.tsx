import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, RegisterData } from '../types/auth';
import { apiService } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from "expo-notifications";


interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem('token'),
          AsyncStorage.getItem('user'),
        ]);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          // apiService.setAuthToken(storedToken);
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiService.login({ email, password });
      setUser(response.user);
      setToken(response.token);
      apiService.setAuthToken(response.token);
      
      // Ensure user data is stored before fetching push token
      await Promise.all([
        AsyncStorage.setItem('token', response.token),
        AsyncStorage.setItem('user', JSON.stringify(response.user)),
        
      ]);

      // Fetch stored user to confirm it's set
      const storedUser = await AsyncStorage.getItem("user");
      console.log("User stored in AsyncStorage:", storedUser);

      // Fetch Expo push token and save it
      const pushToken = await Notifications.getExpoPushTokenAsync();
      console.log("Push token received:", pushToken.data);
      
      if (pushToken) {
         await apiService.savePushToken(pushToken.data);
      }
      
console.log("User stored in AsyncStorage:", storedUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // const register = useCallback(async (data: RegisterData) => {
  //   try {
  //     setIsLoading(true);

  //     const {data: pushToken} = await Notifications.getExpoPushTokenAsync();
  //     console.log("Push token received during registration:", pushToken);

  //     const registrationData = {...data, pushToken: pushToken};

  //     const response = await apiService.register(registrationData);
  //     setUser(response.user);
  //     setToken(response.token);
  //     apiService.setAuthToken(response.token);

  //     await Promise.all([
  //       AsyncStorage.setItem('token', response.token),
  //       AsyncStorage.setItem('user', JSON.stringify(response.user)),
  //     ]);

  //      // Fetch stored user to confirm it's set
  //      const storedUser = await AsyncStorage.getItem("user");
  //      console.log("User stored in AsyncStorage:", storedUser);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      setIsLoading(true);
      console.log("Register function called with data:", data);

      const {data: pushToken} = await Notifications.getExpoPushTokenAsync();
      console.log("Push token received during registration:", pushToken);

      const registrationData = {...data, pushToken: pushToken};

      console.log("Sending registration data to API:", registrationData);

      const response = await apiService.register(registrationData);
      console.log("API response:", response);

      const { token, user} = response.data;
      setUser(user);
      setToken(token);
      apiService.setAuthToken(token);

      console.log("Extracted token:", token);
console.log("Extracted user:", user);

      await Promise.all([
        AsyncStorage.setItem('token', token),
        AsyncStorage.setItem('user', JSON.stringify(user)),
      ]);

       // Fetch stored user to confirm it's set
       const storedUser = await AsyncStorage.getItem("user");
       console.log("User stored in AsyncStorage:", storedUser);

      //  return response;
        
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    setToken(null);
    await Promise.all([
      AsyncStorage.removeItem('token'),
      AsyncStorage.removeItem('user'),
    ]);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};