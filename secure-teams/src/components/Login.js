import React, {useState} from "react";

const Login = () => {
    const[emaill, setEmail] = useState("");
    const[passwordd, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
    };

    return (
        <div className="login">
            <form>
                <input
                    value={emaill}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    type="email"
                />
                <input
                    value={passwordd}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    type="password"
                />
                <button type="submit" onClick={handleLogin}>
                    Sign In
                </button>
            </form>
        </div>
    );
}

export default Login;