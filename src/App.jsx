// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import Units from "./pages/Units";
import UnitDetail from "./pages/UnitDetail";
import AddUnit from "./pages/AddUnit";
import PriceMultiplier from "./pages/PriceMultiplier";
import Admins from "./pages/Admins";
import AdminForm from "./pages/AdminForm";
import RecoveryPass from "./pages/RecoveryPass";
import CheckIn from "./pages/CheckIn";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import "./styles/main.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/recoveryPass" element={<RecoveryPass />} />
          <Route path="/checkin/:id" element={<CheckIn />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminPanel />
              </PrivateRoute>
            }
          />
          <Route
            path="/admins"
            element={
              <PrivateRoute>
                <Admins />
              </PrivateRoute>
            }
          />
          <Route
            path="/admins/add"
            element={
              <PrivateRoute>
                <AdminForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/admins/edit/:username"
            element={
              <PrivateRoute>
                <AdminForm />
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
          <Route
            path="/price-multiplier"
            element={
              <PrivateRoute>
                <PriceMultiplier />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
