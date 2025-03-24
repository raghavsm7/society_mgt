import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { RegisterScreen } from '@/screens/auth/RegisterScreen';
import { AdminDashboard } from '@/screens/admin/AdminDashboard';
import { UserDashboard } from '@/screens/user/UserDashboard';
import { OnboardingScreen } from '@/screens/onboarding/OnboardingScreen';
import { useAuth } from '@/context/AuthContext';
import { RootStackParamList } from '@/types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { user, isLoading } = useAuth();
  const [hasSeenOnboarding, setHasSeenOnboarding] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const checkOnboardingStatus = async () => {
      const seen = await AsyncStorage.getItem('hasSeenOnboarding');
      setHasSeenOnboarding(seen === 'true');
    } 
    checkOnboardingStatus();
  }, []);
  
  if (hasSeenOnboarding === null) {
    return null;
  }
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      {!user ? (
        // Auth Stack
        <>
          {!hasSeenOnboarding && (
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          )}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        // App Stack based on user role
        <>
          {user.role === 'society_admin' ? (
            <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          ) : (
            <Stack.Screen name="UserDashboard" component={UserDashboard} />
          )}
        </>
      )}
    </Stack.Navigator>
  );
};