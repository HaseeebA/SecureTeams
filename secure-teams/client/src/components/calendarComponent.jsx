import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "../styles/CalendarComponent.css"; // Import the CSS file

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [popupEvents, setPopupEvents] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const email = localStorage.getItem("email");
        const response = await fetch(
          `http://localhost:3000/api/events?email=${email}`
        );
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          console.error("Failed to fetch events");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const isSameDay = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const email = localStorage.getItem("email");
      const response = await fetch(
        `http://localhost:3000/api/delete-event/${email}/${eventId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleTileClick = (value) => {
    const clickedDate = new Date(value);
    const eventsOnDate = events.filter((event) => {
      const eventDate = new Date(event.date);
      return isSameDay(eventDate, clickedDate);
    });
    setPopupEvents(eventsOnDate);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleAddEvent = async () => {
    if (newEventTitle.trim() !== "") {
      try {
        const email = localStorage.getItem("email");
        const response = await fetch("http://localhost:3000/api/add-event", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            title: newEventTitle.trim(),
            date: date,
          }),
        });
        if (response.ok) {
          window.location.reload();
        } else {
          console.error("Failed to add event");
        }
      } catch (error) {
        console.error("Error adding event:", error);
      }
    }
  };

  const tileContent = ({ date: calendarDate, view }) => {
    if (!events || events.length === 0) {
      return null;
    }

    const eventCount = events.filter((event) =>
      isSameDay(event.date, calendarDate)
    ).length;
    return view === "month" && eventCount > 0 ? (
      <div
        className="event-marker"
        onClick={() => handleTileClick(calendarDate)}
      >
        <span>{`${eventCount} Event${eventCount !== 1 ? "s" : ""}`}</span>
      </div>
    ) : null;
  };

  return (
    <div className="calendar-container">
      <div className="add-event-section">
        <input
          type="text"
          placeholder="Enter event title"
          value={newEventTitle}
          onChange={(e) => setNewEventTitle(e.target.value)}
        />
        <button onClick={handleAddEvent}>Add Event</button>
      </div>
      <Calendar
        onChange={handleDateChange}
        value={date}
        tileContent={tileContent}
      />
     {showPopup && (
    <div className="event-popup">
        <div className="event-popup-content">
            <h3>Events on this day:</h3>
            <ul>
                {popupEvents.map(event => (
                    <li key={event.id}>
                        <div className="event-container">
                            <div className="event-title">{event.title}</div>
                            <button className="delete-button" onClick={() => handleDeleteEvent(event.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
            <button className="close-button" onClick={handleClosePopup}>Close</button>
        </div>
    </div>
)}

    </div>
  );
};

export default CalendarComponent;
