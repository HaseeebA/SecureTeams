import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import multer from "multer";
import User from "./models/user.js";
import { Task, Team } from "./models/tasks.js";
import logtoFile from "./middleware/logger.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import path from "path";

export const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((err) => {
		console.log("Error connecting to MongoDB", err);
	});

app.use("/api/auth", authRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/user", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/message", messageRoutes);

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/");
	},
	filename: function (req, file, cb) {
		const userEmail = req.body.email;
		const uniqueFileName = `${userEmail}-${file.originalname}`;
		cb(null, uniqueFileName);
	},
});

const upload = multer({ storage: storage });

app.post("/api/update", upload.single("profilePhoto"), async (req, res) => {
	const { email, name } = req.body;

	logtoFile(req.method, req.url, email);

	try {
		const user = await User.findOne({ email: email });
		if (!user) {
			console.log("User not found");
			return res.status(400).json({ message: "User not found" });
		}
		user.name = name;

		if (req.file) {
			user.profilePhoto = req.file.filename;
		}
		await user.save();
		console.log("Profile updated successfully");
		res.status(200).json({ message: "Profile updated successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error updating profile" });
	}
});

app.post("/api/tasks", async (req, res) => {
	const { userId, title, description } = req.body;
	console.log("Received request to create task with title:", title);
	console.log("User ID:", userId);
	try {
		const newTask = new Task({ userId, title, description });
		console.log("Creating new task:", newTask);
		await newTask.save();
		console.log("Task created successfully:", newTask);
		res
			.status(201)
			.json({ message: "Task created successfully", task: newTask });
	} catch (error) {
		console.log("Error creating task:", error);
		res.status(500).json({ message: "Error creating task" });
	}
});

app.get("/api/tasks", async (req, res) => {
	const userEmail = req.query.userId;
	try {
		const tasks = await Task.find({ userId: userEmail });
		res.status(200).json(tasks);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error fetching tasks" });
	}
});

app.get("/api/members", async (req, res) => {
	try {
		const users = await User.find().select("email");
		res.status(200).json(users);
	} catch (error) {
		console.log("ok");
		return res.status(500).json({ message: "Error fetching members", error });
	}
});

app.post("/api/createTeams", async (req, res) => {
	const { teamName, memberEmails } = req.body;
	try {
		// Create a new team
		const team = new Team({
			name: teamName,
			members: memberEmails,
		});

		await team.save();

		res.status(201).json({ message: "Team created successfully" });
	} catch (error) {
		console.log("kajshd");
		return res.status(500).json({ message: "Error creating team", error });
	}
});

app.get("/api/userDetails", async (req, res) => {
	try {
		// Fetch user details from the database
		const userDetails = await User.find({}, { name: 1, email: 1 }); // Projection to select only name and email fields
		res.status(200).json(userDetails);
	} catch (error) {
		console.log("Error fetching user details:", error);
		res.status(500).json({ message: "Error fetching user details" });
	}
});

app.get("/api/membersInTeam", async (req, res) => {
	const { teamName } = req.query;
	try {
		const team = await Team.findOne({
			name: teamName,
		});
		if (!team) {
			return res.status(404).json({ message: "Team not found" });
		}
		const members = await User.find({ email: { $in: team.members } });
		res.status(200).json(members);
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Error fetching members in team", error });
	}
});

app.get("/api/teamNames", async (req, res) => {
	try {
		// Fetch user details from the database
		const teams = await Team.find({}, { name: 1 }); // Projection to select only name and email fields
		res.status(200).json(teams);
	} catch (error) {
		console.log("Error fetching user details:", error);
		res.status(500).json({ message: "Error fetching user details" });
	}
});

app.get("/api/teams", async (req, res) => {
	const { email } = req.query;
	try {
		console.log(email);
		const teams = await Team.find({ members: { $in: [email] } });
		console.log(teams);
		res.status(200).json(teams);
	} catch (error) {
		return res.status(500).json({ message: "Error fetching teams", error });
	}
});

const __dirname = path.resolve(
	path.dirname(new URL(import.meta.url).pathname),
	".."
);

app.use(express.static(path.join(__dirname, "client", "build")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
