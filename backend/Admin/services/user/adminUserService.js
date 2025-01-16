import Users from "../../../User/models/Users.js";
import Products from "../../../User/models/Products.js";
import Orders from "../../../User/models/Orders.js";
import Reviews from "../../../User/models/Reviews.js";
import Feedbacks from "../../../User/models/Feedbacks.js";
import Notifications from "../../../User/models/Notifications.js";

//--------Đếm số lượng người dùng tất cả trừ admin
const getCountExcludingRole = async (excludedRole) => {
  try {
    const count = await Users.countDocuments({
      role: { $ne: excludedRole },
      status: true,
    });
    return count;
  } catch (error) {
    throw new Error("Error fetching count excluding role: " + error.message);
  }
};

//--------Lấy tất cả người dùng trừ admin
const getAllUsersExcludingRole = async (excludedRole) => {
  try {
    const users = await Users.find({
      role: { $ne: excludedRole },
      status: true,
    });
    return users;
  } catch (error) {
    throw new Error("Error fetching users: " + error.message);
  }
};

//--------Đếm số lượng người dùng theo role
const getCountByRole = async (role) => {
  try {
    const count = await Users.countDocuments({
      role,
      status: true,
    });
    return count;
  } catch (error) {
    throw new Error("Error fetching count by role: " + error.message);
  }
};

//--------Lấy tất cả người dùng đang có role là....
const getUsersByRole = async (role) => {
  try {
    const users = await Users.find({
      role,
      status: true,
    });
    return users;
  } catch (error) {
    throw new Error("Error fetching users by role: " + error.message);
  }
};

//--------Đếm số lượng người dùng bị ban
const getCountBannedUsers = async () => {
  try {
    const count = await Users.countDocuments({
      ban: true,
      status: true,
    });
    return count;
  } catch (error) {
    throw new Error("Error fetching count of banned users: " + error.message);
  }
};

//--------Lấy tất cả người dùng bị ban
const getBannedUsers = async () => {
  try {
    const users = await Users.find({
      ban: true,
      status: true,
    });
    return users;
  } catch (error) {
    throw new Error("Error fetching banned users: " + error.message);
  }
};

//-------- Ban người dùng
const banUser = async (userId) => {
  try {
    const user = await Users.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.ban = true; // Đặt trạng thái ban là true
    await user.save();
    return user;
  } catch (error) {
    throw new Error("Error banning user: " + error.message);
  }
};

//-------- Unban người dùng
const unbanUser = async (userId) => {
  try {
    const user = await Users.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.ban = false; // Đặt trạng thái ban là false
    await user.save();
    return user;
  } catch (error) {
    throw new Error("Error unbanning user: " + error.message);
  }
};

//---- Đổi role giữa partner và user
const toggleUserRole = async (userId) => {
  try {
    const user = await Users.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Chuyển đổi role
    user.role = user.role === "partner" ? "user" : "partner";
    await user.save();
    return user;
  } catch (error) {
    throw new Error("Error toggling user role: " + error.message);
  }
};

//--------Xóa tạm người dùng
const deleteUser = async (userId) => {
  try {
    // Update the user's status to false
    const result = await Users.findByIdAndUpdate(
      userId,
      { status: false },
      { new: true } // Return the updated document
    );

    // Update related models' statuses
    await Products.updateMany({ user_id: userId }, { status: false });

    await Orders.updateMany(
      { $or: [{ user_id_buyer: userId }, { user_id_seller: userId }] },
      { status: false }
    );

    await Notifications.updateMany(
      { user_id_receive: userId },
      { status: false }
    );

    await Feedbacks.updateMany({ user_id: userId }, { status: false });

    await Reviews.updateMany({ user_id: userId }, { status: false });

    return result;
  } catch (error) {
    throw new Error("Error deactivating user: " + error.message);
  }
};

// Fetch user by ID
const fetchUserById = async (userId) => {
  try {
    const user = await Users.findById(userId).select("name");
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error("Error fetching user: " + error.message);
  }
};

//-------- Tìm kiếm người dùng theo từ khóa
const searchUsers = async (keyword) => {
  try {
    const regex = new RegExp(keyword, "i"); // Tạo regex để tìm kiếm không phân biệt hoa thường
    const query = {
      $or: [
        { name: regex },
        { email: regex },
        // Nếu từ khóa là số hợp lệ, tìm trên trường phone
        ...(isNaN(Number(keyword)) ? [] : [{ phone: keyword }]),
      ],
      status: true, // Chỉ lấy người dùng đang hoạt động
    };

    const users = await Users.find(query).select("name email phone address"); // Chỉ lấy các trường cần thiết
    return users;
  } catch (error) {
    throw new Error("Error searching users: " + error.message);
  }
};

// Chuyển role giữa regisPartner và partner
const switchRole = async (userId, currentRole, newRole) => {
  try {
    const user = await Users.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.role !== currentRole) {
      throw new Error(`User is not in role: ${currentRole}`);
    }

    // Cập nhật role mới
    user.role = newRole;
    await user.save();
    return user;
  } catch (error) {
    throw new Error("Error switching user role: " + error.message);
  }
};

export {
  getCountExcludingRole,
  getCountByRole,
  getAllUsersExcludingRole,
  getUsersByRole,
  deleteUser,
  getCountBannedUsers,
  getBannedUsers,
  unbanUser,
  banUser,
  toggleUserRole,
  fetchUserById,
  searchUsers,
  switchRole,
};
