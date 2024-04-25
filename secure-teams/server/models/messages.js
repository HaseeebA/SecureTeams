import mongoose from "mongoose";

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

export { Message, Contact };
