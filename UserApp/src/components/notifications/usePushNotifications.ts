import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Alert } from "react-native";
import { apiService } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const usePushNotifications = () => {
    const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

        const registerForPushNotifications = async () => {
            if (!Device.isDevice) {
                Alert.alert("Mush use a physical device for push notifications");
                return;
            }

            const {status: existingStatus} = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus != "granted") {
                const {status} = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== "granted") {
                Alert.alert("Permission not granted for push notifications");
                return;
            }

            const token = (await Notifications.getExpoPushTokenAsync()).data;
            console.log("Generated push token:", token);
            setExpoPushToken(token);

            const userId = await AsyncStorage.getItem("userId");
            if (!userId) {
                console.log("User Id not found, cannot save push token");
                return;
            }

            //save the token to backend
            await apiService.savePushToken(token);
        };

    // return expoPushToken;
    return { registerForPushNotifications};
}