import fs from "fs";
import path from "path";

const logDirectory = "log_files";
const __dirname = path.resolve();

const logtoFile = (method, url, email) => {
	// console.log("EMAIL", email);
	if (email !== "admin@secureteams.com") {
		const timestamp = new Date().toLocaleString();
		const logMessage = `${timestamp} - ${method} ${url}\n`;

		const logFileName = `${email}_log.txt`;
		const logFilePath = path.join(__dirname, logDirectory, logFileName);

		fs.appendFile(logFilePath, logMessage, (err) => {
			if (err) {
				console.error("Error writing to log file:", err);
			}
		});
	}
};

export default logtoFile;
