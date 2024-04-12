import React, { useState, useEffect } from "react";
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
	const [is2FAEnabled, setIs2FAEnabled] = useState(false);
	const [token, setToken] = useState("");
	const [role, setRole] = useState("");
	const [loginSuccess, setLoginSuccess] = useState(false);
	const [twofaToken, setTwofaToken] = useState(
		Array.from({ length: 6 }, () => "")
	);

	const handleLogin = async (event) => {
		event.preventDefault();

		if (email === "") {
			alert("Email cannot be empty");
			return;
		}

		if (password === "") {
			alert("Password cannot be empty");
			return;
		}

		try {
			const response = await axios.post("https://secureteams.onrender.com/api/login", {
				email: email,
				password: password,
			});

			setEmail(email);

			if (response.data.token) {
				const is2FAEnabledResponse = await axios.get(
					"https://secureteams.onrender.com/api/2faEnabled?email=" + email
				);

				setIs2FAEnabled(is2FAEnabledResponse.data.enabled);
				setToken(response.data.token);
				setRole(response.data.role);
				setLoginSuccess(true); // Set login success flag
			} else {
				alert("Invalid credentials");
			}
		} catch (error) {
			alert("Login failed");
			console.error(error);
		}
	};

	useEffect(() => {
		if (loginSuccess) {
			if (is2FAEnabled) {
				console.log("Email", email);
				axios.post("https://secureteams.onrender.com/api/2faSend", {
					email: email,
				});
			} else {
				// alert("Login successful");
				localStorage.setItem("token", token);
				localStorage.setItem("role", role);
				localStorage.setItem("email", email);
				window.location.href = "/homepage";
			}
		}
	}, [loginSuccess, is2FAEnabled, token, role]);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const handle2FAVerification = async (event) => {
		event.preventDefault();

		if (twofaToken.some((token) => token === "")) {
			alert("All fields must be filled");
			return;
		}

		try {
			console.log("2FA Verification", email, twofaToken);
			const response = await axios.post("https://secureteams.onrender.com/api/2faVerify", {
				email: email,
				twofaToken: twofaToken.join(""),
			});

			if (response.data.verified) {
				localStorage.setItem("token", token);
				localStorage.setItem("role", role);
				localStorage.setItem("email", email);
				window.location.href = "/homepage";
			} else {
				alert("2FA verification failed");
			}
		} catch (error) {
			alert("2FA verification failed");
			console.error(error);
		}
	};

	const handleTwofaTokenChange = (e, index) => {
		const newToken = [...twofaToken];
		newToken[index] = e.target.value;

		setTwofaToken(newToken);
	};

	return (
		<div className="login-bg">
			<div className="login">
				<StarsCanvas />
				{is2FAEnabled ? (
					<div className="login-form">
						<h2 className="head2">2FA Verification</h2>
						<div className="twofa-input-container">
							{twofaToken.map((value, index) => (
								<input
									key={index}
									value={value}
									onChange={(e) => handleTwofaTokenChange(e, index)}
									placeholder="0"
									type="text"
									className="twofa-input"
									maxLength={1}
								/>
							))}
						</div>
						<button
							type="submit"
							onClick={handle2FAVerification}
							className="login-button"
						>
							Verify
						</button>
					</div>
				) : (
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
						{/* <button
							type="submit"
							onClick={handleLogin}
							className="login-button"
						>
							Sign In
						</button>
						<button type="submit" className="signup-button">
							<Link to="/signup">Sign Up</Link>
						</button> */}
						<button 
							type="submit" 
							onClick={handleLogin}
							className="login-button"
							>
							Sign In
						</button>
						<button type="submit" className="signup-button" style={{ marginTop: '10px' }}> {/* Added inline style for margin top */}
							<Link to="/signup">Sign Up</Link>
						</button>

						
					</form>
				)}
			</div>
		</div>
	);
};

export default Login;
