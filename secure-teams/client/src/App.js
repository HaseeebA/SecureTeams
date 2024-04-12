import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./components/welcome.js";
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

function App() {
	return (
		<Router>
			<Routes>
				<Route path="*" element={<NotFound />} />
				<Route path="/" element={<Welcome />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route
					path="/homepage"
					element={<ProtectedRoute component={Homepage} />}
				/>
				<Route path="/team" element={<ProtectedRoute component={Team} />} />
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
				<Route
					path="/tasks"
					element={<ProtectedRoute component={Tasks} />}
				/>
				<Route
					path="/calendar"
					element={<ProtectedRoute component={CalendarPage} />}
				/>

			</Routes>
		</Router>
	);
}

export default App;
