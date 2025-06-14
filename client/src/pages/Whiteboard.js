import React, { useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import * as fabric from "fabric";
import { connectWebSocket, sendPath, onPathReceived } from "../socket";

function Whiteboard() {
  const { roomId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const password = searchParams.get("password");

  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  useEffect(() => {
    // Connect to WebSocket
    const socket = connectWebSocket(roomId, password);

    // Setup Fabric canvas
    const canvasEl = document.createElement("canvas");
    canvasEl.width = 800;
    canvasEl.height = 600;

    const fabricCanvas = new fabric.Canvas(canvasEl, {
      backgroundColor: "#f0f0f0",
      isDrawingMode: true,
    });

    if (!fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
    }

    fabricCanvas.freeDrawingBrush.color = "green";
    fabricCanvas.freeDrawingBrush.width = 4;

    // Append canvas to the div container
    canvasRef.current.innerHTML = ""; // Clear previous
    canvasRef.current.appendChild(fabricCanvas.wrapperEl);
    fabricRef.current = fabricCanvas;

    // Listen for paths drawn by others
    onPathReceived((data) => {
      if (data.type === "path" && data.path) {
        fabric.util.enlivenObjects([data.path], (objects) => {
          objects.forEach((obj) => fabricCanvas.add(obj));
          fabricCanvas.renderAll();
        });
      }
    });

    // Send path when user draws
    fabricCanvas.on("path:created", (e) => {
      const path = e.path;
      const json = path.toObject();
      sendPath({ type: "path", path: json });
    });

    // Cleanup on unmount
    return () => {
      fabricCanvas.dispose();
    };
  }, [roomId, password]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>🖊️ Room: {roomId}</h2>
      <div
        ref={canvasRef}
        style={{
          width: 800,
          height: 600,
          border: "2px solid black",
          margin: "0 auto",
        }}
      />
      <p>✅ Drawing in real-time. Room password: {password}</p>
    </div>
  );
}

export default Whiteboard;
