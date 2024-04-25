import express from "express";
const router = express.Router();
import * as eventController from "../controllers/eventController.js";

router.get("/events", eventController.fetchEvents);
router.post("/add-event", eventController.addEvent);
router.delete("/delete-event/:email/:eventId", eventController.deleteEvent);

export default router;
