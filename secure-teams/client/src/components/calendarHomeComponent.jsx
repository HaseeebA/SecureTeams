import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "../styles/CalendarComponent.css";

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [popupEvents, setPopupEvents] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const email = localStorage.getItem("email");
        const response = await fetch(
          `https://secureteams.onrender.com/api/events?email=${email}`
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

  const tileContent = ({ date: calendarDate, view }) => {
    const clickedDate = new Date(calendarDate);
    const eventsOnDate = events.filter((event) => {
      const eventDate = new Date(event.date);
      return isSameDay(eventDate, clickedDate);
    });

    const handleTileClick = () => {
      setPopupEvents(eventsOnDate);
      setShowPopup(true);
    };

    let exceededEventsCount = 0;

    return (
      <div className="event-box" onClick={handleTileClick}>
        {eventsOnDate.map((event, index) => {
          const eventStyle = {
            backgroundColor: `hsl(${index * 20}, 70%, 80%)`,
          };
          if (index * 20 < 10) {
            return (
              <div key={event.id} className="event-found" style={eventStyle}>
                {event.title}
              </div>
            );
          } else {
            exceededEventsCount++;
            return null;
          }
          
        })}
        {exceededEventsCount > 0 && (
        <div className="exceeded-events-message" style={{ backgroundColor: `white` }}>
          {`+ ${exceededEventsCount} more`}
        </div>
      )}
      </div>
      
    );
  };

  return (
    <div className="homepage-container" style={{ marginLeft: '250px' }}>
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
              {popupEvents.map((event) => (
                <li key={event.id}>
                  <div className="event-container">
                    <div className="event-title">{event.title}</div>
                  </div>
                </li>
              ))}
            </ul>
            <button className="close-button" onClick={handleClosePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
