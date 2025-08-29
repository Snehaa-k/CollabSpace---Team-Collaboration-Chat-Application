import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LandingPage } from "./screens/LandingPage/LandingPage";
import ChatPage from './screens/ChatPage/ChatPage.jsx';
import WelcomePage from './screens/WelcomePage/WelcomePage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { setUser } from './store/slices/authSlice';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      dispatch(setUser(user));
      setIsLoggedIn(true);
    }
  }, [dispatch]);

  const handleLogin = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              isLoggedIn ? (
                <Navigate to="/chat" replace />
              ) : (
                <LandingPage onLogin={handleLogin} />
              )
            } 
          />
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <ChatPage onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
