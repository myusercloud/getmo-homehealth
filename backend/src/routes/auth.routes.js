import express from "express";
import { AuthController } from "../controllers/auth.controller.js";

const router = express.Router();

// REGISTER (optional)
router.post("/register", AuthController.register);

// LOGIN
router.post("/login", AuthController.login);

export default router;
