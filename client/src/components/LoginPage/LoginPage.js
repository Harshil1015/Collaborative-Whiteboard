import React, { useState } from "react";
import "./LoginPage.css"; // Import the CSS file

function LoginPage() {
  const [roomId, setRoomId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Room ID:", roomId);
    console.log("Password:", password);
    // Later: validate and connect to backend here
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Join Room</h2>
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Join Room</button>
      </form>
    </div>
  );
}

export default LoginPage;
