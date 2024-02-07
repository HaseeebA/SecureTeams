import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./components/welcome.js";
import Homepage from "./components/homepage.jsx";
import Login from "./components/login.js";
import Signup from "./components/signup.js";
import ProtectedRoute from "./components/protectedRoutes.js";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Welcome />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route
					path="/homepage"
					element={<ProtectedRoute component={Homepage} />}
				/>
			</Routes>
		</Router>
	);
}

export default App;
