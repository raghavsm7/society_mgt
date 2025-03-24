import { StyleSheet, Text, View } from "react-native";
import { BaseToast, ToastConfig } from "react-native-toast-message";

// Custom Toast Configuration
export const toastConfig: ToastConfig = {
  error: (props) => (
    <BaseToast
      {...props}
      style={[styles.toastContainer, { backgroundColor: "#FF0000", borderLeftColor: "#fff" }]} // Red Background
      contentContainerStyle={styles.content}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
  success: (props) => (
    <BaseToast
      {...props}
      style={[styles.toastContainer, { backgroundColor: "#1fd655", borderLeftColor: "#fff" }]} // Green Background
      contentContainerStyle={styles.content}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
};

const styles = StyleSheet.create({
  toastContainer: {
    borderLeftWidth: 6, // Left Border Thickness
    paddingVertical: 15, // Increase height
    width: "90%", // Increase width
  },
  content: {
    paddingHorizontal: 10, // Inner Padding
  },
  text1: {
    fontSize: 18, // Bigger Title
    fontWeight: "bold",
    color: "#fff", // White Color
  },
  text2: {
    fontSize: 16, // Bigger Subtitle
    color: "#fff", // White Color
  },
});
