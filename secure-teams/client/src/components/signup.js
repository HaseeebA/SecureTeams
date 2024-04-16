import React, { useState } from "react";
import StarsCanvas from "./canvas/Stars";
import axios from "axios";
import "../styles/signup.css";
import { Link } from "react-router-dom";
import { closed, open } from "../images/index.js"; // Make sure you have these icons in your images folder

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const Signup = (props) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false); // New state for confirm password
    const [error, setError] = useState("");

    const handleSignup = async (event) => {
        event.preventDefault();

        if (!/^.+@secureteams\.com$/.test(email)) {
            setError("Email must be in the format _@secureteams.com");
            return;
        }

        if (name === "") {
            setError("Please enter name")
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        if (!/\d/.test(password)) {
            setError("Password must contain at least one number");
            return;
        }

        if (!/[!@#$%^&*.]/.test(password)) {
            setError("Password must contain at least one special character");
            return;
        }

        try {
            const response = await axios.post(apiBaseUrl + "/signup", {
                name: name,
                email: email,
                password: password,
            });
            console.log(response.data);
            setName("");
            setEmail("");
            setPassword("");

            setError("Signup successful! Redirecting to the login page...");
            window.location = "/login";
        } catch (error) {
            setError("Error signing up");
            if(error.response.data.message === "User already exists")
            {
                setError("User already exists")
            }
            console.error(error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword); // New function to toggle confirm password visibility
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
                <div className="password-field">
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        className="signup-input"
                    />
                    <img
                        src={showPassword ? open : closed}
                        onClick={togglePasswordVisibility}
                        alt="Toggle visibility"
                        className="toggle-password"
                    />
                </div>
                <div className="password-field">
                    <input
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        type={showPassword ? "text" : "password"}
                        className="signup-input"
                    />
                    <img
                        src={showConfirmPassword ? open : closed}
                        onClick={toggleConfirmPasswordVisibility}
                        alt="Toggle confirm password visibility"
                        className="toggle-password"
                    />
                </div>
                {error && (
							<p
								className="error-message"
								style={{ color: 'yellow', fontSize: '1em'}}
							>
								ERROR!! {error}
							</p>
						)}
                <button type="submit" onClick={handleSignup} className="signup-button">
                    Sign Up
                </button>
				<div> 
					
				</div>
                <h2>Already have an account?</h2>
                <button type="submit" className="signup-button">
                    <Link to="/login">Login</Link>
                </button>
            </form>
        </div>
    );
};

export default Signup;