import express from "express";
const router = express.Router();
import * as authController from "../controllers/authController.js";

router.post("/signup", authController.signupUser);
router.post("/login", authController.loginUser);
router.get("/2faEnabled", authController.is2FAEnabled);
router.post("/2faSend", authController.send2FACode);
router.post("/2faVerify", authController.verify2FACode);
router.post("/settings", authController.saveSettings);
router.post("/updatePassword", authController.updatePassword);
router.post("/log", authController.logActivity);

export default router;
