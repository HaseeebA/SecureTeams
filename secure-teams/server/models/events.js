import mongoose from "mongoose";

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

export default Events;