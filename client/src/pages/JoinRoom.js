import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function JoinRoom() {
  const [roomId, setRoomId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!roomId || !password) {
      alert("Room ID and password are required");
      return;
    }

    // Navigate to whiteboard room with password in query
    navigate(`/room/${roomId}?password=${password}`);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>🔐 Join a Whiteboard Room</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "inline-block", textAlign: "left" }}
      >
        <div>
          <label>Room ID:</label>
          <br />
          <input
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
          />
        </div>
        <br />
        <div>
          <label>Password:</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <br />
        <button type="submit">Join Room</button>
      </form>
    </div>
  );
}

export default JoinRoom;
