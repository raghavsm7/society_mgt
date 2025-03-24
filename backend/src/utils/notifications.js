// const axios = require('axios');
// const User = require('../models/User'); 
// const NotificationType = require('../types/notificationTypes');
// const NotificationLog = require('../models/NotificationLog');

// class NotificationService {
//     static async sendPushNotification(recipients, payload) {
//         try {
//             const notificationPromises = recipients.map(async (token) => {
//                 try {
//                     const response = await axios.post('https://exp.host/--/api/v2/push/send', {
//                         to: token,
//                         sound: 'default',
//                         title: payload.title,
//                         body: payload.body,
//                         data: payload.data,
//                         priority: 'high', // Ensure high priority
//                         channelId: 'default' // Add a channel ID
//                     });
                    
//                     console.log('Notification Send Response:', {
//                         token,
//                         status: response.status,
//                         data: response.data
//                     });
    
//                     return response.data;
//                 } catch (error) {
//                     console.error(`Failed to send notification to token ${token}:`, {
//                         message: error.message,
//                         stack: error.stack
//                     });
//                     return null;
//                 }
//             });
    
//             const results = await Promise.all(notificationPromises);
            
//             console.log('Notification Results:', {
//                 totalRecipients: recipients.length,
//                 successfulNotifications: results.filter(r => r).length
//             });
    
//         } catch (error) {
//             console.error('Comprehensive Notification Error:', {
//                 message: error.message,
//                 stack: error.stack
//             });
//         }
//     }

//     static async sendExpoNotification (pushToken, {title, body, type, data}) {
//         try {
//             const message = {
//                 to: pushToken,
//                 sound: 'default',
//                 title: title,
//                 body: body,
//                 data: {
//                     type: type,
//                     ...data
//                 }
//             };

//             await axios.post('https://exp.host/--/api/v2/push/send', message, {
//                 headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json',
//                 }
//             })
//         } catch (error) {
//             console.error('Error sending Expo notification:', error);
//           }
//     }

//     // Example use case methods
//     static async notifyUserRegistration(newUser) {
//         await this.sendPushNotification(
//             ['society_admin', 'super_admin'],
//             {
//                 title: 'New User Registration',
//                 body: `${newUser.name} has requested to join the society`,
//                 type: NotificationType.USER_REGISTRATION,
//                 data: { userId: newUser._id }
//             }
//         );
//     }

//     static async notifyUserApproval(user) {
//         await this.sendPushNotification(
//             [user.role],
//             {
//                 title: 'Registration approved',
//                 body: 'Your society registration has been approved',
//                 type: NotificationType.USER_APPROVAL,
//                 data: {userId: user._id}
//             }
//         );
//     }

//     static async notifyExpenseAdded(expense) {
//         await this.sendPushNotification(
//             ['society_admin'],
//             {
//                 title: 'New Expense Added',
//                 body: `Expense of ${expense.amount} added by cashier`,
//                 type: NotificationType.EXPENSE_ADDED,
//                 data: {expenseId: expense._id}
//             }
//         );
//     }

//     // Add more specific notification methods as needed
//     static async notifyMaintenanceReminder(users, reminderDetails) {
//         await this.sendPushNotification(
//             users,
//             {
//                 title: 'Maintenance Reminder',
//                 body: `Maintenance due: ${reminderDetails.description}`,
//                 type: NotificationType.MAINTENANCE_REMINDER,
//                 data: { 
//                     maintenanceId: reminderDetails._id,
//                     amount: reminderDetails.amount
//                 }
//             }
//         )
//     }

//     static async notifyVisitorEntry(societyCode, visitorDetails) {
//         await this.sendPushNotification(
//             ['society_admin', 'guard'], 
//             {
//                 title: 'New Visitor Entry',
//                 body: `Visitor ${visitorDetails.name} entered at ${new Date().toLocaleTimeString()}`,
//                 type: NotificationType.VISITOR_ENTRY,
//                 data: {
//                     visitorId: visitorDetails._id,
//                     societyCode: societyCode
//                 }
//             }
//         );
//     }

//     // Committee Meeting Notification
//     static async notifyCommitteeMeeting(societyCode, meetingDetails) {
//         await this.sendPushNotification(
//             ['committee member', 'society_admin'],
//             {
//                 title: 'Committee Meeting Scheduled',
//                 body: `Meeting on ${meetingDetails.date} at ${meetingDetails.time}`,
//                 type: NotificationType.COMMITTEE_MEETING,
//                 data: {
//                     meetingId: meetingDetails._id,
//                     venue: meetingDetails.venue
//                 }
//             }
//         );
//     }

//     // Billing / Maintenance Fee Reminder
//     static async notifyMaintenanceFeeReminder(residents) {
//         await this.sendPushNotification(
//             residents.map(resident => resident.role),
//             {
//                 title: 'Maintenance Fee Reminder',
//                 body: 'Your monthly maintenance fee is due. Please pay before the deadline.',
//                 type: NotificationType.MAINTENANCE_REMINDER,
//                 data: { 
//                     dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
//                 }
//             }
//         );
//     }

//     // Security Alert
//     static async notifySecurityAlert(societyCode, alertDetails) {
//         await this.sendPushNotification(
//             ['society_admin', 'resident'],
//             {
//                 title: 'Security Alert',
//                 body: alertDetails.message,
//                 type: NotificationType.SECURITY_ALERT,
//                 data: { 
//                     alertId: alertDetails._id,
//                     timestamp: new Date().toISOString()
//                 }
//             }
//         );
//     }

//     // General Announcement
//     static async notifyGeneralAnnouncement(societyCode, announcementDetails) {
//         await this.sendPushNotification(
//             ['resident', 'society_admin', 'committee member'],
//             {
//                 title: 'Society Announcement',
//                 body: announcementDetails.message,
//                 type: NotificationType.GENERAL_ANNOUNCEMENT,
//                 data: { 
//                     announcementId: announcementDetails._id,
//                     category: announcementDetails.category
//                 }
//             }
//         );
//     }

//       // Enhanced method to filter users by role and society code
//       static async getUsersForNotification(roles, societyCode) {
//         try {
//             const users = await User.find({
//                 role: { $in: roles },
//                 societyCode: societyCode,
//                 pushToken: { $exists: true, $ne: null },
//                 'notificationSettings.pushNotifications': true
//             }).select('pushToken');

//             return users.map(user => user.pushToken).filter(token => token);
//         } catch (error) {
//             console.error('Error fetching users for notification:', error);
//             return [];
//         }
//     }

//     // Comprehensive Notification Logging
//     static async logNotification(type, payload) {
//         try {
//             const validType = this.validateNotificationType(type);

//             const notificationLog = new NotificationLog({
//                 type: validType,
//                 details: payload,
//                 recipients: payload.recipients || [],
//                 status: payload.status || 'SENT',
//                 timestamp: new Date()
//             });
//             await notificationLog.save();
//             return notificationLog;
//         } catch (error) {
//             console.error('Notification Logging Error:', {
//                 message: error.message,
//                 stack: error.stack,
//                 payload: payload
//             });
//             throw error;
//         }
//     }
//     static validateNotificationType(type) {
//         const validTypes = [
//             'VISITOR_ENTRY', 
//             'COMMITTEE_MEETING', 
//             'MAINTENANCE_REMINDER', 
//             'SECURITY_ALERT', 
//             'GENERAL_ANNOUNCEMENT'
//         ];

//         // If type is not in valid types, default to GENERAL_ANNOUNCEMENT
//         return validTypes.includes(type) ? type : 'GENERAL_ANNOUNCEMENT';
//     }
// }


// module.exports = NotificationService;
