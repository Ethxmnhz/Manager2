// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import PasswordManager from './components/PasswordManager';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/password-manager"
          element={
            <PrivateRoute>
              <PasswordManager />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
