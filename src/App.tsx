import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Actions from "./pages/Actions";
import EcoPet from "./pages/EcoPet";
import Rewards from "./pages/Rewards";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/actions" element={<Actions />} />
          <Route path="/ecopet" element={<EcoPet />} />
          <Route path="/rewards" element={<Rewards />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
