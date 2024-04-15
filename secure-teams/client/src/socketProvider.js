import React, { createContext, useContext, useEffect } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
	return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
	const socket = io(process.env.REACT_APP_SOCKET_URL, {
		transports: ["websocket"],
	});


	return (
		<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
	);
};
