const User = require('../models/User');
const { sendPushNotification } = require('../utils/notificationService');

exports.sendCustomNotification = async  (req, res) => {
    try {
        const { userId, title, body, data } = req.body;

        const user = await User.findById(userId);

        if (!user || !user.pushToken) {
            return res.status(404).json({message: 'User not found or no push token'});
        }

        await sendPushNotification(user.pushToken, title, body, data);

        res.status(200).json({ message: 'Notificatino sent successfully' });
    } catch (error) {
        res.staus(500).json({message: 'Error sending notification', error});
    }
}; 