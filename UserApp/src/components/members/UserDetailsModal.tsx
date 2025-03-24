import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { User } from '@/types/auth';
import { apiService } from '@/services/api';
import { getImageUri } from '../Image/imageUtils';
import Toast from 'react-native-toast-message';
const DefaultImg = require("../../../assets/defaultImg/defaultimg.jpg")

interface UserDetailsModalProps {
  user: User | null;
  visible: boolean;
  onClose: () => void;
  societyCode: string;
  fromCommitteeTab: boolean;
}

export const UserDetailsModal = ({ user, visible, onClose, societyCode, fromCommitteeTab }: UserDetailsModalProps) => {
  if (!user) return null;

  // const profilePicture = user.profilePicture || DefaultImg;

  const handleRoleChange = async (newRole: 'cashier' | 'committee member') => {
    if (!user) return;
    try {
      await apiService.approveUserRole(societyCode, user._id, newRole);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: `${newRole.charAt(0).toUpperCase() + newRole.slice(1)} role assigned successfully.`,
        position: "top",
        visibilityTime: 3000,
      })
      onClose(); // Close the modal after success
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `Failed to assign ${newRole} role. Only one cashier is allowed.`,
        position: "top",
        visibilityTime: 3000,
      })
      // alert(`Failed to assign ${newRole} role. Only one cashier is allowed.`);
    } 
  };

  const getProfileImage = () => {
    if (!user?.profilePicture) return DefaultImg;
    
    const imageUri = getImageUri(user.profilePicture);
    return imageUri ? { uri: imageUri } : DefaultImg;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={24} color="#666" />
          </TouchableOpacity>

          <View style={styles.rowContainer}>
          {/* Left Side: Photo, Name, Flat No */}
          <View style={styles.leftContainer}>
          
            {/* <Image 
            source={{ uri: profilePicture }}
            style={styles.profilePicture}
          /> */}
           <Image 
    source={getProfileImage()}
    style={styles.profilePicture}
    // Optional: Add error handling
    onError={() => console.log("Failed to load image:", user?.profilePicture)}
  />
          
          <Text style={styles.name}>{user.name}</Text>
         
          <Text style={styles.flatNo}>Flat No: {user.flatNo}</Text>
          </View>

{/* Right Side: Buttons */}
<View style={styles.rightContainer}>

          {fromCommitteeTab ? (
                <TouchableOpacity
                  style={styles.approveCashierButton}
                  onPress={() => handleRoleChange('cashier')}
                >
                  <Text style={styles.approveCashierButtonText}>
                    Society Cashier
                  </Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.approveCashierButton}
                    onPress={() => handleRoleChange('cashier')}
                  >
                    <Text style={styles.approveCashierButtonText}>
                      Society Cashier
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.approveCommitteButton}
                    onPress={() => handleRoleChange('committee member')}
                  >
                    <Text style={styles.approveCommitteButtonText}>
                      Committee Member
                    </Text>
                  </TouchableOpacity>
                </>
              )}
          </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row', // Align items horizontally
    justifyContent: 'space-between', // Ensure space between left and right sections
    alignItems: 'center', // Vertically center-align content
  },
  leftContainer: {
    flex: 1, // Take up remaining space
    alignItems: 'flex-start', // Align items to the left
  },
  rightContainer: {
    alignItems: 'flex-end', // Align buttons to the right
  
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    borderWidth: 1, // Add these for debugging
  borderColor: '#fff', // Add these for debugging
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  phone: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  flatNo: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
  },
  // buttonContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between', // Adjust spacing if needed
  //   marginTop: 10, // Optional, for some vertical spacing
  // },
  buttonContainer: {
    flexDirection: 'row', // Arrange buttons horizontally
    justifyContent: 'space-between', // Add space between buttons
    marginTop: 10,
    width: '100%', // Ensure buttons take full width of container
  },
  approveCashierButton: {
    backgroundColor: '#FF0000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    marginLeft: 10,
    marginBottom: 10,
    width: "95%"
  },
  approveCashierButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  approveCommitteButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  approveCommitteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});