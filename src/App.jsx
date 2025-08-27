import React, { useState } from 'react';
import { LandingPage } from "./screens/LandingPage/LandingPage";
import ChatPage from './screens/ChatPage/ChatPage.jsx';
import WelcomePage from './screens/WelcomePage/WelcomePage.jsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRooms, setUserRooms] = useState([]);
  const handleLogin = () => {
    setIsLoggedIn(true);
    // Start with no rooms for first-time users
  };

  const handleRoomCreated = (room) => {
    const newRoom = {
      ...room,
      id: userRooms.length + 1
    };
    setUserRooms([...userRooms, newRoom]);
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <LandingPage onLogin={handleLogin} />
      ) : (
        <ChatPage 
          userRooms={userRooms}
          onRoomCreated={handleRoomCreated}
        />
      )}
    </div>
  );
}

export default App;
