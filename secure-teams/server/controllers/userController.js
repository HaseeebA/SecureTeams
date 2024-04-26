import User from "../models/user.js";
import logtoFile from "../middleware/logger.js";

//get all users
export const getUsers = async (req, res) => {
	try {
		const users = await User.find();
		res.status(200).json(users);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Error fetching users" });
	}
};


//get users that have just signed up and not been assigned a role yet
export const getNewUsers = async (req, res) => {
	try {
		const users = await User.find({ role: "employee" });
		res.status(200).json(users);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Error fetching users" });
	}
};

//update role of new employees
export const putUser = async (req, res) => {
	const { role, email } = req.body;

	logtoFile(req.method, req.url, email);

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
};
