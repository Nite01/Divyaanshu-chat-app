import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Signup for new user
router.post("/signup", signup);

// Login for existing user
router.post("/login", login);

// Logout user
router.post("/logout", logout);

// Update User profile
router.put("/update-profile",protectRoute,updateProfile);

// Endpoint for authentication (GET)    Check whether authenticated or not on basis of that show login or signup pages
router.get("/check", protectRoute, checkAuth)

export default router;
