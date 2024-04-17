import React, { useEffect, useState } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	useLocation,
} from "react-router-dom";
import Welcome from "./components/welcome.jsx";
import Homepage from "./components/homepage.jsx";
import Login from "./components/login.js";
import Signup from "./components/signup.js";
import Team from "./components/team.jsx";
import Roles from "./components/admin/manageRoles.jsx";
import {
	AdminProtectedRoute,
	ProtectedRoute,
} from "./components/protectedRoutes.js";
import Messages from "./components/messages.jsx";
import Profile from "./components/profile.jsx";
import Members from "./components/members.jsx";
import Settings from "./components/settings.jsx";
import CalendarPage from "./components/calendarPage.jsx";
import Tasks from "./components/tasks.jsx";
import NotFound from "./components/notfound.jsx";
import Dashboard from "./components/admin/dashboard.jsx";
import ComplianceDocument from "./components/compliance.jsx";
import axios from "axios";
import { SocketProvider } from "./socketProvider.js";

function LogUserEmail() {
	const location = useLocation();
	const [logged, setLogged] = useState(false);

	useEffect(() => {
		const userEmail = localStorage.getItem("email");
		if (userEmail) {
			axios.post(process.env.REACT_APP_API_BASE_URL + "/auth/log", {
				email: userEmail,
				route: location.pathname,
			});
			setLogged(true);
		}
	}, [location.pathname, logged]);

	return null;
}

function App() {
	return (
		<Router>
			<LogUserEmail />
			<SocketProvider>
				<Routes>
					<Route path="/" element={<Welcome />} />
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					<Route
						path="/homepage"
						element={<ProtectedRoute component={Homepage} />}
					/>
					{/* <Route path="/team" element={<ProtectedRoute component={Team} />} /> */}
					<Route
						path="/manageRoles"
						element={<AdminProtectedRoute component={Roles} />}
					/>
					<Route
						path="/profile"
						element={<ProtectedRoute component={Profile} />}
					/>
					<Route
						path="/settings"
						element={<ProtectedRoute component={Settings} />}
					/>
					<Route
						path="/messages"
						element={<ProtectedRoute component={Messages} />}
					/>
					<Route
						path="/members"
						element={<ProtectedRoute component={Members} />}
					/>
					<Route path="/tasks" element={<ProtectedRoute component={Tasks} />} />
					<Route
						path="/calendar"
						element={<ProtectedRoute component={CalendarPage} />}
					/>
					<Route
						path="/admin/dashboard"
						element={<AdminProtectedRoute component={Dashboard} />}
					/>
					<Route path="/compliance" element={<ComplianceDocument />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</SocketProvider>
		</Router>
	);
}

export default App;
