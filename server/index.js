import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import { parse } from "url";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(
    "🖊️ WebSocket server is running. Use the frontend at http://localhost:3000/"
  );
});

const wss = new WebSocketServer({ server });

const rooms = {};

wss.on("connection", (ws, req) => {
  const parameters = parse(req.url, true);
  const roomId = parameters.query.room;

  if (!roomId) {
    ws.close();
    return;
  }

  if (!rooms[roomId]) rooms[roomId] = new Set();
  rooms[roomId].add(ws);
  ws.roomId = roomId;

  console.log(`✅ A client connected to room: ${roomId}`);

  ws.on("message", (message) => {
    let data;
    try {
      data = JSON.parse(message);
    } catch (err) {
      console.error("Invalid JSON:", err);
      return;
    }

    rooms[roomId].forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });

  ws.on("close", () => {
    console.log(`❌ A client disconnected from room: ${roomId}`);
    rooms[roomId].delete(ws);
    if (rooms[roomId].size === 0) {
      delete rooms[roomId];
    }
  });
});

server.listen(8080, () => {
  console.log("🚀 HTTP:     http://localhost:8080");
  console.log("📡 WebSocket: ws://localhost:8080");
});
