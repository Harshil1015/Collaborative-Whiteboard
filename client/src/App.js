import React, { useEffect, useRef } from "react";
import * as fabric from "fabric";

function App() {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: true,
      backgroundColor: "#f0f0f0",
    });

    fabricCanvas.freeDrawingBrush = new fabric.CircleBrush(fabricCanvas);
    fabricCanvas.freeDrawingBrush.color = "green";
    fabricCanvas.freeDrawingBrush.width = 4;

    // Optional: log drawing paths
    fabricCanvas.on("path:created", (e) => {
      console.log("New path drawn:", e.path);
    });

    fabricCanvas.renderAll();
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
          cursor: "crosshair", // Optional: visually show drawing cursor
        }}
      />
      <p>🎨 Try drawing with your mouse (green brush)</p>
    </div>
  );
}

export default App;
