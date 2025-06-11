import express from "express";
import http from "http";
import cors from "cors";
import { WebSocketServer } from "ws";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("✅ A client connected");

  ws.on("message", (data) => {
    console.log("📩 Received:", data.toString());

    // Broadcast to others
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === 1) {
        client.send(data);
      }
    });
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`🚀 HTTP:     http://localhost:${PORT}`);
  console.log(`📡 WebSocket: ws://localhost:${PORT}`);
});
