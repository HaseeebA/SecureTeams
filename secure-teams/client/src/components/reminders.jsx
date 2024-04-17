import React, { useState } from 'react';
import "../styles/RemindersList.css";

function RemindersList() {
    const [tasks, setTasks] = useState([]);
    const [newTaskText, setNewTaskText] = useState("");
    const [error, setError] = useState("");
  
    const addTask = () => {
      if (newTaskText.trim() === "") {
        setError("Error: Task cannot be empty.");
        return;
      }
      if (tasks.length >= 5) {
        setError("Error: Task list full. Delete some tasks to add new ones.");
        return;
      }
      if (newTaskText.length > 30) {
        setError("Error: Character limit exceeded! Keep below 30 characters.");
        return;
      }
  
      const newTask = {
        id: Date.now(),
        text: newTaskText,
        completed: false
      };
      setTasks([...tasks, newTask]);
      setNewTaskText("");
      setError("");
    };
  
    const deleteTask = taskId => {
      setTasks(tasks.filter(task => task.id !== taskId));
    };
  
    const toggleTaskCompletion = taskId => {
      setTasks(tasks.map(task => {
        if (task.id === taskId) {
          return { ...task, completed: !task.completed };
        }
        return task;
      }));
    };
  
    return (
      <div className="reminders-container">
        <header className="reminders-header">
          <span>Reminders List</span>
        </header>
        <ul className="reminders-list">
          {tasks.map(task => (
            <li key={task.id} className={task.completed ? 'completed' : ''}>
              <div className="task-content">
                <input
                  type="checkbox"
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task.id)}
                />
                <label htmlFor={`task-${task.id}`}>{task.text}</label>
              </div>
              <button 
                className="task-delete-button" 
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        <div className="new-task-input">
          <input
            type="text"
            placeholder="Enter task"
            value={newTaskText}
            onChange={e => {
              setNewTaskText(e.target.value);
              setError(""); // Clear error when typing
            }}
            maxLength={30}
          />
          <button 
            className="new-task-button" 
            onClick={addTask}
          >
            Add Task
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
        <footer className="reminders-footer">
          <span>SecureTeams.com</span>
        </footer>
      </div>
    );
  }
  
  export default RemindersList;
  