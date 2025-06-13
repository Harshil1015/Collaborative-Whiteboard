import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import * as fabric from "fabric";

function Whiteboard() {
  const { roomId } = useParams(); // ✅ inside component
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const socket = new WebSocket(`ws://localhost:8080?room=${roomId}`);
    socketRef.current = socket;

    const canvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: true,
      backgroundColor: "#f0f0f0",
    });

    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.color = "green";
    canvas.freeDrawingBrush.width = 4;
    fabricRef.current = canvas;

    canvas.on("path:created", (e) => {
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
        room: roomId,
        payload: pathData,
      };
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
      }
    });

    socket.onmessage = async (event) => {
      const text = await event.data.text();
      const message = JSON.parse(text);
      if (message.type === "draw" && message.room === roomId) {
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

        canvas.add(path);
        canvas.renderAll();
      }
    };

    return () => {
      socket.close();
      canvas.dispose();
    };
  }, [roomId]);

  return (
    <div>
      <h2>Room: {roomId}</h2>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: "2px solid black", marginTop: "10px" }}
      />
    </div>
  );
}

export default Whiteboard;
