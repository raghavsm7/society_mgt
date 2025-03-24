import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import { apiService } from "@/services/api";
import { useNotice } from "@/context/NoticeContext";
import Toast from "react-native-toast-message";
import { toastConfig } from "../Toaster/toastConfig";

type Creator = {
  _id: string;
  email: string;
  name: string;
}

export type Notice = {
  _id: string;
  postId: string;
  data: string;
  title: string;
  description: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: Creator;
}

export const AdminNoticeBoard = () => {
  const [noticeBoardPosts, setNoticeBoardPosts] = useState<Notice[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Notice | null>(null);
  const [postModalOpen, setPostModalOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [createPostModal, setCreatePostModal] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("");
  const [error, setError] = useState("")
  const {setLatestNotice} = useNotice();
  

  useEffect(() => {
    loadNoticePosts();
  },[])

  const loadNoticePosts = async () => {
    try {
      const response = await apiService.getNoticeBoardPosts();
      setNoticeBoardPosts(response.data);
      console.log("Notice Board Posts", response.data);  
      
      if(response.data.length > 0) {
        setLatestNotice(response.data[0]);
      }
    }catch (error) {
      console.error("Failed to load residents:", error);
      setNoticeBoardPosts([]);
    } finally {
      setLoading(false);
    }
  }

  const handlePostPress = async(post: Notice) => {
    setSelectedPost(post)
    setPostModalOpen(true);
  }

  const closeModal = () => {
    setPostModalOpen(false);
    setSelectedPost(null)
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadNoticePosts().finally(() => setRefreshing(false))
  },[]);

  const resetModalStates = () => {
    setTitle("");
    setDescription("")

  }

  const handleCloseModal = () => {
    setCreatePostModal(false)
    resetModalStates();
  }

  const validateForm = () => {
    if (!title.trim() || !description.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Title and description are required",
        position: "top",
        visibilityTime: 3000,
      })
      return false;
    }
    return true;
  }

  const handleNoticeSubmit = async () => {
    if (!validateForm()) return;
    try{
      setLoading(true);

      const postData = {
        title,
        description
      }
      await apiService.createNoticePosts(postData);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Post created successfully.",
        position: "top",
        visibilityTime: 3000,
      })
      setCreatePostModal(false)
      setTitle("");
      setDescription("");
      loadNoticePosts();
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to create the post. Please try again.",
        position: "top",
        visibilityTime: 3000,
      })
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.postsContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#007bff"]} // Android
            tintColor="#007bff" // iOS
          />
        }
      >
        {[...noticeBoardPosts].map((post, index) => {
          return (
            <TouchableOpacity key={post._id} onPress={() => handlePostPress(post)}>
            <View style={styles.postCard}>
              <View style={styles.postContent}>
                <Text style={styles.postTitle}>{post.title}</Text>
                <Text style={styles.postDescription}>{post.description}</Text>

                {/* Add creator info */}
                <View style={styles.postFooter}>
                  <Text style={styles.creatorName}>Posted By: {post.createdBy.name}</Text>
                  <Text style={styles.postDate}>{new Date(post.createdAt).toLocaleDateString()}</Text>
                </View>
              </View>
            </View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setCreatePostModal(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={postModalOpen}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, styles.postModalContent]}>
          <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Notice Details</Text>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          </View>

          {selectedPost && (
            <ScrollView style={styles.modalScrollContent}>
              <View style={styles.postDetailsContainer}>
              <Text style={styles.postTitle}>Title: {selectedPost.title}</Text>
              <Text style={styles.postDescription}>{selectedPost.description}</Text>
              <View style={styles.postMetaInfo}>
                <Text style={styles.creatorName}>Posted by: {selectedPost.createdBy.name}</Text>
                <Text style={styles.postDate}>
                  {new Date(selectedPost.createdAt).toLocaleDateString()}
                </Text>
              </View>
              </View>
            </ScrollView>
          )}
          </View>
          </View>

        </TouchableOpacity>
      </Modal>

      <Modal
        visible={createPostModal}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCloseModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Notice</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
              </View>

            <View style={styles.formContainer}>
              <TextInput 
                placeholder="Enter the title of notice"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
              />
              <TextInput 
                placeholder="Write your description..."
                value={description}
                onChangeText={setDescription}
                style={[styles.input, styles.textArea]}
                multiline
              />
            
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleNoticeSubmit}
                disabled={loading}
              >
              {loading ? (
              <ActivityIndicator color="#fff"/>
            ) : (
              <Text style={styles.submitButtonText}>Create Notice</Text>
            )}
              </TouchableOpacity>
            </View>
            </View>
          </View>
        </TouchableOpacity>
        <Toast config={toastConfig}/>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
  },
  postsContainer: {
    padding: 16,
  },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    // flexDirection: "row",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postContent: {
    flex: 1,
    marginBottom: 10,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  postDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  creatorName: {
    fontSize: 14,
    color: '#666',
  },
  postDate: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#007bff",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
  },
  modalContent: {
  backgroundColor: '#fff',
  borderRadius: 20,
  padding: 16,
  // maxHeight: '80%', // Screen का maximum 90% height लेगा
  width: '100%'
  },
  postModalContent: {
    elevation: 5,             // For Android shadow
  shadowColor: '#000',      // For iOS shadow
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    // marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
  textAlignVertical: 'top',

  },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e5e5e5",
    borderRadius: 15,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalScrollContent: {
    marginTop: 15,
  },
  postDetailsContainer: {
    padding: 10,
  },
  postMetaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  formContainer: {
    marginTop: 15,
    gap: 15, // Space between elements
  },
});



