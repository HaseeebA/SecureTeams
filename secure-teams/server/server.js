import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		app.listen(process.env.PORT, () => {
			console.log(`listening on port ${process.env.PORT}`);
			console.log("Connected to Database");
		});
	})
	.catch((error) => {
		console.log(error);
	});

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	password: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	profilePhoto: { type: String, required: false },
	role: {
		type: String,
		required: false,
		enum: ["team-member", "team-lead", "manager", "admin", "employee"],
		default: "employee",
	},
	teams: { type: Array },
});

const User = mongoose.model("User", userSchema);

// Middleware to verify token
const authenticateToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (token == null)
		return res.sendStatus(401).json({ message: "Unauthorized" });

	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err)
			return res.sendStatus(403).json({ message: "Invalid or expired token" });
		req.user = user;
		next();
	});
};

// Protected routes
// app.get("/homepage", authenticateToken, (req, res) => {
// 	console.log("Homepage");
// 	res.status(200).json({ message: "Homepage" });
// });

app.post("/api/signup", async (req, res) => {
	const { name, email, password } = req.body;
	try {
		let user = await User.findOne({ email: email });
		if (user) {
			console.log("User already exists");
			return res.status(400).json({ message: "User already exists" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		user = new User({ name, email, password: hashedPassword });
		await user.save();
		res.status(201).json({ message: "User created successfully" });
		console.log("User created successfully");
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error creating user" });
	}
});

app.get("/api/members", async (req, res) => {
	try {
		const users = await User.find().select("name -_id");
		const names = users.map(user => user.name); 
        res.status(200).json(names); 
	} catch (error) {
		return res.status(500).json({ message: 'Error fetching members', error });
	}
});


app.post("/api/login", async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email: email });
		if (!user) {
			console.log("User not found");
			return res.status(400).json({ message: "User not found" });
		}
		const validPassword = await bcrypt.compare(password, user.password);
		if (!validPassword) {
			console.log("Invalid password");
			return res.status(400).json({ message: "Invalid password" });
		}
		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		if (email === "as1472@secureteams.com") {
			console.log("User role", user.role);
			res.status(200).json({ token: token, role: "admin" });
			console.log("User is admin");
		} else {
			console.log("User role", user.role);
			res.status(200).json({ token: token, role: user.role });
		}

		console.log("Login successful");
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error logging in" });
	}
});

app.get("/api/users", async (req, res) => {
	try {
		const users = await User.find();
		res.status(200).json(users);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Error fetching users" });
	}
});

app.get("/api/newUsers", async (req, res) => {
	try {
		const users = await User.find({ role: "employee" });
		res.status(200).json(users);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Error fetching users" });
	}
});

app.put("/api/users/:id", async (req, res) => {
	const { role, email } = req.body;
	try {
		const user = await User.findOne({ email: email });
		if (!user) {
			console.log("User not found");
			return res.status(400).json({ message: "User not found" });
		}
		if (role === "Team Member") {
			user.role = "team-member";
		}
		if (role === "Team Lead") {
			user.role = "team-lead";
		}
		if (role === "Manager") {
			user.role = "manager";
		}
		if (role === "Admin") {
			return res.status(400).json({ message: "Cannot assign admin role" });
		}
		await user.save();
		console.log("Role updated successfully");
		res.status(200).json({ message: "Role updated successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error updating role" });
	}
});

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
	const { email, password, newPassword, name } = req.body;
	try {
		const user = await User.findOne({ email: email });
		if (!user) {
			console.log("User not found");
			return res.status(400).json({ message: "User not found" });
		}
		const validPassword = await bcrypt.compare(password, user.password);
		if (!validPassword) {
			console.log("Invalid password");
			return res.status(400).json({ message: "Invalid password" });
		}
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(newPassword, salt);
		user.password = hashedPassword;
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

app.get("/api/profile", async (req, res) => {
	const email = req.query.email;
	try {
		const user = await User.findOne({ email: email });
		if (!user) {
			console.log("User not found");
			return res.status(404).json({ message: "User not found" });
		}
		// console.log("Profile:", user);
		res.status(200).json(user);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Error fetching profile" });
	}
});

app.get("/uploads/:profilePhoto", (req, res) => {
	const profilePhoto = req.params.profilePhoto;
	// console.log("Profile photo:", profilePhoto);
	res.sendFile(profilePhoto, { root: "uploads" });
});

