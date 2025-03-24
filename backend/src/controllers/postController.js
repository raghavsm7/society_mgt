const upload = require('../middleware/upload'); // Import your Multer middleware
const Post= require('../models/post');
const User = require('../models/User');
const mongoose=require('mongoose')

exports.createPost = (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      const { data, societycode } = req.body;
      const userId = req.user_id; // Assume user_id is passed in the request
      const image = req.file ? req.file.path : null;
      // const image = req.file ? `/uploads/${req.file.filename}` : null;


      // Fetch the user info (username, profile picture)
      const user = await User.findById(userId).select('name profile');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // Create a new post with the user info, date will be added automatically
      const newPost = new Post({
        user: userId,
        data,
        image,
        societycode,
        username: user.name, // Add the username to the post
        profilePicture: user.profile, // Add the user's profile picture to the post
        date: new Date(), // Automatically add the current date
      });

      await newPost.save();

      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: newPost,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating post',
        error: error.message,
      });
    }
  });
};

exports.getAllPosts = async (req, res) => {
  try {
    const userId = req.user_id; // Get userId from the request (assumed to be from middleware)
    
    // Find all posts and populate necessary fields
    const posts = await Post.find()
      .populate('user', 'name profile profilePicture') // Populate user who created the post (including profilePicture)
      .lean(); // Convert to plain JS object

    // Process each post to include likes count, userHasLiked, and detailed comments
    const postsWithDetails = await Promise.all(
      posts.map(async (post) => {
        // Count likes
        const likesCount = post.likeDetails ? post.likeDetails.filter((detail) => detail.action === 'like').length : 0;

        // Check if the specific user has liked the post
        const userHasLiked = post.likeDetails?.some(
          (detail) => detail.userId.toString() === userId.toString() && detail.action === 'like'
        ) || false;

        // Process comments to include user details
        const commentsWithUserDetails = post.comments?.length
          ? await Promise.all(
              post.comments.map(async (comment) => {
                const user = await User.findById(comment.user).select('name profile profilePicture');
                return {
                  data: comment.data,
                  userName: user?.name || 'Unknown',
                  userProfile: user?.profile || null,
                  userProfilePicture: user?.profilePicture || null, // Add profilePicture here
                };
              })
            )
          : [];

        // Create the response object with the additional 'createdBy' field
        return {
          postId: post._id,
          data: post.data || 'No content available',
          image: post.image || null,
          likesCount,
          userHasLiked, // Check if this specific user has liked the post
          commentsCount: post.comments?.length || 0,
          comments: commentsWithUserDetails,
          createdBy: { // Include the user who created the post (name and profile picture)
            name: post.user?.name || 'Unknown',
            profilePicture: post.user?.profilePicture || null, // Include profilePicture
          },
        };
      })
    );

    // Send the response
    res.status(200).json({
      success: true,
      message: 'Posts fetched successfully',
      data: postsWithDetails,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts',
      error: error.message,
    });
  }
};


exports.toggleLikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { action } = req.body;

    // Validate user authentication
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    // Validate action
    // if (action !== 'like') {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Invalid action. Only "like" is allowed.',
    //   });
    // }
    if (!['like', 'dislike'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Only "like" or "dislike" is allowed.',
      });
    }

    // Validate postId format
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID',
      });
    }

    // Find the post by its ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Ensure likeDetails is initialized
    post.likeDetails = post.likeDetails || [];

    // Check if the user has already liked the post
    const existingLikeIndex = post.likeDetails.findIndex(
      (detail) => detail.userId.toString() === userId.toString()
    );

    let message;
    if (existingLikeIndex === -1) {
      // If the user hasn't liked the post, add the like
      post.likeDetails.push({ userId, action });
      message = 'Post liked successfully';
    } else {
      // If the user has liked the post, remove the like (unlike)
      post.likeDetails.splice(existingLikeIndex, 1);
      message = 'Post unliked successfully';
    }

    // Recalculate the likes count
    const likes = post.likeDetails.filter((detail) => detail.action === 'like').length;

    // Determine if the current user has liked the post
    const userHasLiked = post.likeDetails.some(
      (detail) => detail.userId.toString() === userId.toString() && detail.action === 'like'
    );

    // Populate the user details for those who liked the post
    const userIds = post.likeDetails.filter((detail) => detail.action === 'like').map((detail) => detail.userId);
    const users = await User.find({ _id: { $in: userIds } }).select('name profile');

    const likeDetailsWithUser = post.likeDetails
      .filter((detail) => detail.action === 'like')
      .map((detail) => {
        const user = users.find((u) => u._id.toString() === detail.userId.toString());
        return {
          userId: detail.userId,
          name: user?.name || 'Unknown',
          profile: user?.profile || null,
        };
      });

    // Save the updated post
    await post.save();

    // Respond with the updated data
    res.status(200).json({
      success: true,
      message,
      data: {
        postId: post._id,
        likes,
        userHasLiked,
        likeDetails: likeDetailsWithUser,
      },
    });
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).json({
      success: false,
      message: 'Error toggling like action',
      error: error.message,
    });
  }
};




// Add Comment
// Add Comment
exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params; // Extract `postId` from URL parameters
    const { data } = req.body; // Extract `data` (comment content) from request body
    const userId = req.user_id; // Ensure user ID is attached from authentication middleware

    // Validate that comment data exists
    if (!data) {
      return res.status(400).json({
        success: false,
        message: 'Comment data is required',
      });
    }

    // Find the post by ID
    const post = await Post.findById(postId);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Create a new comment object
    const newComment = {
      user: userId, // ID of the user adding the comment
      data,         // Content of the comment
    };

    // Add the new comment to the post's comments array
    post.comments.push(newComment);

    // Save the updated post
    await post.save();

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: post, // Returning the updated post (optional, can be trimmed to comments only)
    });
  } catch (error) {
    // Handle and log errors
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message,
    });
  }
};
