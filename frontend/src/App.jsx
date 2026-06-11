import { BrowserRouter, Routes, Route } from "react-router-dom";
import "../src/index.css"
import Dashboard from "./pages/Dashboard";


function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

