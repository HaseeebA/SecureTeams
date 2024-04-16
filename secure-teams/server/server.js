import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createServer } from "http";
import { Server } from "socket.io";
import multer from "multer";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
// import loggingMiddleware from "./loggingMiddleware.js";
import logtoFile from "./loggingMiddleware.js";
// import io from "socket.io-client";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
// app.use(loggingMiddleware);

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		console.log("Connected to MongoDB");

		// Create HTTP server
		const httpServer = createServer(app);

		// Create Socket.IO server
		const io = new Server(httpServer, {
			cors: {
				origin: process.env.REACT_APP_API_URL,
				methods: ["GET", "POST"],
			},
		});

		// io.emit("logMessage", "Server started");

		// Listen for Socket.IO connections
		io.on("connection", (socket) => {
			// console.log("A user connected with ID:", socket.id);

			socket.on("login", (data) => {
				// console.log("User logged in:", data);
				const { email, token } = data;
				if (email !== "admin@secureteams.com") {
					console.log("User logged in:", email);
					const logMessage = `>> <span style="color: lime;">${email}</span> - logged in!!!`;
					io.emit("logMessage", logMessage);

					const logDirectory = "log_files";
					const __dirname = path.resolve();
					const filePath = path.join(
						__dirname,
						logDirectory,
						`${email}_log.txt`
					);
					fs.appendFile(
						filePath,
						"\n!!! User logged in with token: " + token + " !!!\n",
						(err) => {
							if (err) {
								console.error("Error writing to log file:", err);
							}
						}
					);
				}
			});

			socket.on("logActivity", (data) => {
				const { method, path, email } = data;
				if (email !== "admin@secureteams.com") {
					const logMessage = `>> <span style="color: lime;">${email}</span> - <span style="color: red;">${method}</span> ${path}`;
					io.emit("logMessage", logMessage);
				}
			});

			socket.on("logout", (data) => {
				const { email } = data;
				if (email !== "admin@secureteams.com") {
					const logMessage = `>> <span style="color: lime;">${email}</span> - logged out!!!`;
					io.emit("logMessage", logMessage);

					const logDirectory = "log_files";
					const __dirname = path.resolve();
					const filePath = path.join(
						__dirname,
						logDirectory,
						`${email}_log.txt`
					);

					fs.appendFile(filePath, "!!! User logged out !!!\n\n", (err) => {
						if (err) {
							console.error("Error writing to log file:", err);
						}
					});
				}
			});

			// // Example: Handle socket events
			// socket.on("disconnect", () => {
			// 	console.log("User disconnected");
			// });
		});

		// Start listening on the HTTP server
		const PORT = process.env.PORT || 3000;
		httpServer.listen(PORT, "0.0.0.0", () => {
			console.log(`Server is running on port ${PORT}`);
			//   local ip address
		});
	})
	.catch((error) => {
		console.error("Error connecting to MongoDB:", error);
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
	wrongLoginAttempts: { type: Number, default: 0 },
    isLocked: { type: Boolean, default: false },
    lockUntil: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

const messagesSchema = new mongoose.Schema({
	sender: { type: String, required: true },
	receiver: { type: String, required: true },
	message: { type: String, required: true },
	timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messagesSchema);

const contactsSchema = new mongoose.Schema({
	email: { type: String, required: true },
	contacts: { type: Array, required: true },
});

const Contact = mongoose.model("Contact", contactsSchema);

app.post("/api/log", async (req, res) => {
	const { email, route } = req.body;
	// console.log("User: " + email + " visited route: " + route);
	if (email !== "admin@secureteams.com") {
		try {
			const logDirectory = "log_files";
			const __dirname = path.resolve();
			const filePath = path.join(__dirname, logDirectory, `${email}_log.txt`);

			fs.appendFile(filePath, "User visited route: " + route + "\n", (err) => {
				if (err) {
					console.error("Error writing to log file:", err);
				}
			});
			res.status(200).json({ message: "Logged successfully" });
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: "Error logging activity" });
		}
	}
});

app.post("/api/messages", async (req, res) => {
	const { sender, receiver, message } = req.body;

	logtoFile(req.method, req.url, sender);

	try {
		const newMessage = new Message({ sender, receiver, message });
		await newMessage.save();
		io.emit("message", newMessage);
		res.status(201).json({ message: "Message sent successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error sending message" });
	}
});

app.get("/api/messages", async (req, res) => {
	const { sender, receiver } = req.query;
	try {
		// Find messages based on sender and receiver
		const messages = await Message.find({ sender: sender, receiver: receiver });
		res.status(200).json(messages);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error fetching messages" });
	}
});

app.post("/api/contacts", async (req, res) => {
	const { email, contact } = req.body;

	logtoFile(req.method, req.url, email);

	try {
		// Check if the contact email exists in the system
		const userExists = await User.findOne({ email: contact });
		if (!userExists) {
			return res.status(400).json({ message: "User does not exist" });
		}

		// Find the existing contacts for the current user
		let existingContactsCurrentUser = await Contact.findOne({ email });
		if (!existingContactsCurrentUser) {
			// If no existing contacts for current user, create a new entry
			existingContactsCurrentUser = new Contact({ email, contacts: [contact] });
		} else {
			if (existingContactsCurrentUser.contacts.includes(contact)) {
				return res.status(400).json({ message: "Contact already exists" });
			}
			// If existing contacts found, append the new contact
			existingContactsCurrentUser.contacts.push(contact);
		}

		// Save the current user's updated contacts
		await existingContactsCurrentUser.save();

		// Add the current user to the contact's list as well
		let existingContactsContact = await Contact.findOne({ email: contact });
		if (!existingContactsContact) {
			// If no existing contacts for the contact, create a new entry
			existingContactsContact = new Contact({
				email: contact,
				contacts: [email],
			});
		} else {
			// If existing contacts found for contact, append the current user
			existingContactsContact.contacts.push(email);
		}

		// Save the contact's updated contacts
		await existingContactsContact.save();

		res.status(201).json({
			message: "Contact added successfully",
			existingContactsCurrentUser,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error adding contact" });
	}
});

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

	// logtoFile(req.method, req.url, email, io);
	// socket.emit("log", { method: req.method, url: req.url, email: email });

	try {
		const user = await User.findOne({ email: email });
		if (!user) {
			console.log("User not found");
			res.status(400).json({ message: "User not found" });
			return;
		}
		if (user.isLocked && user.lockUntil > Date.now()) {
            console.log("Account locked");
            res.status(400).json({ message: "Account locked. Try again later." });
            return;
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            // Increment wrong login attempts
            user.wrongLoginAttempts += 1;
            await user.save();

            // Lock the account if attempts reach 3
            if (user.wrongLoginAttempts >= 3) {
                user.isLocked = true;
                // Set lock duration to 30 minutes from now
                user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
                await user.save();
            }

            console.log("Invalid password");
            res.status(400).json({ message: "Invalid password" });
            return;
        }

        user.wrongLoginAttempts = 0;
        await user.save();
		const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		console.log("User role", user.role);
		res.status(200).json({ token: token, role: user.role });

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

	logtoFile(req.method, req.url, email);

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
	const { email, name } = req.body;

	logtoFile(req.method, req.url, email);

	// console.log("Request body:", req.body);
	try {
		const user = await User.findOne({ email: email });
		if (!user) {
			console.log("User not found");
			return res.status(400).json({ message: "User not found" });
		}
		// const validPassword = await bcrypt.compare(password, user.password);
		// if (!validPassword) {
		// 	console.log("Invalid password");
		// 	return res.status(400).json({ message: "Invalid password" });
		// }
		// const salt = await bcrypt.genSalt(10);
		// const hashedPassword = await bcrypt.hash(newPassword, salt);
		// user.password = hashedPassword;
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

app.post("/api/updatePassword", async (req, res) => {
	const { userEmail, password, newPassword } = req.body;

	logtoFile(req.method, req.url, userEmail);

	try {
		const user = await User.findOne({ email: userEmail });
		if (!user) {
			console.log("User not found");
			return res.status(200).json({ message: "User not found" });
		}
		const validPassword = await bcrypt.compare(password, user.password);
		if (!validPassword) {
			console.log("Invalid password");
			return res
				.status(200)
				.json({ message: "Invalid password, please try again" });
		}
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(newPassword, salt);
		user.password = hashedPassword;
		await user.save();
		console.log("Password updated successfully");
		res.status(200).json({ message: "Password updated successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error updating password" });
	}
});

app.get("/api/profile", async (req, res) => {
	const email = req.query.email;

	// logtoFile(req.method, req.url, email);

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

app.get("/api/uploads/:profilePhoto", (req, res) => {
	const profilePhoto = req.params.profilePhoto;
	// console.log("Profile photo:", profilePhoto);
	res.sendFile(profilePhoto, { root: "uploads" });
});

app.post("/api/settings", async (req, res) => {
	const { is2FAEnabled, secondaryEmail, userEmail } = req.body;

	logtoFile(req.method, req.url, userEmail);

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

	// logtoFile(req.method, req.url, email);

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

	logtoFile(req.method, req.url, email);

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

	logtoFile(req.method, req.url, email);

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

app.get("/api/contacts", async (req, res) => {
	const { email } = req.query; // Access email from query parameters

	logtoFile(req.method, req.url, email);

	try {
		console.log("Email:", email);
		const contacts = await Contact.findOne({ email });
		if (!contacts) {
			return res.status(404).json({ message: "Contacts not found" });
		}
		res.status(200).json(contacts.contacts);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error fetching contacts" });
	}
});

const eventsSchema = new mongoose.Schema({
	userEmail: { type: String, required: true },
	events: [
		{
			id: { type: Number, required: true },
			date: { type: Date, required: true },
			title: { type: String, required: true },
		},
	],
});

const Events = mongoose.model("Events", eventsSchema);

//api call to fetch all the events marked by the user in the calendar
app.get("/api/events", async (req, res) => {
	const { email } = req.query;

	logtoFile(req.method, req.url, email);

	try {
		let eventsData = await Events.findOne({ userEmail: email });
		if (!eventsData) {
			// Create a new entry with userEmail and empty events array
			eventsData = new Events({ userEmail: email, events: [] });
			await eventsData.save();
		} else {
			// Filter events array to remove events with dates smaller than the current date
			eventsData.events = eventsData.events.filter(
				(event) => new Date(event.date) >= new Date()
			);
			await eventsData.save();
		}

		res.status(200).json(eventsData.events);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error fetching and updating events" });
	}
});

//api call to add new event to calendar
app.post("/api/add-event", async (req, res) => {
	const { email, title, date } = req.body;

	logtoFile(req.method, req.url, email);

	try {
		let eventsData = await Events.findOne({ userEmail: email });
		if (!eventsData) {
			// Create a new entry with userEmail and empty events array
			eventsData = new Events({ userEmail: email, events: [] });
		}

		const newEvent = {
			id: eventsData.events.length + 1,
			date: date,
			title: title,
		};

		eventsData.events.push(newEvent);
		await eventsData.save();

		res.status(201).json({ message: "Event added successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error adding event" });
	}
});

//api call to delete an event from the calender
app.delete("/api/delete-event/:email/:eventId", async (req, res) => {
	const { email, eventId } = req.params;

	logtoFile(req.method, req.url, email);

	try {
		// Logic to delete the event based on email and eventId
		let eventsData = await Events.findOne({ userEmail: email });
		if (!eventsData) {
			return res.status(404).json({ message: "Events data not found" });
		}

		// Find the index of the event to delete
		const eventIndex = eventsData.events.findIndex(
			(event) => event.id === parseInt(eventId)
		);
		if (eventIndex === -1) {
			return res.status(404).json({ message: "Event not found" });
		}

		// Remove the event from the events array
		eventsData.events.splice(eventIndex, 1);
		await eventsData.save();

		res.status(200).json({ message: "Event deleted successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error deleting event" });
	}
});

const __dirname = path.resolve(
	path.dirname(new URL(import.meta.url).pathname),
	".."
);

// Serve static files from the React app's build directory
app.use(express.static(path.join(__dirname, "client", "build")));

// mountRoutes(app);
// Serve the React app for any other routes
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
