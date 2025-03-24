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
import { useAuth } from "@/context/AuthContext";
import { apiService } from "@/services/api";
import { User } from "@/types/auth";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getImageUri } from "../Image/imageUtils";
import Toast from "react-native-toast-message";
const NoticeBoardImg = require("../../../assets/home/noticeBoard.png");
const DefaultImg = require("../../../assets/defaultImg/defaultimg.jpg")

export type Post = {
  _id: string;
  postId: string;
  data: string;
  text: string;
  image?: string;
  likesCount: number;
  likes: string[]; // Ensure this is always an array
  userHasLiked: boolean;
  createdAt: string;
  updatedAt: string;
  comments?: any[];
  commentsCount: number;
  createdBy: CreatedBy;
  name: string;
};

type Comment = {
  data: string;
  userName: string;
  userProfile: string | null;
};

type CreatedBy = {
  name: string;
  profilePicture: string | null;
}

export const NoticeBoard = ({ societyCode }: { societyCode: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [societyPosts, setSocietyPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [data, setData] = useState<string>("");
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(
    null
  );
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedPostForComments, setSelectedPostForComments] = useState<Post | null>(null);
  const [refreshing, setRefreshing] = useState(false)

  const { logout, user } = useAuth();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await apiService.getSocietyPosts();
      setSocietyPosts(response.data);
      console.log("Post data", response.data);
    } catch (error) {
      console.error("Failed to load residents:", error);
      setSocietyPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadPosts().finally(() => setRefreshing(false))
  }, []);

  const handlePostPress = (post: Post) => {
    setSelectedPost(post);
    setPostModalOpen(true);
  };

  const closeModal = () => {
    setPostModalOpen(false);
    setSelectedPost(null);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setFile(result.assets[0].uri);
      setImagePreview(result.assets[0].uri);
    }
  };

  const getImageUriLocal = (imagePath: string | undefined): string | undefined => {
    if (!imagePath) return undefined;
    return imagePath.startsWith("http")
      ? imagePath // If already a full URL, use as-is
      // : `http://46.202.162.203:3002/uploads/${imagePath.split("\\").pop()}`; // Convert to valid URL
      // : `http://192.168.29.202:3000${imagePath}`
      : `http://192.168.29.202:3000/uploads/${imagePath.split("\\").pop()}`; // Convert to valid URL

  };

  const handleLikeToggle = async (postId: string) => {
    try {
      const isLiked = societyPosts.find(p => p.postId === postId)?.userHasLiked || false;
      const action = isLiked ? "dislike" : "like";

      setLikedPosts((prev) =>
        isLiked ? prev.filter((id) => id !== postId) : [...prev, postId]
      );

      // Call API to persist the like status
      await apiService.toggleLike(postId, action);
      console.log("Post Id data", postId);
      loadPosts();
    } catch (error) {
      console.error("Failed to toggle like:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to toggle like",
        position: "top",
        visibilityTime: 3000,
      })
    }
  };

  const handlePostSubmit = async () => {
    if(!text.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Post content cannot be empty",
        position: "top",
        visibilityTime: 3000,
      })
      // setError("Post content cannot be empty");
      return;
    }

    const postData = new FormData();
    postData.append("data", text);

    if (file) {
      const filename = file.split("/").pop();
      const type = `image/${filename?.split(".").pop()}`;
      postData.append("image", {
        uri: file,
        name: filename,
        type,
      } as any);
    }

    try {
      setLoading(true);
      await apiService.createSocietyPosts(postData);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Post created successfully.",
        position: "top",
        visibilityTime: 3000,
      })
      setIsModalOpen(false);
      setText("");
      setImagePreview(null);
      setFile(null);
      setError("");
      loadPosts();
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to create the post. Please try again.",
        position: "top",
        visibilityTime: 3000,
      })
      // setError("Failed to create the post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCommentPress = async (post: Post) => {
    setSelectedPostForComments(post);
    setIsCommentModalOpen(true);
  }

  const handleCommentSubmit = async (postId: string) => {
    try {
      await apiService.addComment(postId, data);
      setData("");
      // Refresh posts to get updated comments
      loadPosts();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to add comment.",
        position: "top",
        visibilityTime: 3000,
      })
      // console.error("Failed to add comment:", error);
    }
  };

  const resetModalStates = () => {
    setText("");
    setFile("");
    setImagePreview(null);
    setError(null);
  }

  const handleCloseModal = () => {
    resetModalStates();
    setIsModalOpen(false);
  }

  const getProfileImage = () => {
    if(!user?.profilePicture) return DefaultImg;

    const imageUri = getImageUri(user.profilePicture);
    return imageUri ? {uri: imageUri} : DefaultImg
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
        {[...societyPosts].reverse().map((post, index) => {
          return (
            <TouchableOpacity key={post.postId} onPress={() => handlePostPress(post)}>
              <View style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={styles.creatorInfo}>
                    <Image 
                      source={
                        post.createdBy.profilePicture ? 
                        {uri: getImageUri(post.createdBy.profilePicture)} : DefaultImg
                      }
                      style={styles.creatorImage}
                    />
                    <Text style = {styles.creatorName}>{post.createdBy.name}</Text>
                  </View>
                </View>
                <View style={styles.postContent}>
                {post.image && (
                  <Image
                    source={{ uri: getImageUriLocal(post.image)}}
                    style={styles.postImage}
                  />
                )}
                  <Text style={styles.postText}>
                    {/* {post.text.length > 100
                      ? `${post.text.slice(0, 100)}...`
                      : post.text} */}
                      {post.data !== "No content available" ? post.data : "No content available"}
                  </Text>
                </View>

                {/* Like and Comment Icons */}
              
                <View style={styles.postActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleLikeToggle(post.postId)}
                  >
                    <Icon
                      name="thumb-up"
                      size={24}
                      // color={likedPosts.includes(post.postId) ? "red" : "#666"}
                      color={post.userHasLiked ? "red" : "#666"}

                    />
                    <Text style={styles.actionText}>{post.likesCount}</Text>
                  </TouchableOpacity>

                  {/* comments */}
                  
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleCommentPress(post)}
                    >
                      <Icon name="comment" size={20} color="#666" />
                      <Text style={styles.actionText}>
                        {/* {post.comments?.length || 0} */}
                        {post.commentsCount}
                      </Text>
                    </TouchableOpacity>
                    </View>

                    {activeCommentPostId === post._id && (
                      <View style={styles.commentInputContainer}>
                        <TextInput
                          value={data}
                          onChangeText={setData}
                          placeholder="comment"
                          style={styles.commentInput}
                        />
                        <TouchableOpacity
                          style={styles.sendButton}
                          onPress={() => handleCommentSubmit(post._id)}
                        >
                          <Icon name="send" size={20} color="#007bff" />
                        </TouchableOpacity>
                      </View>
                    )}
                </View>
                </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsModalOpen(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Modal for Post Details */}
      <Modal
        visible={postModalOpen}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        {/* hello */}
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, styles.postModalContent]}>
          <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Post Details</Text>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
            
            {selectedPost && (
              <ScrollView>
                {selectedPost.image && (
                  <Image
                    source={{ uri: getImageUriLocal(selectedPost.image) }}
                    // style={styles.modalImage}
                    style={[styles.modalImage, { resizeMode: "contain", width: "100%", height: 300 }]}
                  />
                )}
              <Text style={styles.modalText}>
                {selectedPost.data !== "No content available" ? selectedPost.data : "No content available"}
              </Text>
              </ScrollView>
            )}
          </View>
        </View>

        </TouchableOpacity>
      </Modal>

      <Modal
        visible={isModalOpen}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          // onPress={() => setIsModalOpen(false)}
          onPress={handleCloseModal}
        >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Create New Society Post</Text>
            <TouchableOpacity
              style={styles.closeButton}
              // onPress={() => setIsModalOpen(false)}
              onPress={handleCloseModal}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
        </View>

        <ScrollView>
            <TextInput
              placeholder="Write your post content here..."
              value={text}
              onChangeText={(value) => {
                setText(value);
                setError("");
              }}
              style={[styles.input, styles.textArea]}
              multiline
            />
            {error && <Text style={styles.errorText}>{error}</Text>}

            <View style={styles.imageSelectorContainer}>
              <TouchableOpacity
                style={styles.imageSelector}
                onPress={pickImage}
              >
                <Text style={styles.imageSelectorText}>Pick an Image</Text>
              </TouchableOpacity>
            </View>

            {imagePreview && (
              <Image
                source={{ uri: imagePreview }}
                style={styles.imagePreview}
              />
            )}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handlePostSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Create Post</Text>
              )}
            </TouchableOpacity>
        </ScrollView>
          </View>
        </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={isCommentModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsCommentModalOpen(false)}
      >
         <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          // onPress={() => setIsModalOpen(false)}
          onPress={() =>setIsCommentModalOpen(false)}
          >

        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Comments</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsCommentModalOpen(false)}
                >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.commentsContainer}>
              {selectedPostForComments?.comments?.map((comment, index) => (
                <View key={index} style={styles.commentItem}>
                  <View style={styles.commentHeader}>
                    <Image
                      source={comment.userProfilePicture ? {uri: getImageUri(comment.userProfilePicture)} : DefaultImg}
                      style={styles.commentUserImage}
                    />
                    <View style={styles.commentContent}>
                  <Text style={styles.commentUser}>{comment.userName}</Text>
                  <Text style={styles.commentText}>{comment.data}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.commentInputContainer}>
              <TextInput
                value={data}
                onChangeText={setData}
                placeholder="Add a comment..."
                style={styles.commentInput}
                />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={() => selectedPostForComments && handleCommentSubmit(selectedPostForComments.postId)}
                >
                <Icon name="send" size={20} color="#007bff"/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

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
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginRight: 16,
    resizeMode: "contain"
  },
  postContent: {
    flex: 1,
    marginBottom: 10,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  postText: {
    fontSize: 14,
    color: "#555",
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
    flex: 1,
    justifyContent: 'flex-end', // Modal को bottom से show करेगा
    width: '100%',
  },
  modalContent: {
    backgroundColor: '#fff',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  padding: 16,
  maxHeight: '90%', // Screen का maximum 90% height लेगा
  },
  postModalContent: {
    width: '100%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
  },
  imageSelectorContainer: {
    flexDirection: "row",
    justifyContent: "flex-end", // Aligns button to the right
    marginBottom: 16,
  width: '100%', // Added full width
  },
  imageSelector: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    // alignItems: "flex-end",
    minWidth: 100, // Added minimum width
  alignItems: "center", // Changed to center
  },
  imageSelectorText: {
    color: "#fff",
    fontWeight: "bold",
  },
  imagePreview: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorText: {
    color: "#f00",
    marginBottom: 16,
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
  modalImage: {
    width: "100%",
    height: 200,
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
  },
   postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8,  // Add space below icons
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#666",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    width: '100%'
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#f8f8f8',
  },
  sendButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  commentsContainer: {
    maxHeight: '80%',
    marginVertical: 10,
  },
  commentItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  commentUser: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  commentText: {
    color: '#333',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  commentUserImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingRight: 10,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  creatorName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});
