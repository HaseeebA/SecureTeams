import React, { useState } from "react";
import StarsCanvas from "./canvas/Stars";
import axios from "axios";
import "../styles/signup.css";
import { Link } from "react-router-dom";

const Signup = (props) => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleSignup = async (event) => {
		event.preventDefault();


		console.log("Name: " + name);
		console.log("Password: " + password);
		console.log("Email: " + email);

		if (name === "") {
			alert("Name cannot be empty");
			return;
		}

		if (password !== confirmPassword) {
			alert("Passwords do not match!");
			return;
		}

		if (password.length < 8) {
			alert("Password must be at least 8 characters long");
			return;
		}

		if (!/\d/.test(password)) {
			alert("Password must contain at least one number");
			return;
		}

		if (!/[!@#$%^&*.]/.test(password)) {
			alert("Password must contain at least one special character");
			return;
		}

		try {
			const response = await axios.post("https://secureteams.onrender.com/api/signup", {
				name: name,
				email: email,
				password: password,
			});
			console.log(response.data);
			setName("");
			setEmail("");
			setPassword("");

      alert("Signup successful! Redirecting to the login page...");
      window.location = "/login";
		} catch (error) {
			alert("Error signing up");
			console.log(error);
		}
	};

	return (
		<div className="signup-container">
			<StarsCanvas />
			<form className="signup-form">
				<h2 className="head2">Sign Up</h2>
				<input
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Name"
					type="text"
					className="signup-input"
				/>
				<input
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Email"
					type="email"
					className="signup-input"
				/>
				<input
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Password"
					type="password"
					className="signup-input"
				/>
				<input
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					placeholder="Confirm Password"
					type="password"
					className="signup-input"
				/>
				<button type="submit" onClick={handleSignup} className="signup-button">
					Sign Up
				</button>
				<h2>Already have an account?</h2>
				<button type="submit" className="signup-button">
					<Link to="/login">Login</Link>
				</button>
			</form>
		</div>
	);
};

export default Signup;
