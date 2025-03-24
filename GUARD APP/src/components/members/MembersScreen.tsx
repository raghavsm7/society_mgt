import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MembersList } from './MembersList';
import { User } from '@/types/auth';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/services/api';
import { UserDetailsModal } from './UserDetailsModal';
const DefaultImg = require("../../../assets/defaultImg/defaultimg.jpg")

interface MembersScreenProps {
  residents: User[];
  isAdmin?: boolean;
  onApprove?: (userId: string) => void;
  onDisApprove?: (id: string) => void;
  societyCode: string;
  // committeMembers: User[];
}

type Tab = 'members' | 'committee';

export const MembersScreen = ({ residents, isAdmin = false, onApprove, onDisApprove, societyCode }: MembersScreenProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('members');
  const [committeeMembers, setCommitteeMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fromCommitteeTab, setFromCommitteeTab] = useState(false)


  useEffect(() => {
    loadCommitteeResidents()
  }, [])
  
  const loadCommitteeResidents = async () => {
    if(!user?.societyCode) return;
    
    try {
      setIsLoading(true);
      const response = await apiService.getSocietyCommitteeResidents(user.societyCode);  
      const filteredCommitteeMembers = response.member.filter((members: User) => members.role === "committee member")
      setCommitteeMembers(filteredCommitteeMembers);
    } catch(error) {
      console.log("failed to load residents: ", error);
      // setResidents([]);
      setCommitteeMembers([]);
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserPress = (user: User, isCommittee: boolean) => {
    setSelectedUser(user);
    setModalVisible(true);
    setFromCommitteeTab(isCommittee)
  };

  
  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'members' && styles.activeTab]}
          onPress={() => setActiveTab('members')}
          >
          <Text style={[styles.tabText, activeTab === 'members' && styles.activeTabText]}>
            Members
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'committee' && styles.activeTab]}
          onPress={() => setActiveTab('committee')}
          >
          <Text style={[styles.tabText, activeTab === 'committee' && styles.activeTabText]}>
            Committee
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
      {activeTab === 'members' ? (
        <MembersList
          residents={residents || []}
          isAdmin={isAdmin}
          onApprove={onApprove}
          onDisApprove={onDisApprove}
          showOnlyApproved={!isAdmin}
          societyCode={societyCode}
        />
      ) : (
        <ScrollView style={styles.committeeContainer}>
          {isLoading ? (
            <Text>Loading committee members...</Text>
          ) : (
            committeeMembers.map((resident) => {
              const profilePicture = resident?.profilePicture
          ? { uri: resident.profilePicture } // Remote image
          : DefaultImg; // Local default image

              return (
                <TouchableOpacity
                  key={resident._id}
                  style={styles.residentCard} // Reuse the "residentCard" style for consistency
                  onPress={() => handleUserPress(resident, true)} // Add interaction for committee members
                >
                 <Image 
            // source={{ uri: profilePicture }}
            source={profilePicture}
            style={styles.profilePicture}
          />
                  <View style={styles.residentInfo}>
                    <Text style={styles.residentName}>{resident.name}</Text>
                    <Text style={styles.flatNo}>Flat: {resident.flatNo}</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      )}
    </ScrollView>
    <UserDetailsModal
    user={selectedUser}
    visible={modalVisible}
    onClose={() => {
      setModalVisible(false);
      setSelectedUser(null);
    }}
    societyCode={societyCode} 
    fromCommitteeTab={fromCommitteeTab}
  />
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f5f5f5',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 8,
    marginBottom: 16,
  },
  residentInfo: {
    flex: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    borderWidth: 1, // Add these for debugging
  borderColor: '#fff', // Add these for debugging
  },
  // committeeContainer: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  residentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  comingSoon: {
    fontSize: 16,
    color: '#666',
  },
  committeeContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  committeeCard: {
    padding: 16,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  committeeMemberName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  residentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  flatNo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  role: {
    fontSize: 14,
    color: '#007BFF',
  }
});



          