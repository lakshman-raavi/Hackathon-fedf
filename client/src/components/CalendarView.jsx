"use client"

import { useState, useEffect } from "react"
import "../styles/calendar.css"

export default function CalendarView({ events = [], activities = [], token, onRegister }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedDateEvents, setSelectedDateEvents] = useState([])

  useEffect(() => {
    generateCalendar()
  }, [currentDate, events])

  const generateCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    setCalendarDays(days)
  }

  const getEventsForDate = (date) => {
    if (!date) return []
    return events.filter((event) => {
      const eventDate = new Date(event.date)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const handleDateClick = (date) => {
    if (!date) return
    const eventsForDate = getEventsForDate(date)
    setSelectedDate(date)
    setSelectedDateEvents(eventsForDate)
  }

  const handleEventRegister = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/attend`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        alert("Successfully registered for event!")
        if (onRegister) {
          onRegister()
        }
      } else {
        const error = await response.json()
        alert(error.message || "Error registering for event")
      }
    } catch (error) {
      console.error("Error registering for event:", error)
      alert("Error registering for event. Please try again.")
    }
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={previousMonth} className="nav-btn">
          ←
        </button>
        <h2>{currentDate.toLocaleString("default", { month: "long", year: "numeric" })}</h2>
        <button onClick={nextMonth} className="nav-btn">
          →
        </button>
      </div>

      <div className="calendar-weekdays">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-days">
        {calendarDays.map((date, index) => (
          <div
            key={index}
            className={`calendar-day ${date ? "active" : "empty"} ${
              date && getEventsForDate(date).length > 0 ? "has-event" : ""
            } ${date && selectedDate && date.getTime() === selectedDate.getTime() ? "selected" : ""}`}
            onClick={() => handleDateClick(date)}
          >
            {date && (
              <>
                <div className="day-number">{date.getDate()}</div>
                {getEventsForDate(date).length > 0 && (
                  <div className="event-indicator">
                    <div className="event-dot"></div>
                    <span className="event-count">{getEventsForDate(date).length}</span>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {selectedDate && selectedDateEvents.length > 0 && (
        <div className="selected-date-events">
          <h3>Events on {selectedDate.toLocaleDateString()}</h3>
          <div className="events-list">
            {selectedDateEvents.map((event) => (
              <div key={event._id} className="event-item-detailed">
                <div className="event-details">
                  <p className="event-title">{event.title}</p>
                  <p className="event-time">{event.time}</p>
                  <p className="event-location">{event.location}</p>
                  <p className="event-points">Points: {event.pointsPerEvent}</p>
                </div>
                {token && (
                  <button className="btn-register-event" onClick={() => handleEventRegister(event._id)}>
                    Register
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="upcoming-events">
        <h3>Upcoming Events</h3>
        {events.length > 0 ? (
          <div className="events-list">
            {events.slice(0, 5).map((event) => (
              <div key={event._id} className="event-item">
                <div className="event-date">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="event-details">
                  <p className="event-title">{event.title}</p>
                  <p className="event-time">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-events">No upcoming events</p>
        )}
      </div>
    </div>
  )
}
