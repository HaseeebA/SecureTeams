// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Link, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup"; 
// import React from 'react';
import Navbar from './components/Navbar';
import ParentComponent from './components/Parentsidepanel';
import InformationPanel from './components/infopanel';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="header">
          <h1>Secure Teams</h1>
          <nav>
            <ul>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/signup">Signup</Link>
              </li>
            </ul>
          </nav>
        </div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
      <Navbar />
      <ParentComponent />
      <InformationPanel />
    </Router>
  );
}

export default App;
