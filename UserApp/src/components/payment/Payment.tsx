import React from 'react'
import { View, Text, StyleSheet } from 'react-native';

export const Payment = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Payment section upcoming</Text>
    </View>
  )
}

export default Payment

const styles = StyleSheet.create({
    container: {
      flex: 1,                // Takes full screen height
      justifyContent: "center", // Centers content vertically
      alignItems: "center",   // Centers content horizontally
      backgroundColor: "#f8f9fa", // Optional background color
    },
    text: {
      fontSize: 20,          // Bigger font size
      fontWeight: "bold",    // Bold text
      color: "#333",         // Dark gray color
    },
  });
