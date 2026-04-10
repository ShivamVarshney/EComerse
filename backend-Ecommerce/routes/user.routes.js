import { Router } from "express";
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
} from "../controllers/user.controller.js";

import {
  authenticate,
  authorizeAdmin,
} from "../middlewares/auth.middleware.js";

const router = Router();
router
  .route("/")
  .post(createUser)
  .get(authenticate, authorizeAdmin, getAllUsers);

router.post("/auth", loginUser);

router.post("/logout", logoutCurrentUser);

router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile);

// ADMIN ROUTES
router
  .route("/:id")
  .delete(authenticate, authorizeAdmin,deleteUserById)
  .get(authenticate, authorizeAdmin, getUserById)
  .put(authenticate,authorizeAdmin,updateUserById)

export default router;
