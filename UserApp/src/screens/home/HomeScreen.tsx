import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Society Home</Text>
        <Icon name="notifications" size={24} color="#333" />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>Welcome to Your Society</Text>
          <Text style={styles.societyName}>Green Valley Apartments</Text>
        </View>

        <View style={styles.quickActions}>
          <View style={styles.actionCard}>
            <Icon name="people" size={32} color="#2196F3" />
            <Text style={styles.actionText}>Members</Text>
          </View>
          <View style={styles.actionCard}>
            <Icon name="event" size={32} color="#2196F3" />
            <Text style={styles.actionText}>Events</Text>
          </View>
          <View style={styles.actionCard}>
            <Icon name="announcement" size={32} color="#2196F3" />
            <Text style={styles.actionText}>Notices</Text>
          </View>
        </View>

        <View style={styles.recentActivities}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          <View style={styles.activityItem}>
            <Icon name="info" size={24} color="#666" />
            <Text style={styles.activityText}>Welcome to the society app</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  welcomeCard: {
    backgroundColor: '#2196F3',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
  societyName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionText: {
    marginTop: 8,
    color: '#333',
    fontSize: 12,
  },
  recentActivities: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activityText: {
    marginLeft: 12,
    color: '#666',
    fontSize: 14,
  },
});