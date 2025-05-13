// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Units from "./pages/Units"
import "./styles/main.css";
import "./styles/layout.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/units" element={<Units />} />
      </Routes>
    </Router>
  );
}

export default App;
