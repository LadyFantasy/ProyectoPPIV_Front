// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import Units from "./pages/Units";
import UnitDetail from "./pages/UnitDetail";
import AddUnit from "./pages/AddUnit";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import "./styles/main.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminPanel />
              </PrivateRoute>
            }
          />
          <Route
            path="/units"
            element={
              <PrivateRoute>
                <Units />
              </PrivateRoute>
            }
          />
          <Route
            path="/units/:id"
            element={
              <PrivateRoute>
                <UnitDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/units/add"
            element={
              <PrivateRoute>
                <AddUnit />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
