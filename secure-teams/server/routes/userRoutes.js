import express from "express";
const router = express.Router();
import * as userController from "../controllers/userController.js";

router.get("/users", userController.getUsers);
router.get("/newUsers", userController.getNewUsers);
router.put("/users/:id", userController.putUser);

export default router;