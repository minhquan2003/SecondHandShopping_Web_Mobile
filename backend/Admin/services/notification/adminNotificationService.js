import Notifications from "../../../User/models/Notifications.js";
import Users from "../../../User/models/Users.js";

export const getAllNotifications = async () => {
  try {
    return await Notifications.find({ status: true });
  } catch (error) {
    throw new Error(`Error fetching notifications: ${error.message}`);
  }
};

export const createNotification = async ({
  message,
  user_id_created,
  user_id_receive,
  role,
}) => {
  try {
    let receivers = [];

    if (user_id_receive) {
      // Send to the specific user based on user_id_receive
      const user = await Users.findOne({
        _id: user_id_receive,
        status: true,
        ban: false,
      });
      if (!user) {
        throw new Error(
          `User with ID ${user_id_receive} not found or does not meet the criteria.`
        );
      }
      receivers = [user._id];
    } else if (role) {
      // Send to users with the specified role and criteria
      const users = await Users.find({
        role: { $in: role },
        status: true,
        ban: false,
      });
      if (users.length === 0) {
        throw new Error(
          `No users found with roles: ${role.join(", ")} who meet the criteria.`
        );
      }
      receivers = users.map((user) => user._id);
    } else {
      // Send to all users who meet the criteria
      const users = await Users.find({ status: true, ban: false });
      if (users.length === 0) {
        throw new Error(
          `No users found in the database who meet the criteria.`
        );
      }
      receivers = users.map((user) => user._id);
    }

    // Create notifications for each receiver
    const notifications = receivers.map((receiver) => ({
      user_id_created,
      user_id_receive: receiver,
      message,
      status: true, // Default status
    }));

    if (notifications.length === 0) {
      throw new Error("No valid notifications to insert.");
    }

    return await Notifications.insertMany(notifications);
  } catch (error) {
    console.error(`Error in createNotification: ${error.message}`);
    throw new Error(`Error creating notifications: ${error.message}`);
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    const notification = await Notifications.findOneAndUpdate(
      { _id: notificationId, status: true },
      { status: false },
      { new: true }
    );

    if (!notification) {
      throw new Error(
        `Notification with ID ${notificationId} not found or already deleted.`
      );
    }

    return notification;
  } catch (error) {
    throw new Error(`Error deleting notification: ${error.message}`);
  }
};
