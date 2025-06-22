import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import RoleSelect from './pages/RoleSelect';
import RegisterLandlord from './pages/Landlord/RegisterLandlord';
import RegisterTenant from './pages/Tenant/RegisterTenant';
import LandlordDashboard from './pages/Landlord/Dashboard';
import TenantDashboard from './pages/Tenant/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RoleSelect />} />
        <Route path="/register/landlord" element={<RegisterLandlord />} />
        <Route path="/register/tenant" element={<RegisterTenant />} />
        <Route path="/landlord/dashboard" element={<PrivateRoute requiredRole="landlord">
          <LandlordDashboard />
        </PrivateRoute>} />
        <Route path="/tenant/dashboard" element={<PrivateRoute requiredRole="tenant">
          <TenantDashboard />
        </PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App
