import express from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { auth } from "../middleware/auth.js"; // Protect routes

const router = express.Router();

/**
 * GET ALL USERS (Admin only)
 * Protecting this route so only logged-in admins can view.
 */
router.get("/users", auth, AuthController.getAllUsers);

// REGISTER (optional)
router.post("/register", AuthController.register);

// LOGIN
router.post("/login", AuthController.login);

export default router;
