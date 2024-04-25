import { Message, Contact } from "../models/messages.js";
import logtoFile from "../middleware/logger.js";
import User from "../models/user.js";

export const getMessages = async (req, res) => {
	const { sender, receiver } = req.query;
	try {
		const messages = await Message.find({ sender: sender, receiver: receiver });
		res.status(200).json(messages);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error fetching messages" });
	}
};

export const sendMessage = async (req, res) => {
	const { sender, receiver, message } = req.body;

	logtoFile(req.method, req.url, sender);

	try {
		const newMessage = new Message({ sender, receiver, message });
		await newMessage.save();
		// io.emit("message", newMessage);
		res.status(201).json({ message: "Message sent successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error sending message" });
	}
};

export const saveContact = async (req, res) => {
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
};

export const getContacts = async (req, res) => {
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
};
