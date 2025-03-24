import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type TabType = 'home' | 'community' | 'service' | 'profile';

interface FooterTabsProps {
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
}

export const FooterTabs = ({ activeTab, onTabPress }: FooterTabsProps) => {
  const tabs: Array<{ key: TabType; icon: string; label: string }> = [
    { key: 'home', icon: 'home', label: 'Home' },
    // { key: 'community', icon: 'chat', label: 'Community' },
    // { key: 'service', icon: 'build', label: 'Service' },
    // { key: 'profile', icon: 'person', label: 'Profile' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.key}
          style={styles.tab}
          onPress={() => onTabPress(tab.key)}
        >
          <Icon
            name={tab.icon}
            size={24}
            color={activeTab === tab.key ? '#2196F3' : '#666'}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === tab.key && styles.activeTabLabel,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: '10%',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    borderBottomLeftRadius: 20, // Add this for rounding bottom-left corner
    borderBottomRightRadius: 20, // Add this for rounding bottom-right corner
    overflow: 'hidden', // Ensures children respect the border radius
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activeTabLabel: {
    color: '#2196F3',
  },
});