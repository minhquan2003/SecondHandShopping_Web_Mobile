import {
  getAllNotifications,
  createNotification,
  deleteNotification,
} from "../../services/notification/adminNotificationService.js";

export const fetchAllNotifications = async (req, res) => {
  try {
    const notifications = await getAllNotifications();
    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const postNotification = async (req, res) => {
  const { message, user_id_created, user_id_receive, role } = req.body;

  try {
    if (!message || !user_id_created) {
      return res.status(400).json({
        success: false,
        message: "Message and user_id_created are required.",
      });
    }

    const notifications = await createNotification({
      message,
      user_id_created,
      user_id_receive,
      role,
    });

    if (notifications.length === 0) {
      return res.status(500).json({
        success: false,
        message: "No notifications were created.",
      });
    }

    res.status(201).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error(`Error in postNotification: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeNotification = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Notification ID is required.",
      });
    }

    const deletedNotification = await deleteNotification(id);

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully.",
      data: deletedNotification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
