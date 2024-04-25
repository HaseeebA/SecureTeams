import Events from "../models/events.js";
import logtoFile from "../middleware/logger.js";

export const fetchEvents = async (req, res) => {
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
};

export const addEvent = async (req, res) => {
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
};

export const deleteEvent = async (req, res) => {
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
};
