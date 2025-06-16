let socket = null;
let onPathCallback = null;

export function connectWebSocket(roomId, password) {
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

  // When receiving a message, forward to handler
  socket.onmessage = (event) => {
    if (!onPathCallback) return;
    try {
      const data = JSON.parse(event.data);
      onPathCallback(data);
    } catch (err) {
      console.error("❌ Failed to parse incoming message:", err);
    }
  };

  return socket;
}

// Send drawing path to server
export function sendPath(data) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  }
}

// Register callback for received paths
export function onPathReceived(callback) {
  onPathCallback = callback;
}
