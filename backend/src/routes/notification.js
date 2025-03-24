// const express = require('express');
// const router = express.Router();

// const NotificationService = require('../utils/notifications');
// const User = require('../models/User');
// const NotificationType = require('../types/notificationTypes');
// const NotificationLog = require('../models/NotificationLog');

// // const notificationController =  require("../controllers/notificationController");

// router.post('/register', async (req, res) => {
//     try {
//         const newUser = new User(req.body);
//         await newUser.save();

//         // Notify admins about new registration
//         await NotificationService.notifyUserRegistration(newUser);
//         res.status(201).json(newUser);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// router.post('/approve-user/:userId', async (req, res) => {
//     try {
//         const user = await User.findByIdAndUpdate(
//             req.params.userId,
//             { isApproved: true },
//             { new: true }
//         );

//         // Notify the user about approval
//         await NotificationService.notifyUserApproval(user);

//         res.status(200).json(user);
//     } catch (error) {
//         res.status(500).json({ error: error.message});
//     }
// });

// router.post('/save-push-token', async (req, res) => {
//     try {
//         const { userId, pushToken } = req.body;

//         if (!userId || !pushToken) {
//             return res.status(400).json({ 
//                 message: 'User ID and Push Token are required' 
//             });
//         }
        
//         // Find user and update push token
//         const user = await User.findByIdAndUpdate(
//             userId, 
//             { pushToken }, 
//             { new: true }
//         );

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         res.status(200).json({ 
//             message: 'Push token saved successfully',
//             user: { 
//                 id: user._id, 
//                 pushTokenSaved: !!user.pushToken 
//             }
//         });
//     } catch (error) {
//         console.error('Save Push Token Error:', error);
//         res.status(500).json({ 
//             message: 'Error saving push token', 
//             error: error.message 
//         });
//     }
// });

// router.post('/test-notification', async (req, res) => {
//     try {
//         const {type, userId} = req.body;
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         let notificationDetails;
//         switch(type) {
//             case NotificationType.VISITOR_ENTRY:
//                 notificationDetails = {
//                     name: 'Test Visitor',
//                     _id: 'test-visitor-id'
//                 };
//                 await NotificationService.notifyVisitorEntry(user.societyCode, notificationDetails);
//                 break;
//             case NotificationType.COMMITTEE_MEETING:
//                 notificationDetails = {
//                     date: new Date().toDateString(),
//                     time: new Date().toLocaleTimeString(),
//                     _id: 'test-meeting-id',
//                     venue: 'Society ClubHouse'
//                 };
//                 await NotificationService.notifyCommitteeMeeting(user.societyCode, notificationDetails);
//                 break;
//             default:
//                 return res.status(400).json({ message: 'Invalid notification type' });
//         }

//         // Log the notification
//         await NotificationService.logNotification(type, notificationDetails);
        
//         res.status(200).json({
//             message: 'Test notification sent successfully',
//             details: notificationDetails
//         });
//     } catch (error) {
//         console.error('Test Notification Error:', error);
//         res.status(500).json({ 
//             message: 'Error sending test notification', 
//             error: error.message,
//             stack: error.stack 
//         });
//     }
// });

// router.get('/notification-logs', async (req, res) => {
//     try {
//         const { type, page = 1, limit = 10 } = req.query;
        
//         const query = type ? { type } : {};
        
//         const options = {
//             page: parseInt(page),
//             limit: parseInt(limit),
//             sort: { timestamp: -1 }
//         };

//         const logs = await NotificationLog.paginate(query, options);

//         res.status(200).json({
//             success: true,
//             data: logs
//         });
//     } catch (error) {
//         res.status(500).json({ 
//             message: 'Error retrieving notification logs', 
//             error: error.message 
//         });
//     }
// });

// router.post('/send-test-ui-notification', async (req, res) => {
//     try {
//         const { userId, message, type } = req.body;
//         const user = await User.findById(userId);

        
//         if (!user || !user.pushToken) {
//             return res.status(404).json({ 
//                 message: 'User not found or push token missing',
//                 user: !!user,
//                 pushToken: user?.pushToken 
//             });
//         }

//         // Create a comprehensive test notification
//         const testNotification = {
//             title: 'UI Test Notification',
//             body: message || 'This is a test notification from the backend!',
//             type: type || NotificationType.GENERAL_ANNOUNCEMENT,
//             data: {
//                 testId: Date.now().toString(),
//                 message: message || 'Backend says hello! 👋',
//                 timestamp: new Date().toISOString(),
//                 announcementId: 'test_announcement_123' // Add this for navigation
//             }
//         };

//         // Send notification using existing service
//         await NotificationService.sendPushNotification(
//             [user.pushToken],  // Direct token
//             testNotification
//         );

//         // Log the notification
//         await NotificationService.logNotification(
//             testNotification.type, 
//             testNotification
//         );

//         res.status(200).json({
//             success: true,
//             message: 'Test UI notification sent successfully',
//             notification: testNotification
//         });

//     } catch (error) {
//         console.error('UI Test Notification Error:', error);
//         res.status(500).json({ 
//             message: 'Error sending UI test notification', 
//             error: error.message 
//         });
//     }
// });

// module.exports = router;
