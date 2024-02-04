import React, { useState } from "react";
import "../styles/login.css";
import './homepage.jsx';
import StarsCanvas from './canvas/Stars.jsx';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        // Assume correct login logic here
        alert("Login successful!");
        window.location.href = "/homepage";
    };

    return (
        <div className="login">
            <StarsCanvas />
            <form className="login-form">
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
    );
}

export default Login;
