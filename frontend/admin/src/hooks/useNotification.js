import { useState, useEffect } from "react";
import axios from "axios";

const useNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5555/admin/notifications/"
      );
      setNotifications(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Post a new notification
  const postNotification = async (payload) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5555/admin/notifications/",
        payload
      );
      // Refresh notifications after successful post
      fetchNotifications();
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err; // Rethrow to handle in component
    } finally {
      setLoading(false);
    }
  };

  // Remove a notification by setting its status to false
  const removeNotification = async (id) => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `http://localhost:5555/admin/notifications/${id}`
      );
      // Refresh notifications after successful delete
      fetchNotifications();
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err; // Rethrow to handle in component
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    postNotification,
    removeNotification, // Expose removeNotification
  };
};

export default useNotification;
