import React, { useState } from "react";
import { Link } from "react-router-dom";
import { mk, maha, anas, gilani, haseeb } from "../images/index";
import "../styles/welcome.css";

const Welcome = () => {
	const scrollToTestimonials = () => {
		const testimonialsSection = document.getElementById("testandtestimonials");
		testimonialsSection.scrollIntoView({ behavior: "smooth" });
	};

	const teamMembers = [
		{
			img: mk,
			name: "Momin Kashif",
			contact: "923458253935",
			linkedin: "https://www.linkedin.com/in/momin-kashif-601a57119/",
			testimonial:
				"Finally, a chatting app that prioritizes security without compromising on user experience.",
		},
		{
			img: anas,
			name: "Anas Sohail",
			contact: "923242756548",
			linkedin: "https://www.linkedin.com/in/anas-sohail-a979b1234/",
			testimonial:
				"In the fortress of digital realms, security stands guard, ensuring peace of mind for all who dwell within.",
		},
		{
			img: gilani,
			name: "SM Gilani",
			contact: "923354118311",
			testimonial:
				"لاکھ گرد اپنے حفاظت کی لکیریں کھینچو ایک بھی ان میں نہیں مان کی دعاؤں جیسی",
		},
		{
			img: maha,
			name: "Maha Humayun",
			contact: "923086677600",
			testimonial:
				"In the digital age, security isn't an option; it's a necessity. A fundamental principle that underpins trust in technology.",
		},
		{
			img: haseeb,
			name: "Haseeb Asad",
			contact: "923237146391",
			linkedin: "https://www.linkedin.com/in/haseeb-asad/",
			testimonial:
				"Security is not just a feature, it's the foundation of trust in our digital world.",
		},
	];

	const [currentIndex, setCurrentIndex] = useState(0);

	const moveCarousel = (direction) => {
		setCurrentIndex((prevIndex) => {
			const newIndex = prevIndex + direction;
			if (newIndex < 0) {
				return teamMembers.length - 1;
			} else if (newIndex >= teamMembers.length) {
				return 0;
			} else {
				return newIndex;
			}
		});
	};

	return (
		<div className="welcome">
			<div className="onlybg">
				{" "}
				{/* Welcome Section */}
				<div className="container1">
					<h2
						className="welcome-title"
						style={{ color: "#fff", fontSize: "4rem", fontWeight: "bold", textAlign: "center" }}
					>
						Welcome to Secure Teams
					</h2>
					<div className="buttons">
						<Link to="/login">
							<button className="btn-login">Log In</button>
						</Link>
						<Link to="/signup">
							<button className="btn-signup">Sign Up</button>
						</Link>
						<button
							onClick={scrollToTestimonials}
							className="btn-scroll btn-contact-us"
						>
							Contact Us
						</button>
					</div>
				</div>
			</div>
			<div id="testandtestimonials" className="team-and-testimonials">
				<div className="container">
					<div className="row">
						<div className="col-md-6">
							<div className="team-section">
								{" "}
								{/* Team Section for displaying names and images*/}
								<h1 className="team-title">Meet Our Team</h1>
								<div className="team-carousel-container">
									<div className="team-member-container">
										{/* <div className="progress-bar">
											{teamMembers.map((_, index) => (
												<div
													key={index}
													className={`progress-bar-item ${
														index === currentIndex ? "active" : ""
													}`}
												/>
											))}
										</div> */}
										<img
											src={teamMembers[currentIndex].img}
											alt={teamMembers[currentIndex].name}
											className="team-member-image"
										/>
										<span className="team-member-name">
											{teamMembers[currentIndex].name}
										</span>
										{/* <a
											href={`https://wa.me/${teamMembers[currentIndex].contact}`}
											className="whatsapp-contact-link"
											target="_blank"
											rel="noopener noreferrer"
										>
											Contact on WhatsApp
										</a> */}
										<div
											className="social-media-links"
											style={{ display: "flex" }}
										>
											<a
												href={`https://wa.me/${teamMembers[currentIndex].contact}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													x="0px"
													y="0px"
													width="40"
													height="40"
													viewBox="0 0 48 48"
												>
													<path
														fill="#fff"
														d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"
													></path>
													<path
														fill="#fff"
														d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"
													></path>
													<path
														fill="#cfd8dc"
														d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"
													></path>
													<path
														fill="#40c351"
														d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"
													></path>
													<path
														fill="#fff"
														fill-rule="evenodd"
														d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z"
														clip-rule="evenodd"
													></path>
												</svg>
											</a>
											<a
												href={teamMembers[currentIndex].linkedin}
												target="_blank"
												rel="noopener noreferrer"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													x="0px"
													y="0px"
													width="40"
													height="40"
													viewBox="0 0 48 48"
												>
													<path
														fill="#0288D1"
														d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"
													></path>
													<path
														fill="#FFF"
														d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z"
													></path>
												</svg>
											</a>
										</div>
									</div>

									<button
										className="carousel-button next"
										onClick={() => moveCarousel(1)}
									>
										&gt;
									</button>
								</div>
							</div>
						</div>
						<div className="col-md-6">
							<div className="testimonials-section">
								{" "}
								{/* Testimonials Section for displaying testimonials */}
								<h1 className="testimonials-title">Testimonials</h1>
								<div className="testimonials-carousel">
									{teamMembers.map((member, index) => (
										<div
											key={index}
											className={`testimonial ${
												index === currentIndex ? "active" : ""
											}`}
										>
											<p>{member.testimonial}</p>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="footer">
				<footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
					<p className="col-md-4 mb-0" style={{ color: "#fff" }}>
						© 2024 Secure Teams. All Rights Reserved.
					</p>

					<ul className="nav col-md-4 justify-content-end">
						<li className="nav-item">
							<a href="#" className="nav-link px-2" style={{ color: "#fff" }}>
								Home
							</a>
						</li>
						<li className="nav-item">
							<a
								href="/compliance"
								className="nav-link px-2"
								style={{ color: "#fff" }}
							>
								Terms & Conditions
							</a>
						</li>
					</ul>
				</footer>
			</div>
		</div>
	);
};

export default Welcome;
