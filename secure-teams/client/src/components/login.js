import React, { useState } from "react";
import "../styles/login.css";
import "./homepage.jsx";
import StarsCanvas from "./canvas/Stars.jsx";
import axios from "axios";
import { Link } from "react-router-dom";
import { closed, open } from "../images/index.js";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const handleLogin = async (event) => {
		event.preventDefault();
		console.log("Email: " + email);
		console.log("Password: " + password);

		if (email === "") {
			alert("Email cannot be empty");
			return;
		}

		if (password === "") {
			alert("Password cannot be empty");
			return;
		}

		try {
			const response = await axios.post("http://localhost:3000/api/login", {
				email: email,
				password: password,
			});
			console.log(response.data);
			setEmail("");

			if (response.data.token) {
				localStorage.setItem("token", response.data.token);
				localStorage.setItem("role", response.data.role);
				window.location.href = "/homepage";
				localStorage.setItem("email", email);
			} else {
				alert("Invalid credentials");
			}
		} catch (error) {
			alert("Login failed");
			console.log(error);
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div className="login-bg">
			<div className="login">
				<StarsCanvas />
				<form className="login-form">
					<h2 className="head2">Login</h2>
					<input
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Email"
						type="email"
						className="login-input"
					/>
					<div className="input-container">
						<input
							type={showPassword ? "text" : "password"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Password"
							className="password-input"
						/>
						<img
							src={showPassword ? open : closed}
							alt={showPassword ? "Hide password" : "Show password"}
							className="toggle-password-visibility"
							onClick={togglePasswordVisibility}
						/>
					</div>
					<button type="submit" onClick={handleLogin} className="login-button">
						Sign In
					</button>
					<button type="submit" className="login-button">
						<Link to="/signup">
							Sign Up
						</Link>
					</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
