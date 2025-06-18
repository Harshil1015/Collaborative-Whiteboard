// server/index.js
import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import { parse } from "url";

const roomPasswords = {
  team1: "abcd",
  "design-team": "1234",
};

const roomHistories = {}; // stores drawings
const rooms = {};

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("✅ WebSocket server running. Use frontend at http://localhost:3000");
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws, req) => {
  const { query } = parse(req.url, true);
  const roomId = query.room;
  const password = query.password;

  if (!roomId || !password || roomPasswords[roomId] !== password) {
    ws.close();
    return;
  }

  if (!rooms[roomId]) rooms[roomId] = new Set();
  rooms[roomId].add(ws);
  ws.roomId = roomId;

  // Send existing history to new user
  if (roomHistories[roomId]) {
    roomHistories[roomId].forEach((draw) => {
      ws.send(JSON.stringify(draw));
    });
  }

  ws.on("message", (message) => {
    let data;
    try {
      data = JSON.parse(message);
    } catch (e) {
      return;
    }

    // Save to history
    if (!roomHistories[roomId]) roomHistories[roomId] = [];
    roomHistories[roomId].push(data);

    // Broadcast to others
    rooms[roomId].forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });

  ws.on("close", () => {
    rooms[roomId].delete(ws);
    if (rooms[roomId].size === 0) {
      delete rooms[roomId];
    }
  });
});

server.listen(8080, () => {
  console.log("🚀 Server listening at http://localhost:8080");
});
