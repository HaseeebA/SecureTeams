import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...rest }) => {
	const authenticateToken = localStorage.getItem("token");
    
    if (!authenticateToken) {
        alert("You must be logged in to access this page");
        return <Navigate to="/" />;
    }

    return <Component {...rest} />;
};

export default ProtectedRoute;