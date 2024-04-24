import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...rest }) => {
	const authenticateToken = localStorage.getItem("token");
	const role = localStorage.getItem("role");

	if (!authenticateToken) {
		// alert("You must be logged in to access this page");
		return <Navigate to="/" />;
	}
	

	return <Component {...rest} />;
};

const AdminProtectedRoute = ({ component: Component, ...rest }) => {
	const authenticateToken = localStorage.getItem("token");
	const role = localStorage.getItem("role");

	if (!authenticateToken) {
		// alert("You must be logged in to access this page");
		return <Navigate to="/" />;
	}

	if (role !== "admin") {
		// alert("You must be an admin to access this page");
		return <Navigate to="/homepage" />;
	}

	return <Component {...rest} />;
};

const EmployeeProtectedRoute = ({ component: Component, ...rest }) => {
	const authenticateToken = localStorage.getItem("token");
	const role = localStorage.getItem("role");

	if (!authenticateToken) {
		// alert("You must be logged in to access this page");
		return <Navigate to="/" />;
	}

	if (role === "admin") {
		// alert("You must be an admin to access this page");
		return <Navigate to="/homepage" />;
	}

	return <Component {...rest} />;
};

const MemberProtectedRoute = ({ component: Component, ...rest }) => {
	const authenticateToken = localStorage.getItem("token");
	const role = localStorage.getItem("role");

	if (!authenticateToken) {
		// alert("You must be logged in to access this page");
		return <Navigate to="/" />;
	}

	if (role === "employee") {
		// alert("You must be an admin to access this page");
		return <Navigate to="/homepage" />;
	}

	return <Component {...rest} />;
};

export { ProtectedRoute, AdminProtectedRoute, EmployeeProtectedRoute, MemberProtectedRoute };
