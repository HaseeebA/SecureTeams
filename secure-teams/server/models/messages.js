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
    contacts: [{
        name: { type: String, required: true },
        email: { type: String, required: true },
        lastConversationTimestamp: { type: Date, default: Date.now },
        latestMessage: { type: String, default: null }
    }],
});

const Contact = mongoose.model("Contact", contactsSchema);

export { Message, Contact };
