import { useState, useEffect } from "react";
import axios from "axios";

const useNotification = (page = 1) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Fetch all notifications
    const fetchNotifications = async () => {
      const url = `http://localhost:5555/admin/notifications?page=${page}`;
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(url);

        const data = await response.data;
        if (data.success && Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
          setTotalPages(data.totalPages || 1);
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [page]);

  // Post a new notification
  const postNotification = async (payload) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5555/admin/notifications/",
        payload
      );
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err; // Rethrow to handle in component
    } finally {
      setLoading(false);
    }
  };

  // Remove a notification by setting its status to false
  const removeNotification = async (selectedIds) => {
    try {
      const response = await axios.delete(
        "http://localhost:5555/admin/notifications",
        {
          notificationIds: selectedIds,
        }
      );
      if (!response.ok) throw new Error("Failed to delete notification");

      setNotifications((prev) =>
        prev.filter((notification) => !selectedIds.includes(notification._id))
      );
      alert("Selected notification deleted successfully");
    } catch {
      alert("Failed to delete selected notifications");
    }
  };

  return {
    notifications,
    loading,
    error,
    totalPages,
    postNotification,
    removeNotification, // Expose removeNotification
  };
};

export default useNotification;
