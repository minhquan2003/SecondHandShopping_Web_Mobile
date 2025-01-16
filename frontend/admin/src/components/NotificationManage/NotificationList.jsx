import React, { useState, useEffect } from "react";
import useNotification from "../../hooks/useNotification";
import { FaTrashAlt } from "react-icons/fa"; // Import icon for delete

const NotificationList = () => {
  const {
    notifications,
    loading,
    error,
    removeNotification,
    postNotification,
  } = useNotification();

  const [editMode, setEditMode] = useState(null); // ID of the notification being edited
  const [editTitle, setEditTitle] = useState(""); // Content for editing
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal
  const [notificationToDelete, setNotificationToDelete] = useState(null); // Store the notification id to delete

  const indexOfLastNotification = currentPage * notificationsPerPage;
  const indexOfFirstNotification =
    indexOfLastNotification - notificationsPerPage;
  const currentNotifications = notifications?.data?.slice(
    indexOfFirstNotification,
    indexOfLastNotification
  );

  useEffect(() => {
    // Quay về trang 1 nếu xóa hết thông báo trên trang hiện tại
    if (currentNotifications?.length === 0 && currentPage > 1) {
      setCurrentPage(1);
    }
  }, [notifications, currentNotifications, currentPage]);

  // Handle edit action
  const handleEdit = (id) => {
    postNotification(id, { title: editTitle });
    setEditMode(null);
  };

  // Open confirmation modal
  const confirmDelete = (id) => {
    setIsModalOpen(true);
    setNotificationToDelete(id);
  };

  // Handle the actual delete after confirmation
  const handleDelete = () => {
    if (notificationToDelete) {
      removeNotification(notificationToDelete);
      setIsModalOpen(false); // Close the modal after deleting
    }
  };

  // Pagination control functions
  const paginate = (pageNumber) => {
    // Đảm bảo không vượt quá số trang
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500">Loading notifications...</p>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  // Total number of pages
  const totalPages = Math.ceil(
    notifications?.data?.length / notificationsPerPage
  );

  return (
    <div className="w-5/6 ml-[16.6666%] p-4 bg-gray-100 rounded-md">
      <table className="w-full table-auto border-collapse border border-gray-300 bg-white shadow-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2 text-left">Stt</th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Notification
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {currentNotifications?.map((notification, index) => (
            <tr key={notification._id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">
                {indexOfFirstNotification + index + 1}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {editMode === notification._id ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Edit notification"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                  />
                ) : (
                  notification.message
                )}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {editMode === notification._id ? (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEdit(notification._id)}
                      className="px-2 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditMode(null)}
                      className="px-2 py-1 text-sm text-white bg-gray-500 rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => confirmDelete(notification._id)}
                      className="text-red-500 hover:text-red-600"
                      title="Delete"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {notifications?.data?.length > notificationsPerPage && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Previous
          </button>
          <span className="flex items-center justify-center px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Next
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-1/3">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this notification?</p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
