import React, { useEffect, useRef } from "react";
import * as fabric from "fabric";
import socket from "./socket"; // WebSocket client

function App() {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    // 1. Initialize Fabric.js canvas
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: true,
      backgroundColor: "#f0f0f0",
    });

    // 2. Set brush properties
    fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
    fabricCanvas.freeDrawingBrush.color = "green";
    fabricCanvas.freeDrawingBrush.width = 4;

    // 3. Send path to WebSocket on draw
    fabricCanvas.on("path:created", (e) => {
      const pathData = e.path.toObject([
        "path",
        "stroke",
        "strokeWidth",
        "left",
        "top",
        "scaleX",
        "scaleY",
      ]);

      const message = {
        type: "draw",
        payload: pathData,
      };

      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
      }
    });

    // 4. Receive messages and draw paths
    socket.onmessage = async (event) => {
      try {
        const text = await event.data.text(); // Blob to string
        const message = JSON.parse(text);

        if (message.type === "draw" && message.payload) {
          const path = new fabric.Path(message.payload.path, {
            stroke: message.payload.stroke,
            strokeWidth: message.payload.strokeWidth,
            left: message.payload.left,
            top: message.payload.top,
            scaleX: message.payload.scaleX || 1,
            scaleY: message.payload.scaleY || 1,
            fill: null,
            selectable: false,
          });

          fabricCanvas.add(path);
          fabricCanvas.renderAll();
        }
      } catch (err) {
        console.error("❌ Failed to handle message:", err);
      }
    };

    // 5. Save canvas reference and cleanup
    fabricRef.current = fabricCanvas;

    return () => {
      fabricCanvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>🖊️ Collaborative Whiteboard</h2>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{
          border: "2px solid black",
          margin: "0 auto",
          cursor: "crosshair",
        }}
      />
      <p>🎨 Start drawing — it syncs in real-time across tabs!</p>
    </div>
  );
}

export default App;
