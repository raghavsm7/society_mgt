import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { User } from '@/types/auth';
import { getImageUri } from '../Image/imageUtils';
import { useNotice } from '@/context/NoticeContext';
const DefaultImg = require("../../../assets/defaultImg/defaultimg.jpg")
const BannerImg = require("../../../assets/home/banner-image.png")

interface DashboardHeaderProps {
  user: User | null;
  onLogout: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

export const DashboardHeader = ({ 
  user, 
  onLogout, 
  showBackButton = false,
  onBack 
}: DashboardHeaderProps) => {
 
  const getProfileImage = () => {
    if (!user?.profilePicture) return DefaultImg;
    
    const imageUri = getImageUri(user.profilePicture);
    return imageUri ? { uri: imageUri } : DefaultImg;
  };

  // const {latestNotice} = useNotice();
  return (
    <View style={styles.header}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {showBackButton && (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
          )}
          <Image 
            // source={{ uri: profilePicture }}
            source={getProfileImage()}
            style={styles.profilePicture}
          />

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name}</Text>
            {/* {user?.flatNo && (
              <Text style={styles.flatNo}>Flat No: {user.flatNo}</Text>
            )} */}
          </View>
        </View>
        <TouchableOpacity onPress={onLogout}>
          <Icon name="logout" size={24} color="#333" />
        </TouchableOpacity>
      </View>

         {/* Notice Board Section */}
      {/* <View style={styles.noticeBoard}>
        <View style={styles.noticeHeader}>
        <Text style={styles.noticeTitle}>NOTICE</Text>
        <Text style={styles.newLabel}>New</Text>
        {latestNotice && (
          <Text style={styles.newLabel}>
            {new Date(latestNotice.createdAt).toLocaleDateString()}
          </Text>
        )}
      </View>
      <Text style={styles.noticeText} numberOfLines={2}>
        {latestNotice ? `${latestNotice.title} : ${latestNotice.description}`
        : "No notices available"}
      </Text>
      <Image source={BannerImg} style={styles.noticeImage} />
    </View> */}

    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: '12%',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    padding: 16,
  },
  leftSection: {
    flexDirection: 'row',
    // alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 12,
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    borderWidth: 1, // Add these for debugging
  borderColor: '#fff', // Add these for debugging
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  flatNo: {
    fontSize: 16,
    color: '#666',
  },
   // Notice Board Styles
  //  noticeBoard: {
  //   margin: 16,
  //   padding: 16,
  //   borderRadius: 8,
  //   //backgroundColor: '#5F9EA0', // Light blue background color
  //   backgroundColor: '#327585b5',
  //   position: 'relative',
  // },
  // noticeHeader: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   marginBottom: 8,
  // },
  // noticeTitle: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   textDecorationLine: 'underline',
  //   color: '#fff',
  // },
  newLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'red',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  // noticeText: {
  //   fontSize: 14,
  //   color: '#fff',
  //   textAlign: "left",
  //   marginRight: 50,
  // },
  // noticeImage: {
  //   width: 65,
  //   height: 50,
  //   position: 'absolute',
  //   bottom: 8,
  //   right: 8,
  // },
});