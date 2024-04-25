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
    const { email, contact, latestMessage } = req.body;

    // Check if email and contact are the same
    if (email === contact) {
        return res.status(400).json({ message: "You cannot add yourself as a contact" });
    }

    logtoFile(req.method, req.url, email);

    try {
        // Check if the contact email exists in the system
        const userExists = await User.findOne({ email: contact });
        if (!userExists) {
            return res.status(400).json({ message: "User does not exist" });
        }
        const namee = userExists.name;
        // Update or create the contact for the current user
        let existingContactsCurrentUser = await Contact.findOne({ email });
        if (!existingContactsCurrentUser) {
            existingContactsCurrentUser = new Contact({ email, contacts: [] });
        }
        const contactIndex = existingContactsCurrentUser.contacts.findIndex(c => c.email === contact);
        if (contactIndex !== -1) {
            // Update existing contact
            existingContactsCurrentUser.contacts[contactIndex].lastConversationTimestamp = Date.now();
            existingContactsCurrentUser.contacts[contactIndex].latestMessage = latestMessage;
        } else {
            // Create new contact
            existingContactsCurrentUser.contacts.push({
                name: namee,
                email: contact,
                lastConversationTimestamp: Date.now(),
                latestMessage: latestMessage
            });
        }
        await existingContactsCurrentUser.save();

        const userExists2 = await User.findOne({ email: email });
        if (!userExists) {
            return res.status(400).json({ message: "User does not exist" });
        }
        const namee2 = userExists2.name;
        // Update or create the contact for the contacted user
        let existingContactsContactedUser = await Contact.findOne({ email: contact });
        if (!existingContactsContactedUser) {
            existingContactsContactedUser = new Contact({ email: contact, contacts: [] });
        }
        const currentUserIndex = existingContactsContactedUser.contacts.findIndex(c => c.email === email);
        if (currentUserIndex === -1) {
            // Create new contact for contacted user
            existingContactsContactedUser.contacts.push({
                name: namee2,
                email: email,
                lastConversationTimestamp: Date.now(),
                latestMessage: latestMessage
            });
        } else {
            // Update existing contact for contacted user
            existingContactsContactedUser.contacts[currentUserIndex].lastConversationTimestamp = Date.now();
            existingContactsContactedUser.contacts[currentUserIndex].latestMessage = latestMessage;
        }
        await existingContactsContactedUser.save();

        // Send success response
        res.status(200).json({ message: "Contact added successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error adding contact" });
    }
};


export const getContacts = async (req, res) => {
	const { email } = req.query; // Access email from query parameters

	logtoFile(req.method, req.url, email);

	try {
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
