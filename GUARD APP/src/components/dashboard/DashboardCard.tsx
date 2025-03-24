import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';


interface DashboardCardProps {
  image: ImageSourcePropType;
  title: string;
  onPress: () => void;
}

export const DashboardCard = ({ image, title, onPress }: DashboardCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
      <Image source={image} style={styles.image} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 65,
    height: 65,
    resizeMode: 'contain',
  },
  title: {
    marginTop: 8,
    marginBottom: 10,
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});