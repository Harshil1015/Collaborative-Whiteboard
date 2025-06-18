import React, { useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Canvas, PencilBrush, util } from "fabric";
import { connectWebSocket, sendPath, onPathReceived } from "../socket";

function Whiteboard() {
  const { roomId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const password = searchParams.get("password");

  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  useEffect(() => {
    let fabricCanvas;
    const socket = connectWebSocket(roomId, password);

    // Delay setup until canvas is in the DOM
    const setupCanvas = () => {
      if (!canvasRef.current) return;

      fabricCanvas = new Canvas(canvasRef.current, {
        backgroundColor: "#f0f0f0",
        isDrawingMode: true,
      });

      const brush = new PencilBrush(fabricCanvas);
      brush.color = "green";
      brush.width = 4;
      fabricCanvas.freeDrawingBrush = brush;

      fabricRef.current = fabricCanvas;

      // When receiving drawing from others
      onPathReceived((data) => {
        if (data.type === "path" && data.path) {
          util.enlivenObjects([data.path], (objects) => {
            objects.forEach((obj) => {
              fabricCanvas.add(obj);
            });
            fabricCanvas.renderAll();
          });
        }
      });

      // When drawing a new path
      fabricCanvas.on("path:created", (e) => {
        sendPath({ type: "path", path: e.path.toObject() });
      });
    };

    // Ensure canvas is fully mounted before using
    requestAnimationFrame(setupCanvas);

    return () => {
      if (fabricCanvas) {
        fabricCanvas.dispose();
        fabricRef.current = null;
      }
    };
  }, [roomId, password]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>🖊️ Room: {roomId}</h2>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{
          border: "2px solid black",
          backgroundColor: "#f0f0f0",
          cursor: "crosshair",
        }}
      />
      <p>Room password: {password}</p>
    </div>
  );
}

export default Whiteboard;
