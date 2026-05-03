import { Routes, Route } from "react-router-dom";
import DynamicIsland from "./components/DynamicIsland";
import Home from "./pages/Home";
import Demo from "./pages/Demo";
import Presentation from "./pages/Presentation";
import AboutMe from "./pages/AboutMe";
import Results from "./pages/Results";

function App() {
  return (
    <div className="relative min-h-screen w-full bg-white text-neutral-900 overflow-x-hidden font-mono">
      
      {/* 1. Dynamic Island at the very top */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <DynamicIsland />
      </div>

      {/* 2. Main Content Router */}
      <div className="relative z-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/presentation" element={<Presentation />} />
          <Route path="/about" element={<AboutMe />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </div>

    </div>
  );
}

export default App;
