import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import Sidepanel from "./sidepanel";
import axios from "axios";
import ContactDetailsComponent from "./messagePortal";
import "../styles/messages.css";
import abc from "./sidepanel";
import { useSocket } from "../socketProvider";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
// console.log("API Base URL", apiBaseUrl);

const Messages = () => {
	const email = localStorage.getItem("email");
	const [selectedContact, setSelectedContact] = useState(""); // Selected contact for sending messages
	const [message, setMessage] = useState(""); // Message to be sent
	const [showSidePanel, setShowSidePanel] = useState(true);
	const initialTheme = localStorage.getItem("themeColor");
	const [theme, setTheme] = useState(initialTheme);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [emailInput, setEmailInput] = useState("");
	const [contacts, setContacts] = useState([]);
	const [showComponent, setShowComponent] = useState(false);
	const socket = useSocket();

	useEffect(() => {
		// Fetch contacts from the server when the component mounts
		fetchContacts();
	}, []);

	const reloadPage = () => {
		// Reload the entire page
		window.location.reload();
	};

	const fetchContacts = async () => {
		console.log("fetching contacts");
		try {
			// Make a GET request to fetch the contacts
			console.log(email);

			const response = await axios.get(apiBaseUrl + "/message/contacts", {
				params: { email: email }, // Pass the email as a query parameter
			});
			socket.emit("logActivity", {
				method: "GET",
				path: "/message/contacts",
				email: email,
			});
			if (response.status === 200) {
				// If the request is successful, extract the array of emails from the response data
				const data = response.data;
				console.log("dataaaaa:", data);
				const emailsArray = data;
				// const emailsArray = data[2]; // Access the array of emails at the third index
				// Set the contacts state with the extracted array
				console.log("emailsArray:", emailsArray);
				setContacts(emailsArray);
			} else {
				// If the request fails, log the error
				console.error("Failed to fetch contacts");
			}
		} catch (error) {
			console.error("Error fetching contacts:", error);
		}
	};

	const handleThemeChange = (newTheme) => {
		setTheme(newTheme);
		document.documentElement.style.setProperty(
			"--navbar-theme-color",
			newTheme
		);
	};

	const handleAddContact = () => {
		setIsModalOpen(true);
	};

	const handleEmailInputChange = (e) => {
		setEmailInput(e.target.value);
	};

	const handleAddContactConfirm = async () => {
		try {
			// Make POST request to the server's /api/contacts endpoint
			// const response = await axios.post("https://secureteams.onrender.com/api/contacts", {
			const response = await axios.post(apiBaseUrl + "/message/contacts", {
				email: email, // Pass the user ID
				contact: emailInput, // Pass the contact
			});
			socket.emit("logActivity", {
				method: "POST",
				path: "/message/contacts",
				email: email,
			});

			// Check if the request was successful
			if (response.status === 201) {
				console.log("Contact added successfully");
				// Close the modal
				window.alert("User added successfully");
				setIsModalOpen(false);
				reloadPage();
			} else {
				// Handle error response
				const data = await response.json();
				console.log("Error:", data.message);
				window.alert("User does not exist, please try again");
				// Set error message
				// setErrorMessage(data.message);
			}
		} catch (error) {
			console.log("Error adding contact:", error);
			console.error("Error:", error);
			window.alert("User does not exist, please try again");

			// Handle network error or other issues
			// setErrorMessage('Network error. Please try again later.');
		}
	};
	const handleContactClick = (contact) => {
		// Set the selected contact state when a contact is clicked
		setSelectedContact(contact);
		// Show the component when a contact is clicked
		setShowComponent(true);
		// setShowComponent(false);
	};

	const handleSendMessage = async () => {
		// Implement logic to send message to selected contact
		// This can include sending the message content to the backend and storing it in the database
		try {
			// console.log(message);
			// Make POST request to the server's /api/messages endpoint
			const response = await axios.post(
				// "https://secureteams.onrender.com/api/messages",
				apiBaseUrl + "/message/messages",
				{
					sender: email, // Pass the user ID
					receiver: selectedContact, // Pass the contact
					message: message, // Pass the message content
					time: new Date().toISOString(), // Pass the current time
				}
			);
			socket.emit("logActivity", {
				method: "POST",
				path: "/message/messages",
				email: email,
			});

			// Check if the request was successful
			if (response.status === 201) {
				console.log("Message sent successfully");
				// Clear the message input field
				setMessage("");
				// Optionally, display a success message to the user
			} else {
				// Handle error response
				const data = response.json();
				console.log("Error:", data.message);
				// Optionally, display an error message to the user
			}
		} catch (error) {
			console.log("Error sending message:", error);
			console.error("Error:", error);
			// Handle network error or other issues
		}
	};

	const handleKeyPress = (event) => {
		// Check if Enter key is pressed (key code 13) and shift key is not pressed
		if (event.keyCode === 13 && !event.shiftKey) {
			event.preventDefault(); // Prevent default behavior (creating new line)
			handleSendMessage(); // Call the function to send the message
			// clear message input field
			setMessage("");
		}
	};

	return (
		<div className="flex flex-col h-screen relative">
			{" "}
			{/* Added relative positioning */}
			<Navbar selectedTheme={theme} />
			{/* <InformationPanel /> */}
			<div className="flex h-screen">
				{" "}
				{/* Make this div flexible and allow it to grow, added relative positioning */}
				<div className={`w-16 sm:w-48 ${abc ? "block" : "hidden"}`}>
					<Sidepanel show={showSidePanel} onThemeChange={handleThemeChange} />
				</div>
				<div className={`relative h-full flex flex-col p-3 flex-1 bg-gray-100 transition-all duration-500 ease-in-out`}>
					<div className="transform h-full">
						<div className="h-full relative overflow-y-auto p-3 pr-4 rounded px-4">
							<button
								className="bg-blue-400 text-white px-1 py-1 rounded hover:bg-blue-500 flex items-center"
								onClick={handleAddContact}
							>
								Add Contact
							</button>
							{isModalOpen && (
								<div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-0 z-50">
									<div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
										<div className="flex justify-end">
											<button
												className="text-gray-600 hover:text-gray-800"
												onClick={() => setIsModalOpen(false)}
											>
												<svg
													className="w-6 h-6"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M6 18L18 6M6 6l12 12"
													/>
												</svg>
											</button>
										</div>
										<div className="mt-4">
											<input
												type="text"
												value={emailInput}
												onChange={handleEmailInputChange}
												onKeyPress={(e) => {
													if (e.key === "Enter") {
														handleAddContactConfirm();
													}
												}}
												placeholder="Enter email"
												className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
											/>
										</div>
										<div className="mt-4 flex justify-end">
											<button
												onClick={handleAddContactConfirm}
												className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
											>
												Add
											</button>
										</div>
									</div>
								</div>
							)}
							<div>
								{/* Display the list of contacts */}
								<div>
									{contacts ? (
										contacts.map((contact, index) => {
											// Split the contact string by "@" and take the first part
											const contactName = contact.split("@")[0];
											return (
												<div key={index} className="contact-item">
													<button
														className="contact-button"
														onClick={() => handleContactClick(contact)}
													>
														{contactName}
													</button>
												</div>
											);
										})
									) : (
										<div className="contact-item">No contacts available</div>
									)}
								</div>
							</div>
						</div>
						{showComponent && (
							<div className="modal">
								<div className="modal-content flex-grow flex flex-col">
									<ContactDetailsComponent
										receiver={selectedContact}
										sender={email}
									/>
								</div>
							</div>
						)}
					</div>
					<div className="transform bg-orange-2 flex justify-end">
						{" "}
						{/* Removed absolute positioning */}
						<textarea
							className="w-full h-1/8 p-2 mb-4 border border-gray-300 rounded px-4"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							onKeyDown={handleKeyPress} // Add key press event listener
							placeholder="Type your message and press Enter to send"
							style={{ margin: "10px" }}
						/>
						<button
							className="bg-blue-400 text-white px-4 py-3 rounded hover:bg-blue-600 flex items-center"
							onClick={handleSendMessage}
							style={{ marginLeft: "10px", marginBottom: "1px" }}
						>
							Send
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Messages;
