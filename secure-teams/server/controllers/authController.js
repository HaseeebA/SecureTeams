import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { transporter } from "../middleware/mailer.js";
import logtoFile from "../middleware/logger.js";
import fs from "fs";
import path from "path";

export const loginUser = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email: email });
		if (!user) {
			console.log("User not found");
			res.status(400).json({ message: "User not found" });
			return;
		}
		if (user.lockUntil > Date.now()) {
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
				// Set lock duration to 30 minutes from now
				user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
				// user.wrongLoginAttempts = 0;
				await user.save();
			}

			console.log("Invalid password");
			res.status(400).json({
				message: "Invalid password",
				attempts: user.wrongLoginAttempts,
			});
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
};

export const signupUser = async (req, res) => {
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
};

export const is2FAEnabled = async (req, res) => {
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
};

export const send2FACode = async (req, res) => {
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
};

export const verify2FACode = async (req, res) => {
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
};

export const saveSettings = async (req, res) => {
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
};

export const updatePassword = async (req, res) => {
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
			// Increment wrong update password attempts
			user.wrongLoginAttempts += 1;
			await user.save();

			// Lock the account if attempts reach 3
			if (user.wrongLoginAttempts >= 3) {
				user.wrongLoginAttempts = 0;
				await user.save();
				return res.status(400).json({ message: "Logging Out" });
			}

			// Determine the remaining attempts
			const remainingAttempts = 3 - user.wrongLoginAttempts;

			console.log("Invalid password");
			return res.status(200).json({
				message: `Invalid password. Logout after ${remainingAttempts} attempts`,
			});
		}

		// Reset wrong update password attempts on successful update
		user.wrongLoginAttempts = 0;
		await user.save();
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
};

export const logActivity = async (req, res) => {
	const { email, route } = req.body;
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
};
