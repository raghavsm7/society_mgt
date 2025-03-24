import React from 'react'
import { View, Text, StyleSheet } from 'react-native';

const BookAmenities = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Book Amenities section upcoming</Text>
    </View>
  )
}

export default BookAmenities

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