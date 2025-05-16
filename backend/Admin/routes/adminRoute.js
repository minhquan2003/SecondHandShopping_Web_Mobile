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

import {
  getFeedbacks,
  sendFeedbackReply,
} from "../controllers/feedback/adminFeedbackController.js";

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
  getOrderStatisticsByYear,
  getOrderStatusChart,
  getRatingPieChart,
  getTopUserPostProduct,
  getTopBuyer,
} from "../controllers/chart/adminChartController.js";

import {
  fetchTopSellingProducts,
  fetchOrderStats,
  fetchAllOrders,
} from "../controllers/order/adminOrderController.js";
import { authorize } from "../middlewares/authorize.js";
import { validateLoginUser } from "../middlewares/checkAuth.js";

import {
  fetchAllReviews,
  removeReview,
} from "../controllers/reviews/adminReviewController.js";

const adminRouter = express.Router();

adminRouter.post("/login", validateLoginUser, loginAdmin);
adminRouter.post("/logout", logoutAdmin);

adminRouter.get("/all-users", authorize, getAllUsers);
adminRouter.get("/all-partners", authorize, getUsersWithPartnerRole);
adminRouter.get("/all-requestpartners", authorize, getUsersWithRequestPartner);
adminRouter.get("/all-banner", authorize, getAllBannedUsers);
adminRouter.put("/ban-user", authorize, banUserAccount);
adminRouter.put("/unban-user", authorize, unbanUserAccount);
adminRouter.delete("/delete-account", authorize, deleteUserAccount);
adminRouter.get("/search", authorize, searchUsersByKeyword);
adminRouter.put("/approve-partner", authorize, switchToPartner);
adminRouter.put("/delete-role-partner", authorize, switchPartnerToUser);
adminRouter.put("/switch-to-user", authorize, switchToUser);

adminRouter.put("/approve-products", authorize, approveProducts);
adminRouter.get("/products", authorize, getAllProducts);
adminRouter.put("/hide-products", authorize, hideProducts);
adminRouter.get("/pending-products", authorize, getPendingProducts);
adminRouter.delete("/delete-products", authorize, removeProducts);

adminRouter.get("/all-feedback", authorize, getFeedbacks);
adminRouter.post("/reply", authorize, sendFeedbackReply);

adminRouter.get("/categories", authorize, getCategories);
adminRouter.post("/category/", authorize, createCategory);
adminRouter.put("/category/:id", authorize, editCategory);
adminRouter.delete("/category", authorize, removeCategory);

adminRouter.get("/notifications/", authorize, fetchAllNotifications);
adminRouter.post("/notifications/", authorize, postNotification);
adminRouter.delete("/notifications", authorize, removeNotification);

adminRouter.get("/regulations/", authorize, getRegulations);
adminRouter.post("/regulation/", authorize, addRegulation);
adminRouter.put("/regulation/:id", authorize, editRegulation);
adminRouter.delete("/regulation", authorize, removeRegulation);

adminRouter.get("/statistics/yearly-users", authorize, getUserStatistics);
adminRouter.get(
  "/statistics-order-product",
  authorize,
  getOrderStatisticsByYear
);
adminRouter.get("/orders/status-chart", authorize, getOrderStatusChart);
adminRouter.get("/rating-distribution", authorize, getRatingPieChart);
adminRouter.get("/top-user-order", authorize, getTopBuyer);
adminRouter.get("/top-user-product-post", authorize, getTopUserPostProduct);

adminRouter.get("/top-selling-products", authorize, fetchTopSellingProducts);
adminRouter.get("/order-stats", authorize, fetchOrderStats);
adminRouter.get("/orders", authorize, fetchAllOrders);

adminRouter.get("/reviews", authorize, fetchAllReviews);
adminRouter.delete("/reviews", authorize, removeReview);

export default adminRouter;
