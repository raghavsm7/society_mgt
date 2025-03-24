import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { User } from '@/types/auth';
import { UserDetailsModal } from './UserDetailsModal';
const DefaultImg = require("../../../assets/defaultImg/defaultimg.jpg")

interface MembersListProps {
  residents: User[];
  isAdmin?: boolean;
  onApprove?: (userId: string) => void;
  onDisApprove?: (id: string) => void;
  showOnlyApproved?: boolean;
  societyCode: string;
}

export const MembersList = ({ 
  residents, 
  isAdmin = false, 
  onApprove,
  onDisApprove,
  showOnlyApproved = false,
  societyCode,
}: MembersListProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fromCommitteeTab, setFromCommitteeTab] = useState(false)


  const filteredResidents = showOnlyApproved 
    ? residents.filter(resident => resident.isApproved)
    : residents || [];

    if (!Array.isArray(filteredResidents)) {
  console.error('filteredResidents is not an array:', filteredResidents);
  return null;
}

  const handleUserPress = (user: User, isCommittee: boolean) => {
    setSelectedUser(user);
    setModalVisible(true);
    setFromCommitteeTab(isCommittee)
  };

  return (
    <>
      <ScrollView style={styles.container}>
        {filteredResidents.map((resident) => {
          const profilePicture = resident?.profilePicture
          ? { uri: resident.profilePicture } // Remote image
          : DefaultImg; // Local default image

          return (
            <TouchableOpacity
              key={resident._id}
              style={styles.residentCard}
              onPress={() => handleUserPress(resident, false)}
            >
              <Image 
            // source={{ uri: profilePicture }}
            source={profilePicture}
            style={styles.profilePicture}
          />
           {/* <Image 
            // source={profilePicture} // Correctly assign the image source 
            source = {DefaultImg}
            style={styles.profilePicture}
          /> */}
              <View style={styles.residentInfo}>
                <Text style={styles.residentName}>{resident.name}</Text>
                <Text style={styles.flatNo}>Flat: {resident.flatNo}</Text>
                {isAdmin && (
                  <Text style={[
                    styles.approvalStatus,
                    resident.isApproved ? styles.approved : styles.pending
                  ]}>
                    {resident.isApproved ? 'Approved' : 'Pending Approval'}
                  </Text>
                )}
              </View>
              {isAdmin && !resident.isApproved && onApprove && (
                <TouchableOpacity 
                  style={styles.approveButton}
                  onPress={() => onApprove(resident._id)}
                >
                  <Text style={styles.approveButtonText}>Approve</Text>
                </TouchableOpacity>
              )}
              {isAdmin && resident.isApproved && onDisApprove && (
                <TouchableOpacity 
                  style={styles.disApproveButton}
                  onPress={() => onDisApprove(resident._id)}
                >
                  <Text style={styles.disApproveButtonText}>Disapprove</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        })}
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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  residentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    borderWidth: 1, // Add these for debugging
  borderColor: '#fff', // Add these for debugging
  },
  residentInfo: {
    flex: 1,
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
  approvalStatus: {
    fontSize: 12,
    marginTop: 4,
  },
  approved: {
    color: '#4CAF50',
  },
  pending: {
    color: '#FFC107',
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  approveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  disApproveButton: {
    backgroundColor: '#FF0000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  disApproveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});