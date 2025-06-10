// 🧠 Import libraries
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import cors from "cors";

// 🚪 Create an Express app
const app = express();
app.use(cors()); // Allows frontend to talk to backend

// 🌐 Create an HTTP server to work with WebSocket
const server = http.createServer(app);

// 🔌 Create a WebSocket server on top of HTTP
const wss = new WebSocketServer({ server });

// 🎧 Listen for WebSocket connections
wss.on("connection", (socket) => {
  console.log("✅ A user connected");

  // 🔁 When a message is received, send it to everyone else
  socket.on("message", (data) => {
    console.log("📩 Received:", data.toString());

    wss.clients.forEach((client) => {
      if (client !== socket && client.readyState === 1) {
        client.send(data); // Send to others
      }
    });
  });

  // ❌ User disconnected
  socket.on("close", () => {
    console.log("❌ A user disconnected");
  });
});

// 🚀 Start the server
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
