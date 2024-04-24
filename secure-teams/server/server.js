import { Socket, Server } from "socket.io";
import http from "http";
import { app } from "./app.js";
import { config } from "dotenv";
import { Message, Contact } from "./models/messages.js";

import fs from "fs";
import path from "path";

// Create HTTP server
const httpServer = http.createServer(app);

// Create Socket.IO server
const io = new Server(httpServer, {
	cors: {
		origin: process.env.REACT_APP_API_URL,
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	socket.on("login", (data) => {
		const { email, token } = data;
		if (email !== "admin@secureteams.com") {
			console.log("User logged in:", email);
			const logMessage = `>> <span style="color: lime;">${email}</span> - logged in!!!`;
			io.emit("logMessage", logMessage);

			const logDirectory = "log_files";
			const __dirname = path.resolve();
			const filePath = path.join(__dirname, logDirectory, `${email}_log.txt`);
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

	socket.on("logAlert", (data) => {
		const { email, message, type } = data;
		console.log("!!!Log Alert:", email, message, type);
		if (email !== "admin@secureteams.com") {
			const logMessage = `>> <span style="color: lime;">${email}</span> - <span style="color: ${type};">${message}</span>`;
			io.emit("logMessage", logMessage);

			const logDirectory = "log_files";
			const __dirname = path.resolve();
			const filePath = path.join(__dirname, logDirectory, `${email}_log.txt`);

			fs.appendFile(filePath, "!!! " + message + " !!!\n\n", (err) => {
				if (err) {
					console.error("Error writing to log file:", err);
				}
			});

			logAlert(email, message, type);
		}
	});

	socket.on("logout", (data) => {
		const { email } = data;
		if (email !== "admin@secureteams.com") {
			const logMessage = `>> <span style="color: lime;">${email}</span> - logged out!!!`;
			io.emit("logMessage", logMessage);

			const logDirectory = "log_files";
			const __dirname = path.resolve();
			const filePath = path.join(__dirname, logDirectory, `${email}_log.txt`);

			fs.appendFile(filePath, "!!! User logged out !!!\n\n", (err) => {
				if (err) {
					console.error("Error writing to log file:", err);
				}
			});
		}
	});

	socket.on("sendMessage", async (data) => {
		console.log("New message:", data);
		io.emit("newMessage", data);
		try {
			const { sender, receiver, message } = data;
			const newMessage = new Message({ sender, receiver, message });
			await newMessage.save();
		} catch (error) {
			console.error("Error saving message:", error);
		}
	});
	
});

// Start listening on the HTTP server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, "0.0.0.0", () => {
	console.log(`Server is running on port ${PORT}`);
});

const logAlert = async (email, message, type) => {
	let emailSent = false;

	try {
		const user = await User.findOne({ role: "admin" });

		const receiverEmail = user.settings.secondaryEmail;

		if (!receiverEmail) {
			console.log("Secondary email not found");
			return;
		}

		// Email content
		const mailOptions = {
			from: process.env.EMAIL_USERNAME,
			to: receiverEmail,
			subject: "URGENT: Log Alert!!",
			text: `User: ${email} - ${message}`,
		};

		if (emailSent) {
			console.log("Email already sent");
			return;
		}

		emailSent = true;

		transporter.sendMail(mailOptions, async (error, info) => {
			if (error) {
				console.log(error);
				emailSent = false; // Reset the flag if there was an error sending the email
				return;
			}
			console.log("Log Alert sent to", receiverEmail);
		});
	} catch (error) {
		console.log(error);
	}
};
