import fs from "fs";
import path from "path";

const logDirectory = "log_files";
const __dirname = path.resolve();

const logtoFile = (method, url, email) => {
	const timestamp = new Date().toLocaleString();
	const logMessage = `${timestamp} - ${method} ${url}\n`;

	const logFileName = `${email}_log.txt`;
	const logFilePath = path.join(__dirname, logDirectory, logFileName);

	fs.appendFile(logFilePath, logMessage, (err) => {
		if (err) {
			console.error("Error writing to log file:", err);
		}
	});
};

export default logtoFile;

// const loggingMiddleware = (req, res, next) => {
// 	const { method, url } = req;
// 	// console.log("Request received:", method, url);
// 	const timestamp = new Date().toLocaleString(); // Convert timestamp to a human-readable format
// 	const logMessage = `${timestamp} - ${method} ${url}\n`;

// 	// Extract the email from the request body
// 	const email = req.body.email;
// 	// console.log("request body", req.body);

// 	if (!email) {
// 		console.error("Email not provided in the request body.");
// 		return next();
// 	}

// 	// Construct the log file path using the email address
// 	const logFileName = `${email}_log.txt`;
// 	const logFilePath = path.join(__dirname, logDirectory, logFileName);

// 	// Append the log message to the user-specific log file
// 	fs.appendFile(logFilePath, logMessage, (err) => {
// 		if (err) {
// 			console.error("Error writing to log file:", err);
// 		}
// 	});

// 	next();
// };

// export default loggingMiddleware;
// export { logtoFile };
