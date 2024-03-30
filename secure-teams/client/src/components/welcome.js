import React from "react";
import { Link } from "react-router-dom";
import "../styles/welcome.css";
import StarsCanvas from "../components/canvas/Stars";

const Welcome = () => {
	return (
		<div>
			<div className="welcome-white">
				<div className="text-white">
					<div className="container">
						<h2 className="head2">Welcome to Secure Teams!</h2>
						{/* <p>Please choose an option:</p> */}
						<div className="buttons">
							<Link to="/login">
								<button className="btn-login">Log In</button>
							</Link>
							<Link to="/signup">
								<button className="btn-signup">Sign Up</button>
							</Link>
						</div>
					</div>
					<StarsCanvas />
				</div>
			</div>
		</div>
	);
};

export default Welcome;
