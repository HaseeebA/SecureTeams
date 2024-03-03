import React from 'react';

const ContactDetailsComponent = ({ contact }) => {
    return (
        <div className="contact-details-container">
            {/* Display contact details here */}
            <p>{contact}</p>
            {/* Add more details or functionality as needed */}
        </div>
    );
};

export default ContactDetailsComponent;
