import express from "express";
const router = express.Router();
import * as profileController from "../controllers/profileController.js";

router.get("/getprofile", profileController.fetchProfile);
router.get("/uploads/:profilePhoto", profileController.getProfilePhoto);

export default router;
