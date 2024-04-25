import express from "express";
const router = express.Router();
import * as messageController from "../controllers/messageController.js";

router.get("/messages", messageController.getMessages);
router.post("/messages", messageController.sendMessage);
router.post("/contacts", messageController.saveContact);
router.get("/contacts", messageController.getContacts);

export default router;
