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
		{ img: mk, name: "Momin Kashif", contact: "923458253935", testimonial: "Finally, a chatting app that prioritizes security without compromising on user experience." },
		{ img: anas, name: "Anas Sohail", contact: "923242756548", testimonial: "In the fortress of digital realms, security stands guard, ensuring peace of mind for all who dwell within." },
		{ img: gilani, name: "SM Gilani", contact: "923354118311", testimonial: "لاکھ گرد اپنے حفاظت کی لکیریں کھینچو ایک بھی ان میں نہیں مان کی دعاؤں جیسی" },
		{ img: maha, name: "Maha Humayun", contact: "923086677600", testimonial: "In the digital age, security isn't an option; it's a necessity. A fundamental principle that underpins trust in technology." },
		{ img: haseeb, name: "Haseeb Asad", contact: "923237146391", testimonial: "Security is not just a feature, it's the foundation of trust in our digital world." },
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
		<div>
			<div className="onlybg"> { /* Welcome Section */}
				<div className="container1">
					<h2 className="head2">Welcome to Secure Teams!</h2>
					<div className="buttons">
						<Link to="/login">
							<button className="btn-login">Log In</button>
						</Link>
						<Link to="/signup">
							<button className="btn-signup">Sign Up</button>
						</Link>
						<button onClick={scrollToTestimonials} className="btn-scroll btn-contact-us">
							Contact Us
						</button>
					</div>
				</div>
			</div>
			<div id="testandtestimonials" className="team-and-testimonials">
				<div className="container">
					<div className="row">
						<div className="col-md-6">
							<div className="team-section"> { /* Team Section for displaying names and images*/}
								<h1 className="team-title">Meet Our Team</h1>
								<div className="team-carousel-container">
									<div className="team-member-container">
										<div className="progress-bar">
											{teamMembers.map((_, index) => (
												<div
													key={index}
													className={`progress-bar-item ${index === currentIndex ? 'active' : ''}`}
												/>
											))}
										</div>
										<img
											src={teamMembers[currentIndex].img}
											alt={teamMembers[currentIndex].name}
											className="team-member-image"
										/>
										<span className="team-member-name">{teamMembers[currentIndex].name}</span>
										<a
											href={`https://wa.me/${teamMembers[currentIndex].contact}`}
											className="whatsapp-contact-link"
											target="_blank"
											rel="noopener noreferrer"
										>
											Contact on WhatsApp
										</a>
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
							<div className="testimonials-section"> { /* Testimonials Section for displaying testimonials */}
								<h1 className="testimonials-title">Testimonials</h1>
								<div className="testimonials-carousel">
									{teamMembers.map((member, index) => (
										<div key={index} className={`testimonial ${index === currentIndex ? 'active' : ''}`}>
											<p>{member.testimonial}</p>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="footer"> { /* Footer Section */}
				<div className="footer-content">
					<p style={{ color: "#fff", margin: 0 }}>
						© 2024 Secure Teams. All Rights Reserved.
					</p>
				</div>
				<div className="footer-links">
					<Link to="" style={{ color: "#fff" }}>
						Terms and Conditions
					</Link>
				</div>
			</div>

		</div>
	);
};

export default Welcome;
