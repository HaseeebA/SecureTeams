import React, { useState } from "react";
import "../styles/signup.css";
import StarsCanvas from './canvas/Stars';

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    // Perform signup logic here, e.g., send data to the server
    console.log("Signup data:", { name, email, password });
  };

  return (
    <div className="signup-container">
      <StarsCanvas />
      <form className="signup-form">
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
        <button type="submit" onClick={handleSignup} className="signup-button">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
