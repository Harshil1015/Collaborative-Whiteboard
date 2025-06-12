const socket = new WebSocket("ws://localhost:8080"); // or your backend URL

socket.onopen = () => {
  console.log("✅ WebSocket connected");
};

socket.onerror = (err) => {
  console.error("❌ WebSocket error:", err);
};

export default socket;
