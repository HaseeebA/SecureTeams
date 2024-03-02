import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
	role: {
		type: String,
		required: false,
		enum: ["team-member", "team-lead", "manager", "admin", "employee"],
		default: "employee",
	},
	teams: { type: Array },
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
app.post("/api/messages", async (req, res) => {
	const { sender, receiver, message } = req.body;
	try {
		const newMessage = new Message({ sender, receiver, message });
		await newMessage.save();
		res.status(201).json({ message: "Message sent successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error sending message" });
	}
});

app.get("/api/messages", async (req, res) => {
	try {
		const messages = await Message.find();
		res.status(200).json(messages);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error fetching messages" });
	}
});

app.post("/api/contacts", async (req, res) => {
	const { email, contact } = req.body;
	try {
		// Find the existing contacts for the user
		const userExists = await User.findOne({ email: contact });
		if (!userExists) {
			return res.status(400).json({ message: "User does not exist" });
		}
		console.log("email:", email);
		let existingContacts = await Contact.findOne({ email });
		if (!existingContacts) {
			// If no existing contacts, create a new entry
			existingContacts = new Contact({ email, contacts: [contact] });
		} else {
			if (existingContacts.contacts.includes(contact)) {
				return res.status(400).json({ message: "Contact already exists" });
			}
			else {
				// If existing contacts found, append the new contact
				existingContacts.contacts.push(contact);
			}
		}
		await existingContacts.save();

		res.status(201).json({ message: "Contact added successfully", existingContacts });
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

		if (email === "as1725@secureteams.com") {
			console.log("User role", user.role);
			res.status(200).json({ token: token, role: "admin" });
			console.log("User is admin");
		} else {
			console.log("User role", user.role);
			res.status(200).json({ token: token, role: user.role });
		}

		// res.status(200).json({ token: token });
		console.log("Login successful");
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error logging in" });
	}
});

app.get("/api/users", async (req, res) => {
	try {
		const users = await User.find();
		// console.log("Users:", users);
		res.status(200).json(users);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Error fetching users" });
	}
});

app.get("/api/newUsers", async (req, res) => {
	try {
		const users = await User.find({ role: "employee" });
		// console.log("Users:", users);
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
app.post("/api/update", async (req, res) => {
	// const userId = req.user._id;
	const { email, password } = req.body;
	// console.log("User ID:", userId);
	try {
		let user = await User.findOne({ email });

		// if (email) {
		// 	const emailExists = await User.findOne({ email: email });
		// 	if (emailExists) {
		// 		return res.status(400).json({ message: "Email already in use" });
		// 	}
		// 	user.email = email;
		// }
		if (password) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			user.password = hashedPassword;
		}
		await user.save();
		return res.status(200).json({ message: "Account updated successfully" }); // Use 'return' here

	} catch (error) {
		console.error("Error updating account:", error);
		return res.status(500).json({ message: "Error updating account" }); // Use 'return' here
	}
});

app.get("/api/contacts", async (req, res) => {
    const { email } = req.query; // Access email from query parameters
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

