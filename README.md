# SecureTeams

SecureTeams is a collaboration tool designed for IT companies, focusing on data security and compliance. This README provides instructions for setting up and running the application.

## Version 0.1.0

### Features:
- **Login and Signup:** Users can securely login and signup with hashed passwords.
- **Two-Factor Authentication (2FA):** Added 2FA during Signup and Login for enhanced security.
- **Adding Contacts:** Users can add contacts using their emails.
- **Individual Messaging:** Allows individual messaging between team members.

## Setup Instructions:

1. Clone the repository to your local machine:
    ```bash
    git clone <repository_link>
    ```

2. Navigate to the cloned repository:
    ```bash
    cd SecureTeams/secure-teams
    ```

3. Open two separate terminals and navigate to the `server` and `client` directories respectively:
    ```bash
    # Terminal 1
    cd server

    # Terminal 2
    cd client
    ```

4. Install dependencies for both the server and client:
    ```bash
    # In server directory
    npm install

    # In client directory
    npm install
    ```

5. Start the server:
    ```bash
    # In server directory
    npm start
    ```

6. Once the server is connected to MongoDB, start the client:
    ```bash
    # In client directory
    npm start
    ```

7. The application should now be running. Access it in your web browser at the specified URL (usually http://localhost:3000).
