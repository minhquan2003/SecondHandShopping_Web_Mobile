import React, { useState, useEffect } from "react";
import useUser from "../../hooks/useUser";
import { BiSolidUserDetail } from "react-icons/bi";
import { RiDeleteBin2Line } from "react-icons/ri";
import { BiLock, BiLockOpen } from "react-icons/bi"; // Import lock icons

const UserList = () => {
  const { users, loading, banUser, unbanUser, deleteAccount, accounts } =
    useUser();
  const [userList, setUserList] = useState(users || []);
  const [bannedUsers, setBannedUsers] = useState(
    users.filter((user) => user.ban)
  ); // Track banned users
  const [searchTerm, setSearchTerm] = useState(""); // State for search
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [message, setMessage] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10; // Number of users per page
  const totalPages = Math.ceil(accounts / limit); // Calculate total pages

  useEffect(() => {
    setUserList(users.slice((currentPage - 1) * limit, currentPage * limit)); // Paginate users
    setBannedUsers(users.filter((user) => user.ban)); // Lọc danh sách user bị ban
  }, [users, currentPage]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle search functionality
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setUserList(filteredUsers);
  };

  const handleAction = async (action, user) => {
    try {
      if (action === "banUser") {
        await banUser(user._id);
        setBannedUsers((prevBannedUsers) => [...prevBannedUsers, user]);
        setUserList((prevUsers) =>
          prevUsers.map((u) => (u._id === user._id ? { ...u, ban: true } : u))
        );
        setMessage(`User ${user.name} banned successfully.`);
      } else if (action === "unbanUser") {
        await unbanUser(user._id);
        setBannedUsers((prevBannedUsers) =>
          prevBannedUsers.filter((u) => u._id !== user._id)
        );
        setUserList((prevUsers) =>
          prevUsers.map((u) => (u._id === user._id ? { ...u, ban: false } : u))
        );
        setMessage(`User ${user.name} unbanned successfully.`);
      } else if (action === "deleteAccount") {
        await deleteAccount(user._id);
        setUserList((prevUsers) => prevUsers.filter((u) => u._id !== user._id));
        setBannedUsers((prevBannedUsers) =>
          prevBannedUsers.filter((u) => u._id !== user._id)
        );
        setMessage("User deleted successfully.");
      }
      window.location.reload();
    } catch (error) {
      console.error("Action failed:", error);
      setMessage("Failed to perform action.");
    }
    setConfirmationAction(null);
    setSelectedUser(null);
    setTimeout(() => setMessage(null), 3000);
  };

  const confirmAction = (action, user) => {
    setConfirmationAction(action);
    setSelectedUser(user);
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-5/6 ml-[16.6666%] p-4 bg-gray-100 rounded-md">
      <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
        User Manage
      </h2>

      {/* Success/Failure Message */}
      {message && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          {message}
        </div>
      )}

      {/* Search Bar */}
      <div className="my-4">
        <input
          type="text"
          className="border px-4 py-2 rounded w-full"
          placeholder="Search users by name..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* User Table */}
      <table className="table-auto w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Username</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Detail</th>
            <th className="border px-4 py-2">Delete</th>
            <th className="border px-4 py-2">Lock</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user) => (
            <tr
              key={user._id}
              className={`hover:bg-gray-50 ${user.ban ? "opacity-50" : ""}`}
            >
              <td className="text-sm border px-4 py-2">{user.name}</td>
              <td className="text-sm border px-4 py-2">{user.email}</td>
              <td className="text-sm border px-4 py-2">{user.phone}</td>
              <td className="text-sm border px-4 py-2 text-center">
                <button
                  className="text-blue-500 mx-2"
                  title="View Details"
                  onClick={() => setViewingUser(user)}
                >
                  <BiSolidUserDetail />
                </button>
              </td>
              <td className="border px-4 py-2 text-center">
                <button
                  className="text-red-500 mx-2"
                  title="Delete Account"
                  onClick={() => confirmAction("deleteAccount", user)}
                >
                  <RiDeleteBin2Line />
                </button>
              </td>
              <td className="border px-4 py-2 text-center">
                <button
                  className="text-yellow-500 mx-2"
                  title={user.ban ? "Unban Account" : "Ban Account"}
                  onClick={() =>
                    confirmAction(user.ban ? "unbanUser" : "banUser", user)
                  }
                >
                  {user.ban ? <BiLockOpen /> : <BiLock />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded-l"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          className="px-4 py-2 bg-gray-200 rounded-r"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Confirmation Modal */}
      {confirmationAction && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">Confirm Action</h2>
            <p>
              Are you sure you want to{" "}
              {confirmationAction === "deleteAccount"
                ? "delete"
                : selectedUser.ban
                ? "unban"
                : "ban"}{" "}
              the user <strong>{selectedUser.name}</strong>?
            </p>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-gray-200 px-4 py-2 rounded mr-2"
                onClick={() => setConfirmationAction(null)}
              >
                Cancel
              </button>
              <button
                className={`${
                  confirmationAction === "deleteAccount"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                } text-white px-4 py-2 rounded`}
                onClick={() => handleAction(confirmationAction, selectedUser)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Viewing User Modal */}
      {viewingUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">User Details</h2>
            <div className="flex justify-center mb-4">
              <img
                src={viewingUser.avatar_url}
                alt="Avatar"
                className="rounded-full h-24 w-24"
              />
            </div>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <tbody>
                <tr>
                  <td className="border px-4 py-2 font-bold">Name</td>
                  <td className="border px-4 py-2">{viewingUser.name}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">Email</td>
                  <td className="border px-4 py-2">{viewingUser.email}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">Phone</td>
                  <td className="border px-4 py-2">{viewingUser.phone}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">Address</td>
                  <td className="border px-4 py-2">{viewingUser.address}</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-gray-200 px-4 py-2 rounded"
                onClick={() => setViewingUser(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
