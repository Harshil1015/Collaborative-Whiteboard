import React, { useLayoutEffect, useRef, useState } from "react";
import * as fabric from "fabric";

function App() {
  const containerRef = useRef(null);
  const fabricRef = useRef(null);

  const [selectedColor, setSelectedColor] = useState("#000000");
  const [selectedShape, setSelectedShape] = useState("pencil");

  useLayoutEffect(() => {
    if (!containerRef.current || fabricRef.current) return;

    const canvasEl = document.createElement("canvas");
    containerRef.current.appendChild(canvasEl);

    const canvas = new fabric.Canvas(canvasEl, {
      width: 800,
      height: 600,
      backgroundColor: "#f0f0f0",
    });

    // Set initial brush
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.color = selectedColor;

    fabricRef.current = canvas;

    return () => {
      canvas.dispose();
    };
  }, []);

  // Update brush or mode when shape/color changes
  useLayoutEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    if (selectedShape === "pencil") {
      canvas.isDrawingMode = true;

      if (!canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      }

      canvas.freeDrawingBrush.color = selectedColor;
    } else {
      canvas.isDrawingMode = false;
    }
  }, [selectedColor, selectedShape]);

  const handleAddShape = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const commonProps = {
      left: 150,
      top: 150,
      fill: selectedColor,
    };

    let shape;

    switch (selectedShape) {
      case "rect":
        shape = new fabric.Rect({ ...commonProps, width: 100, height: 60 });
        break;
      case "circle":
        shape = new fabric.Circle({ ...commonProps, radius: 40 });
        break;
      case "line":
        shape = new fabric.Line([50, 100, 200, 100], {
          stroke: selectedColor,
          strokeWidth: 3,
        });
        break;
      default:
        return;
    }

    canvas.add(shape);
    canvas.renderAll();
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "10px" }}>
        <label>
          🎨 Select Color:{" "}
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
          />
        </label>

        <label style={{ marginLeft: "20px" }}>
          🔲 Select Shape:{" "}
          <select
            value={selectedShape}
            onChange={(e) => setSelectedShape(e.target.value)}
          >
            <option value="pencil">Pencil</option>
            <option value="rect">Rectangle</option>
            <option value="circle">Circle</option>
            <option value="line">Line</option>
          </select>
        </label>

        <button
          onClick={handleAddShape}
          style={{ marginLeft: "20px", padding: "4px 10px" }}
        >
          ➕ Add Shape
        </button>
      </div>

      <div
        ref={containerRef}
        style={{
          border: "1px solid #ccc",
          width: "800px",
          height: "600px",
        }}
      />
    </div>
  );
}

export default App;
