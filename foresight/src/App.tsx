import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/layout";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Profile" element={<Profile />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
