let socket = null;

export function connectWebSocket(roomId, password) {
  // Include both room and password in query params
  socket = new WebSocket(
    `ws://localhost:8080?room=${roomId}&password=${password}`
  );

  socket.onopen = () => {
    console.log(`🟢 Connected to room: ${roomId}`);
  };

  socket.onclose = () => {
    console.warn("🔴 Disconnected from WebSocket server");
  };

  socket.onerror = (error) => {
    console.error("❌ WebSocket error:", error);
  };

  return socket;
}

// Send drawing path to server
export function sendPath(data) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  }
}

// Listen to drawing updates from server
export function onPathReceived(callback) {
  if (!socket) return;

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      callback(data);
    } catch (err) {
      console.error("❌ Failed to parse incoming message:", err);
    }
  };
}
