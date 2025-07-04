import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; //use our new context

interface DropdownItem {
  label: string;
  path: string;
  isButton?: boolean;
  roles?: string[];
}

export default function Navbar() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { user, logout } = useAuth(); //Pull from AuthContext
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!user;
  const userRole = user?.role || '';
  const userName = user?.email || 'Account';

  const baseDropdownItems: DropdownItem[] = [
    { label: 'Saved homes', path: 'saved-homes' },
    { label: 'Saved searches', path: 'saved-searches' },
    { label: 'Inbox', path: 'inbox' },
    { label: 'Manage tours', path: 'manage-tours', roles: ['Landlord'] },
    { label: 'Recently Viewed', path: 'recently-viewed' },
    { label: 'Your team', path: 'your-team', roles: ['Landlord'] },
    { label: 'Your home', path: 'your-home' },
    { label: 'Renter Hub', path: 'renter-hub', roles: ['Tenant'] },
    { label: 'Account settings', path: 'profile' },
    { label: 'Sign out', path: '', isButton: true },
  ];

  const dropdownItems: DropdownItem[] = baseDropdownItems
    .filter((item) => !item.roles || item.roles.includes(userRole))
    .map((item) => ({
      ...item,
      path: item.isButton || !userRole ? item.path : `/${userRole.toLowerCase()}/${item.path}`,
    }));

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className={`w-full ${isHomePage ? 'absolute top-0 left-0 z-50 bg-transparent' : 'bg-white shadow-sm'} flex flex-col`}>
      <div className="px-4 md:px-8 py-6 flex items-center justify-between border-b border-white/30 relative bg-transparent md:bg-white">
        <button
          className="block md:hidden text-white md:text-gray-700 text-2xl"
          onClick={() => setMobileMenuOpen(true)}
        >
          ☰
        </button>

        <div className="hidden md:flex gap-6 items-center text-lg font-medium ml-12 text-gray-700">
          <Link to="/agents" className="hover:text-blue-700">Buy</Link>
          <Link to="/tours" className="hover:text-blue-700">Rent</Link>
          <Link to="/loans" className="hover:text-blue-700">Sell</Link>
          <Link to="/homes" className="hover:text-blue-700">Agent</Link>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link to="/" className="text-2xl font-bold text-white md:text-blue-700">RentalWise</Link>
        </div>

        <div className="hidden md:flex gap-6 items-center text-lg font-medium mr-12 text-gray-700">
          <Link to="/landlord" className="hover:text-blue-700">Manage Rentals</Link>
          <Link to="/tours" className="hover:text-blue-700">Help</Link>

          {!isAuthenticated ? (
            <Link to="/login" className="hover:text-blue-700">Sign In</Link>
          ) : (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center hover:text-blue-700"
              >
                {userName}
                <span className="ml-1">▾</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black border border-gray-200 rounded-md shadow-lg z-10">
                  {dropdownItems.map((item) =>
                    item.isButton ? (
                      <button
                        key={item.label}
                        onClick={() => {
                          logout(); // 🔐 calls AuthContext logout
                          setDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <Link
                        key={item.label}
                        to={item.path}
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        {item.label}
                      </Link>
                    )
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white text-black p-6 flex flex-col space-y-5 overflow-auto">
          <button
            className="self-end text-3xl text-gray-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            ✕
          </button>

          <Link to="/agents" onClick={() => setMobileMenuOpen(false)}>Buy</Link>
          <Link to="/tours" onClick={() => setMobileMenuOpen(false)}>Rent</Link>
          <Link to="/loans" onClick={() => setMobileMenuOpen(false)}>Sell</Link>
          <Link to="/homes" onClick={() => setMobileMenuOpen(false)}>Homes</Link>
          <Link to="/agents" onClick={() => setMobileMenuOpen(false)}>Agents</Link>
          <Link to="/tours" onClick={() => setMobileMenuOpen(false)}>Tours</Link>
          <Link to="/loans" onClick={() => setMobileMenuOpen(false)}>Loans</Link>

          {!isAuthenticated ? (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
          ) : (
            dropdownItems.map((item) =>
              item.isButton ? (
                <button
                  key={item.label}
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left"
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )
          )}
        </div>
      )}
    </nav>
  );
}
