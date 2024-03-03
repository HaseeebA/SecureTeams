# SecureTeams

SecureTeams is a collaboration tool designed for IT companies, focusing on data security and compliance. This README provides instructions for setting up and running the application.

## Version 0.1.0

### Features:
- **Login and Signup:** Users can securely login and signup with hashed passwords.
- **JWT Tokens:** Session tokens are implemented alongside protected routes to ensure authenticated access.
- **Two-Factor Authentication (2FA):** Added 2FA during Login for enhanced security. Users can select this optional option by going to their settings.
- **Adding Contacts:** Users can add contacts using their emails.
- **Individual Messaging:** Allows individual messaging between team members.
- **Profile:** Users can now see their profile and edit it. This includes their name, email, password and profile photo.
- **Role Assignment:** Admin will assign roles to users when they signup. Admin can also edit previously assigned roles.
- **Dynamic Themes:** Users can select themes of their choice to stylize the website to their preference.

## Setup Instructions:

1. Clone the repository to your local machine:
    ```bash
    git clone https://github.com/HaseeebA/SecureTeams.git
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

7. The application should now be running. Access it in your web browser at the specified URL (usually http://localhost:3001).

## Additional Information:

SecureTeams allows users to sign up as team members directly and then log in to view the application. The project is structured such that server and client files are in separate folders, including components, admin, styles, and images folders.
