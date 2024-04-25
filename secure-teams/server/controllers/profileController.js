import User from "../models/user.js";

export const fetchProfile = async (req, res) => {
	const email = req.query.email;

	try {
		const user = await User.findOne({ email: email });
		if (!user) {
			console.log("User not found");
			return res.status(404).json({ message: "User not found" });
		}
		res.status(200).json(user);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Error fetching profile" });
	}
};

export const getProfilePhoto = async (req, res) => {
	const profilePhoto = req.params.profilePhoto;
	res.sendFile(profilePhoto, { root: "uploads" });
};
