import Regulations from "../../../User/models/Regulations.js";

//--------------------------------Lấy tất cả quy định--------------------------------
const getAllRegulations = async (page = 1, limit = 10) => {
  // try {
  //   const regulations = await Regulations.find({ status: true }) // Lọc theo status
  //     .sort({ createdAt: -1 }); // Sắp xếp theo thời gian mới nhất

  //   const totalRegulations = await Regulations.countDocuments({ status: true }); // Đếm chỉ các quy định có status = true

  //   return {
  //     regulations,
  //     total: totalRegulations,
  //   };
  // } catch (error) {
  //   throw new Error("Error fetching regulations: " + error.message);
  // }

  try {
    const query = { status: true };
    const skip = (page - 1) * limit;
    const regulations = await Regulations.find(query)
      .skip(skip)
      .limit(limit)
      .lean();

    const totalRegulations = await Regulations.countDocuments(query);
    const totalPages = await Math.ceil(totalRegulations / limit);

    return {
      totalRegulations,
      totalPages,
      currentPage: page,
      limit,
      regulations,
    };
  } catch (error) {
    throw new Error("Error fetching regulations: " + error.message);
  }
};

//--------------------------------Thêm quy định mới--------------------------------
const createRegulation = async (data) => {
  try {
    const regulation = new Regulations(data);
    return await regulation.save();
  } catch (error) {
    throw new Error("Error creating regulation: " + error.message);
  }
};

// Cập nhật quy định theo ID
const updateRegulation = async (id, data) => {
  try {
    const regulation = await Regulations.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!regulation) {
      throw new Error("Regulation not found");
    }

    return regulation;
  } catch (error) {
    throw new Error("Error updating regulation: " + error.message);
  }
};

//--------------------------------Xóa (cập nhật trạng thái) quy định theo ID--------------------------------
const deleteRegulation = async (regulationIds) => {
  try {
    const regulations = await Regulations.updateMany(
      { _id: { $in: regulationIds } },
      { status: false }
    );

    if (regulations.matchedCount === 0) {
      throw new Error("No regulations found or already");
    }

    return regulations;
  } catch (error) {
    throw new Error("Error deleting regulation: " + error.message);
  }
};

export {
  getAllRegulations,
  createRegulation,
  updateRegulation,
  deleteRegulation,
};
