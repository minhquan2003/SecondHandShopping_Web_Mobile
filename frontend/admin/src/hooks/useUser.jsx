import { useEffect, useState } from "react";
import axios from "axios";

const useUser = () => {
  const [accounts, setAccounts] = useState(0);
  const [bans, setBans] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu người dùng
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5555/admin/all-users"
        );
        const fetchedUsers = response.data.users || [];
        setUsers(fetchedUsers); // Đảm bảo trạng thái banned được lấy từ server
        setAccounts(response.data.totalUsers || 0);
        setBans(fetchedUsers.filter((user) => user.ban).length); // Đếm số user bị ban
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchBans = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5555/admin/all-banner"
        );
        console.log("Banned users:", response.data); // Debug output
        if (response.data && response.data.totalBannedUsers !== undefined) {
          setBans(response.data.totalBannedUsers || 0);
        }
      } catch (error) {
        console.error("Error fetching banned users:", error);
      }
    };

    fetchUsers();
    fetchBans();
  }, []);

  // Toggle ban/unban account
  // const toggleBan = async (id, currentLockedStatus) => {
  //   try {
  //     const endpoint = currentLockedStatus
  //       ? `http://localhost:5555/admin/unban-user/${id}`
  //       : `http://localhost:5555/admin/ban-user/${id}`;

  //     await axios.put(endpoint);

  //     setUsers(
  //       users.map((user) =>
  //         user._id === id ? { ...user, banned: !user.banned } : user
  //       )
  //     );

  //     setBans(currentLockedStatus ? (prev) => prev - 1 : (prev) => prev + 1);
  //   } catch (error) {
  //     console.error("Error toggling ban status:", error);
  //   }
  // };

  // Ban user
  const banUser = async (id) => {
    try {
      await axios.put(`http://localhost:5555/admin/ban-user/${id}`);
      setUsers(
        users.map((user) =>
          user._id === id ? { ...user, banned: true } : user
        )
      );
      setBans((prev) => prev + 1);
    } catch (error) {
      console.error("Error banning user:", error);
    }
  };

  // Unban user
  const unbanUser = async (id) => {
    try {
      await axios.put(`http://localhost:5555/admin/unban-user/${id}`);
      setUsers(
        users.map((user) =>
          user._id === id ? { ...user, banned: false } : user
        )
      );
      setBans((prev) => prev - 1);
    } catch (error) {
      console.error("Error unbanning user:", error);
    }
  };

  const deleteAccount = async (id) => {
    try {
      await axios.delete(`http://localhost:5555/admin/delete-account/${id}`);
      setUsers(users.filter((user) => user._id !== id));
      setAccounts((prev) => prev - 1); // Giảm tổng số tài khoản
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const searchUsers = async (keyword) => {
    try {
      const response = await axios.get(`http://localhost:5555/admin/search`, {
        params: { keyword },
      });
      return response.data.users || [];
    } catch (error) {
      console.error("Error searching users:", error);
      return [];
    }
  };

  return {
    accounts,
    bans,
    users,
    loading,
    banUser,
    unbanUser,
    deleteAccount,
    searchUsers,
  };
};

export default useUser;
