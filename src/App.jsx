// App.jsx
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./pages/Login";
import AdminUnits from "./pages/Units"
import AdminPanel from "./pages/AdminPanel";
import "./styles/main.css";
import {AuthProvider} from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={
            <PrivateRoute>
              <AdminPanel />
            </PrivateRoute>
          } />
          <Route path="/units" element={
            <PrivateRoute>
              <AdminUnits />
            </PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
