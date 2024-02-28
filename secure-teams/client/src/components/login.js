import React, { useState } from "react";
import "../styles/login.css";
import "./homepage.jsx";
import StarsCanvas from "./canvas/Stars.jsx";
import axios from "axios";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

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
				// try {
				// 	axios.get("http://localhost:3000/homepage", {
				// 		headers: {
				// 			Authorization: "Bearer " + localStorage.getItem("token"),
				// 		},
				// 	});
				// 	window.location.href = "/homepage";
				// } catch (error) {
				// 	console.log("Error fetching homepage:", error);
				// }
			} else {
				alert("Invalid credentials");
			}
		} catch (error) {
			alert("Login failed");
			console.log(error);
		}
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
					<input
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Password"
						type="password"
						className="login-input"
					/>
					<button type="submit" onClick={handleLogin} className="login-button">
						Sign In
					</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
