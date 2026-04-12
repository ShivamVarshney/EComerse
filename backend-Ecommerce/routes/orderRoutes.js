import { Router } from "express";

const router = Router();

import {
  authenticate,
  authorizeAdmin,
} from "../middlewares/auth.middleware.js";

import {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calculateTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDeliver,
} from "../controllers/order.controller.js";


// CREATE + GET ALL ORDERS
router
  .route("/")
  .post(authenticate, createOrder)
  .get(authenticate, authorizeAdmin, getAllOrders);


// USER ORDERS
router.route("/mine").get(authenticate, getUserOrders);

// STATS ROUTES
router.route("/total-orders").get(authenticate, authorizeAdmin, countTotalOrders);
router.route("/total-sales").get(authenticate, authorizeAdmin, calculateTotalSales);
router.route("/total-sales-by-date").get(authenticate, authorizeAdmin, calculateTotalSalesByDate);

// SINGLE ORDER
router.route("/:id").get(authenticate, findOrderById);

// PAYMENT
router.route("/:id/pay").put(authenticate, markOrderAsPaid);

// DELIVERY (ADMIN ONLY)
router.route("/:id/deliver").put(authenticate, authorizeAdmin, markOrderAsDeliver);

export default router;