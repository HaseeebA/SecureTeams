import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
	userId: { type: String, required: true }, // Changed to store email directly
	title: { type: String, required: true },
	description: { type: String, required: true },
});

const Task = mongoose.model("Task", taskSchema);

const teamSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	members: [
		{
			type: String,
			required: true,
		},
	],
});

const Team = mongoose.model("Team", teamSchema);

export { Task, Team };
