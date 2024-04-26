import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import Sidepanel from "./sidepanel";
import axios from "axios";
import ContactDetailsComponent from "./messagePortal";
import "../styles/messages.css";
import { useSocket } from "../socketProvider";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const Messages = () => {
	const email = localStorage.getItem("email");
	const [selectedContact, setSelectedContact] = useState(""); // Selected contact for sending messages
	const [message, setMessage] = useState(""); // Message to be sent
	const [showSidePanel, setShowSidePanel] = useState(true);
	const initialTheme = (localStorage.getItem("themeColor") || "#ddb892");
	const [theme, setTheme] = useState(initialTheme);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [emailInput, setEmailInput] = useState("");
	const [contacts, setContacts] = useState([]);
	const [showComponent, setShowComponent] = useState(false);
	const [selectedContactName, setSelectedContactName] = useState("");
	const socket = useSocket();

	useEffect(() => {
		fetchContacts();
	}, []);

	const reloadPage = () => {
		window.location.reload();
	};

	const fetchContacts = async () => {
		console.log("fetching contacts");
		try {
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
				const data = response.data;
				const emailsArray = data;
				setContacts(emailsArray);
			} else {
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
			if (response.status === 200) {
				console.log("Contact added successfully");
				window.alert("User added successfully");
				setIsModalOpen(false);
				reloadPage();
			} else {
				const data = await response.json();
				console.log("Error:", data.message);
				window.alert("User does not exist, please try again");
			}
		} catch (error) {
			console.log("Error adding contact:", error);
			console.error("Error:", error);
			window.alert("User does not exist, please try again");
		}
	};
	const handleContactClick = (contact) => {
		// Set the selected contact state when a contact is clicked
		setSelectedContact(contact.email);
		setSelectedContactName(contact.name);
		// Show the component when a contact is clicked
		// setShowComponent(true);
		setShowComponent(!showComponent);
		// setShowComponent(false);
	};

	socket.on("newMessage", (data) => {
		if (data.receiver === selectedContact && data.sender === email) {
			setContacts((prevContacts) => {
				const updatedContacts = [...prevContacts];
				const contactIndex = updatedContacts.findIndex(
					(contact) => contact.email === data.receiver
				);
				if (contactIndex !== -1) {
					updatedContacts[contactIndex].latestMessage = data.message;
					updatedContacts[contactIndex].lastConversationTimestamp =
						data.timestamp;
				} else {
					updatedContacts.push({
						email: data.sender,
						latestMessage: data.message,
						lastConversationTimestamp: data.timestamp,
					});
				}
				return updatedContacts;
			});
		} else if (data.receiver === email && data.sender === selectedContact) {
			setContacts((prevContacts) => {
				const updatedContacts = [...prevContacts];
				const contactIndex = updatedContacts.findIndex(
					(contact) => contact.email === data.sender
				);
				if (contactIndex !== -1) {
					updatedContacts[contactIndex].latestMessage = data.message;
					updatedContacts[contactIndex].lastConversationTimestamp =
						data.timestamp;
				} else {
					updatedContacts.push({
						email: data.sender,
						latestMessage: data.message,
						lastConversationTimestamp: data.timestamp,
					});
				}
				return updatedContacts;
			});
		}
	});

	const handleSendMessage = async () => {
		try {
			socket.emit("logActivity", {
				method: "POST",
				path: "/message/messages",
				email: email,
			});
			console.log("Sending message to:", selectedContact);
			socket.emit("sendMessage", {
				sender: email,
				receiver: selectedContact,
				message: message,
				timestamp: new Date().toUTCString(),
			});
			setMessage("");
		} catch (error) {
			console.log("Error sending message:", error);
			console.error("Error:", error);
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
			<Navbar selectedTheme={theme} />
			<div className="flex h-screen">
				<Sidepanel show={showSidePanel} onThemeChange={handleThemeChange} />
				<div
					// className={`relative h-full flex flex-col ml-56 p-3 flex-1 bg-gray-200 transition-all duration-500 ease-in-out`}
					className="messages-container"
				>
					<div className="transform h-full">
						<div className="h-full relative overflow-y-auto p-3 pr-4 rounded px-4">
							<button
								className="bg-blue-400 text-white mb-5 p-3 rounded hover:bg-gray-500 flex items-center"
								onClick={handleAddContact}
								style={{ backgroundColor: theme, borderRadius: "10px" }}
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
							<div className="contact-list">
								<div
									className="scrollable-container"
									style={{ backgroundColor: theme }}
								>
									{contacts ? (
										// Sort contacts based on lastConversationTimestamp
										contacts
											.sort((a, b) => {
												const timestampA = new Date(
													a.lastConversationTimestamp
												);
												const timestampB = new Date(
													b.lastConversationTimestamp
												);
												return timestampB - timestampA;
											})
											.map((contact, index) => {
												// Get the contact name
												const contactName = contact.email
													? contact.name
													: contact.email.split("@")[0];
												// Get the preview of the latest message
												const messagePreview =
													contact.latestMessage || "No messages";
												return (
													<div key={index} className="contact-item">
														<button
															className="contact-button"
															onClick={() => handleContactClick(contact)}
														>
															<div className="contact-name">{contactName}</div>
															<a className="message-preview">
																{messagePreview}
															</a>
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
										receiverName={selectedContactName}
									/>
								</div>
							</div>
						)}
					</div>
					{showComponent && selectedContact && (
						<div className="transform flex justify-end">
							<textarea
								className="w-full h-1/8 p-2 mb-4 border border-gray-300 rounded px-4"
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								onKeyDown={handleKeyPress} // Add key press event listener
								placeholder="Type your message and press Enter to send"
								style={{ margin: "10px", marginLeft: "215px" }}
							/>
							<button
								className="text-white px-2 py-0 rounded hover:bg-blue-600 flex items-center"
								onClick={handleSendMessage}
								style={{
									margin: "10px",
									padding: "15px",
									backgroundColor: theme,
								}}
							>
								Send
							</button>
						</div>
					)}
					{/* {!showComponent && (
						<div
							className="flex justify-center items-center h-full top-0 bottom-0 absolute mr-10 text-2xl text-black select-contact-text"
							style={{
								zIndex: "1",
								width: "500px",
								height: "auto",
								right: "auto",
								left: "50%",
								maxWidth: "fit-content",
							}}
						>
							Select a contact to message them
						</div>
					)} */}
				</div>
			</div>
		</div>
	);
};

export default Messages;
