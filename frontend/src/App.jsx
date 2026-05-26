import { BrowserRouter, Routes, Route } from "react-router-dom";
import "../src/index.css"
import Dashboard from "./pages/Dashboard";
 import Reports from "./pages/Reports";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

