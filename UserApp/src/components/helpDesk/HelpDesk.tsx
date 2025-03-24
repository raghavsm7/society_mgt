import React from 'react'
import { View, Text, StyleSheet } from 'react-native';

export const HelpDesk = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Help Desk section upcoming</Text>
    </View>
  )
}

export default HelpDesk

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