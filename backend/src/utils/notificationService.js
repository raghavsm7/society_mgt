const axios = require('axios');

const sendPushNotification = async (pushToken, title, body, data = {}) => {
    try {
        const message = {
            to: pushToken,
            title,
            body,
            data, // Additional data
        };

        await axios.post('https://exp.host/--/api/v2/push/send', message, {
            headers: {'Content-Type': 'application/json'},
        });

        console.log('Notification sent:', title);
    } catch (error) {
        console.error('Error sending notificaiton:', error.response?.data || error.message);
    }
};

module.exports = {sendPushNotification}