import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Whiteboard from "./Whiteboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/room/:roomId" element={<Whiteboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
