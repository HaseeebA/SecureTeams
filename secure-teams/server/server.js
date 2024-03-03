import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import nodemailer from "nodemailer";

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
	settings: {
		is2FAEnabled: { type: Boolean, required: false, default: false },
		secondaryEmail: { type: String, required: false },
		twoFactorAuthCode: { type: String, required: false },
	},
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
		const names = users.map((user) => user.name);
		res.status(200).json(names);
	} catch (error) {
		return res.status(500).json({ message: "Error fetching members", error });
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

app.post("/api/settings", async (req, res) => {
	const { is2FAEnabled, secondaryEmail, userEmail } = req.body;
	try {
		const user = await User.findOne({ email: userEmail });
		if (!user) {
			console.log("User not found");
			return res.status(400).json({ message: "User not found" });
		}
		user.settings.is2FAEnabled = is2FAEnabled;
		user.settings.secondaryEmail = secondaryEmail;
		await user.save();
		console.log("Settings updated successfully");
		res.status(200).json({ message: "Settings updated successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error updating settings" });
	}
});

app.get("/api/2faEnabled", async (req, res) => {
	const email = req.query.email;
	try {
		const user = await User.findOne({ email: email });
		if (!user) {
			console.log("User not found");
			return res.status(400).json({ message: "User not found" });
		}
		const is2FAEnabled = user.settings.is2FAEnabled;
		console.log("2FA enabled:", is2FAEnabled);
		res.status(200).json({ enabled: is2FAEnabled });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error fetching 2FA status" });
	}
});

// Nodemailer configuration
const transporter = nodemailer.createTransport({
	service: "Outlook",
	auth: {
		user: process.env.EMAIL_USERNAME,
		pass: process.env.EMAIL_PASSWORD,
	},
});

app.post("/api/2faSend", async (req, res) => {
	let emailSent = false;
	const { email } = req.body;
	try {
		const user = await User.findOne({ email: email });

		if (!user) {
			console.log("User not found");
			return res.status(400).json({ message: "User not found" });
		}

		const receiverEmail = user.settings.secondaryEmail;

		if (!receiverEmail) {
			console.log("Secondary email not found");
			return res.status(400).json({ message: "Secondary email not found" });
		}

		// Generate a random 6-digit code for 2FA
		const code = Math.floor(100000 + Math.random() * 900000);

		// Email content
		const mailOptions = {
			from: process.env.EMAIL_USERNAME,
			to: receiverEmail,
			subject: "Your 2FA Code",
			text: `Your 2FA verification code is: ${code}`,
		};

		if (emailSent) {
			console.log("Email already sent");
			return res.status(400).json({ message: "Email already sent" });
		}

		emailSent = true;

		// Send email with 2FA code
		transporter.sendMail(mailOptions, async (error, info) => {
			if (error) {
				console.log(error);
				emailSent = false; // Reset the flag if there was an error sending the email
				return res.status(500).json({ message: "Error sending 2FA token" });
			}
			console.log("2FA token sent to", receiverEmail);

			// Store the 2FA code in the user document after email sent successfully
			user.settings.twoFactorAuthCode = code;
			console.log("2FA code:", code);
			await user.save();
			console.log("2FA code stored in user document");

			res.status(200).json({ message: "2FA token sent and code saved" });
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error sending 2FA token" });
	}
});

app.post("/api/2faVerify", async (req, res) => {
	const { email, twofaToken } = req.body;
	try {
		const user = await User.findOne({ email: email });

		if (!user) {
			console.log("User not found");
			return res.status(400).json({ message: "User not found" });
		}

		const storedCode = user.settings.twoFactorAuthCode; // Assuming the code is stored in the user document
		console.log("Stored 2FA code:", storedCode);
		console.log("Received 2FA code:", twofaToken);

		if (twofaToken === storedCode) {
			console.log("2FA code verified successfully");
			return res.status(200).json({ verified: true });
		} else {
			console.log("Invalid 2FA code");
			return res.status(400).json({ message: "Invalid 2FA code" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error verifying 2FA code" });
	}
});
