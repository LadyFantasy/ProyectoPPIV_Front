// App.jsx
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./pages/Login";
import Units from "./pages/Units"
import PanelAdmin from "./pages/AdminPanel";
import "./styles/main.css";

function App() {
    return (
        <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={
              <PrivateRoute>
                <PanelAdmin />
              </PrivateRoute>
            }
          />
          {/* otras rutas públicas… */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    );
}

export default App;
