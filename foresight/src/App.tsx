import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/layout";
import { useAuthStore } from "./components/zustand/store";
import CustomerRisk from "./pages/CustomerRisk";
import Dashboard from "./pages/Dashboard";
import Loans from "./pages/Loans";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

function App() {
  const token = useAuthStore((state) => state.token);

  return (
    <Routes>
      {/* Public/Auth routes */}
      <Route
        path="/login"
        element={token ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      {/* Protected routes */}
      <Route
        element={
          token ? <Layout /> : <Navigate to="/login" replace />
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/risk" element={<CustomerRisk />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

export default App;
