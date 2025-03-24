import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { NoticeProvider } from '@/context/NoticeContext';
import * as Notifications from 'expo-notifications';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/components/Toaster/toastConfig';

export default function App() {

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    })
  })

  useEffect(() => {
    // Listen for incoming notifications
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log("Notification Received:", notification);
    });

    // Cleanup the listener on unmount
    return () => {
      notificationListener.remove();
    }
  }, []);
  
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <NoticeProvider>
          <AppNavigator />
          </NoticeProvider>
        </NavigationContainer>
      </AuthProvider>
      <Toast config={toastConfig}/>
    </SafeAreaProvider>
  );
}