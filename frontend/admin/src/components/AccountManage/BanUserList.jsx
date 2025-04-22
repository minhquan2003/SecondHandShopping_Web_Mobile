import React, { useState, useEffect } from "react";
import useUser from "../../hooks/useUser";
import { IoClose } from "react-icons/io5";
import { TbListDetails } from "react-icons/tb";
import { FaSort } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";

const BanUserList = () => {
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedCheckBox, setSelectedCheckBox] = useState([]);
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("asc");
  const [searchKey, setSearchKey] = useState("");

  const {
    users = [],
    loading,
    error,
    totalPages,
    deleteUsers,
    unbanUser,
  } = useUser("banned", page, fieldSort, orderSort, searchKey);

  const handleSort = (field) => {
    setOrderSort((prev) => (prev === "asc" ? "desc" : "asc"));
    setFieldSort(field);
  };

  const handleUnBanUsers = () => {
    if (selectedCheckBox.length === 0) {
      alert("Please choose at least one user");
      return;
    }
    if (window.confirm("Are you sure you want to ban selected user")) {
      unbanUser(selectedCheckBox);
      setSelectedCheckBox([]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedCheckBox.length === 0) {
      alert("Please choose at least one user");
      return;
    }
    if (window.confirm("Are you sure you want to delete selected users")) {
      deleteUsers(selectedCheckBox);
      setSelectedCheckBox([]);
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedUser(null);
  };

  const handleSelectOne = (userId) => {
    setSelectedCheckBox((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id != userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCheckBox(users.map((user) => user._id));
    } else {
      setSelectedCheckBox([]);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex items-center">
        <select
          className="border border-black p-2 mb-4"
          defaultValue="choose"
          onChange={(e) => {
            if (e.target.value === "deleteUsers") {
              handleDeleteSelected();
              e.target.value = "choose";
            }
            if (e.target.value === "unBanUsers") {
              handleUnBanUsers();
              e.target.value = "choose";
            }
          }}
        >
          <option value="choose" disabled>
            Choose action...
          </option>
          <option value="unBanUsers">Unban selected users</option>
          <option value="deleteUsers">Delete selected users</option>
        </select>
        <div className="w-full flex border-2 border-gray-200 mb-4 p-1 ml-4">
          <div className="flex w-full mx-10 rounded bg-white">
            <input
              className=" w-full border-none bg-transparent px-4 py-1 text-gray-400 outline-none focus:outline-none "
              type="search"
              name="search"
              placeholder="Search by username..."
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <button type="submit" className="m-2 rounded text-blue-600">
              <FaSearch />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-sm px-4 py-2 text-center font-bold text-gray-600 border">
                <input
                  type="checkbox"
                  checked={
                    users.length > 0 && selectedCheckBox.length === users.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="inline-flex items-center gap-x-2">
                  Name <FaSort onClick={() => handleSort("name")} />
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="inline-flex items-center gap-x-2">
                  Email <FaSort onClick={() => handleSort("email")} />
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="inline-flex items-center gap-x-2">
                  Phone <FaSort onClick={() => handleSort("phone")} />
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="inline-flex items-center gap-x-2">
                  Address <FaSort onClick={() => handleSort("address")} />
                </span>
              </th>
              <th className="border px-4 py-2">Detail</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="border">
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedCheckBox.includes(user._id)}
                      onChange={() => handleSelectOne(user._id)}
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">{user.name}</td>
                  <td className="border px-2 py-2 text-center">{user.email}</td>
                  <td className="border px-4 py-2 text-center">{user.phone}</td>
                  <td className="border px-4 py-2 text-center">
                    {user.address}
                  </td>
                  <th className="border px-4 py-2">
                    <button
                      onClick={() => handleViewDetails(user)}
                      className="px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                      <TbListDetails />
                    </button>
                  </th>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-4 text-center">
                  No users available.
                  {console.log(users)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          className="px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span className="px-3 py-1 mx-2">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {isPopupOpen && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">User Details</h2>
            <div className="flex justify-center mb-4">
              <img
                src={selectedUser.avatar_url}
                alt="Avatar"
                className="rounded-full h-24 w-24"
              />
            </div>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <tbody>
                <tr>
                  <td className="border px-4 py-2 font-bold">Name</td>
                  <td className="border px-4 py-2">{selectedUser.name}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">Email</td>
                  <td className="border px-4 py-2">{selectedUser.email}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">Phone</td>
                  <td className="border px-4 py-2">{selectedUser.phone}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">Address</td>
                  <td className="border px-4 py-2">{selectedUser.address}</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-gray-200 px-4 py-2 rounded"
                onClick={closePopup}
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
export default BanUserList;
