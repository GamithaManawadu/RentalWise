import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-3 text-blue-600">RentalWise</h2>
        <h3 className="text-base font-bold mb-9 text-blue-600">Rental Manager</h3>
        <div className="space-y-4 text-gray-700 text-sm">
          <Link to="/landlord" className="block hover:text-blue-600">Dashboard</Link>
          <Link to="/landlord/properties" className="block hover:text-blue-600">My Properties</Link>
          <Link to="/landlord/tenants" className="block hover:text-blue-600">Tenants</Link>
          <Link to="/landlord/leases" className="block hover:text-blue-600">Leases</Link>
          <Link to="/landlord/settings" className="block hover:text-blue-600">Settings</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="mb-4 text-sm text-gray-600">Logged in as: <strong>{user?.email}</strong></div>
        <Outlet />
      </main>
    </div>
  );
}
