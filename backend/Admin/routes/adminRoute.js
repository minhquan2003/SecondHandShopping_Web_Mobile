// routes.js
import express from "express";
import {
  loginAdmin,
  logoutAdmin,
} from "../controllers/auth/adminAuthController.js";
import {
  getAllUsers,
  getUsersWithPartnerRole,
  getAllBannedUsers,
  deleteUserAccount,
  banUserAccount,
  unbanUserAccount,
  searchUsersByKeyword,
  getUsersWithRequestPartner,
  switchPartnerToUser,
  switchToPartner,
  switchToUser,
} from "../controllers/user/adminUserController.js";

import {
  approveProducts,
  getAllProducts,
  hideProducts,
  removeProducts,
  getPendingProducts,
} from "../controllers/product/adminProductController.js";

import { getFeedbacks } from "../controllers/feedback/adminFeedbackController.js";

import {
  getCategories,
  createCategory,
  editCategory,
  removeCategory,
} from "../controllers/category/adminCategoryController.js";

import {
  fetchAllNotifications,
  postNotification,
  removeNotification,
} from "../controllers/notification/adminNotificationController.js";

import {
  getRegulations,
  addRegulation,
  editRegulation,
  removeRegulation,
} from "../controllers/regulation/adminRegulationController.js";

import {
  getUserStatistics,
  getStatisticsByYear,
} from "../controllers/chart/adminChartController.js";

import {
  fetchTopSellingProducts,
  fetchOrderStats,
  fetchAllOrders,
} from "../controllers/order/adminOrderController.js";
import { authenticateJWT } from "../middlewares/middleware.js";

import {
  fetchAllReviews,
  removeReview,
} from "../controllers/reviews/adminReviewController.js";

const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin);
adminRouter.post("/logout", authenticateJWT, logoutAdmin);

adminRouter.get("/all-users", getAllUsers);
adminRouter.get("/all-partners", getUsersWithPartnerRole);
adminRouter.get("/all-requestpartners", getUsersWithRequestPartner);
adminRouter.get("/all-banner", getAllBannedUsers);
adminRouter.put("/ban-user", banUserAccount);
adminRouter.put("/unban-user", unbanUserAccount);
adminRouter.delete("/delete-account", deleteUserAccount);
adminRouter.get("/search", searchUsersByKeyword);
adminRouter.put("/approve-partner", switchToPartner);
adminRouter.put("/delete-role-partner", switchPartnerToUser);
adminRouter.put("/switch-to-user", switchToUser);

adminRouter.put("/approve-products", approveProducts);
adminRouter.get("/products", getAllProducts);
adminRouter.put("/hide-products", hideProducts);
adminRouter.get("/pending-products", getPendingProducts);
adminRouter.delete("/delete-products", removeProducts);

adminRouter.get("/all-feedback", getFeedbacks);

adminRouter.get("/categories", getCategories);
adminRouter.post("/category/", createCategory);
adminRouter.put("/category/:id", editCategory);
adminRouter.delete("/category", removeCategory);

adminRouter.get("/notifications/", fetchAllNotifications);
adminRouter.post("/notifications/", postNotification);
adminRouter.delete("/notifications", removeNotification);

adminRouter.get("/regulations/", getRegulations);
adminRouter.post("/regulation/", addRegulation);
adminRouter.put("/regulation/:id", editRegulation);
adminRouter.delete("/regulation", removeRegulation);

adminRouter.get("/statistics/yearly-users", getUserStatistics);
adminRouter.get("/statistics", getStatisticsByYear);

adminRouter.get("/top-selling-products", fetchTopSellingProducts);
adminRouter.get("/order-stats", fetchOrderStats);
adminRouter.get("/orders", fetchAllOrders);

adminRouter.get("/reviews", fetchAllReviews);
adminRouter.delete("/reviews", removeReview);

export default adminRouter;
