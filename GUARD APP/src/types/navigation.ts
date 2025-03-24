import { StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  AdminDashboard: undefined;
  UserDashboard: undefined;
  // DISAPPROVE: undefined;
};

export type AuthScreenProps<T extends keyof RootStackParamList> = StackScreenProps<RootStackParamList, T>;