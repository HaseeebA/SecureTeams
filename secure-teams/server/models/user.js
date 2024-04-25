import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	password: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	settings: {
		is2FAEnabled: { type: Boolean, required: false, default: false },
		secondaryEmail: { type: String, required: false },
		twoFactorAuthCode: { type: String, required: false },
	},
	profilePhoto: { type: String, required: false },
	role: {
		type: String,
		required: false,
		enum: ["team-member", "team-lead", "manager", "admin", "employee"],
		default: "employee",
	},
	teams: { type: Array },
	wrongLoginAttempts: { type: Number, default: 0 },
	lockUntil: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

export default User;
