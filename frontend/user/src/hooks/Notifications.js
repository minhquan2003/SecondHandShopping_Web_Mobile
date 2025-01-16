import axios from "axios";

const updateNotification = async (notificationId, readed) => {
    try {
        const response = await axios.put(`http://localhost:5555/notifications/update`, { notificationId, readed });
        const data = response.data;
        return data;
    } catch (error) {
        console.error('Error updating notification:', error);
        throw error;
    }
};

const createNotification = async (notification) => {
    try {
        const response = await axios.post(`http://localhost:5555/notifications`, notification);
        const data = response.data;
        return data;
    } catch (error) {
        console.error('Error create notification:', error);
        throw error;
    }
};

export {updateNotification, createNotification}