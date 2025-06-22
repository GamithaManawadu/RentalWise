import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

type DecodedToken = {
  name?: string;
  email?: string;
  role?: string;
  exp?: number;
};

type DropdownItem = {
  label: string;
  path: string;
  isButton?: boolean;
};

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dropdownItems: DropdownItem[] = [
    { label: 'Saved homes', path: '/saved-homes' },
    { label: 'Saved searches', path: '/saved-searches' },
    { label: 'Inbox', path: '/inbox' },
    { label: 'Manage tours', path: '/manage-tours' },
    { label: 'Recently Viewed', path: '/recently-viewed' },
    { label: 'Your team', path: '/your-team' },
    { label: 'Your home', path: '/your-home' },
    { label: 'Renter Hub', path: '/renter-hub' },
    { label: 'Account settings', path: '/account-settings' },
    { label: 'Sign out', path: '', isButton: true },
  ];

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
        try {
          const decoded: DecodedToken = jwtDecode(token);
          setUserName(decoded.name || decoded.email || 'Account');
        } catch (err) {
          console.error('Invalid token:', err);
        }
      } else {
        setIsAuthenticated(false);
        setUserName('');
      }
    };

    checkAuth();
    window.addEventListener('authChanged', checkAuth);
    return () => window.removeEventListener('authChanged', checkAuth);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('authChanged'));
    setDropdownOpen(false);
  };

  return (
    <nav className="w-full flex flex-col">
      {/* Wrapper with background image */}
      <div
        className="w-full bg-cover bg-center bg-no-repeat text-white"
        style={{ backgroundImage: `url('/images/hero.jpg')` }}
      >
        {/* Top Row */}
        <div className="px-4 md:px-8 py-6 flex items-center justify-between border-b border-white/30 relative bg-transparent md:bg-white">
          {/* Hamburger Menu (Mobile) */}
          <button
            className="block md:hidden text-w text-2xl"
            onClick={() => setMobileMenuOpen(true)}
          >
            ☰
          </button>

          {/* Left Links (Desktop) */}
          <div className="hidden md:flex gap-6 items-center text-lg font-medium ml-12 text-gray-700">
            <Link to="/agents" className="hover:text-gray-200">Buy</Link>
            <Link to="/tours" className="hover:text-gray-200">Rent</Link>
            <Link to="/loans" className="hover:text-gray-200">Sell</Link>
            <Link to="/homes" className="hover:text-gray-200">Homes</Link>
          </div>

          {/* Logo - Centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link to="/" className="text-2xl font-bold text-white md:text-blue-700">RentalWise</Link>
          </div>

          {/* Right Links (Desktop) */}
          <div className="hidden md:flex gap-6 items-center text-lg font-medium mr-12 text-gray-700">
            <Link to="/agents" className="hover:text-gray-200">Agents</Link>
            <Link to="/tours" className="hover:text-gray-200">Tours</Link>
            <Link to="/loans" className="hover:text-gray-200">Loans</Link>
            {!isAuthenticated ? (
              <Link to="/login" className="hover:text-gray-200">Sign In</Link>
            ) : (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center hover:text-gray-200"
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
                          onClick={handleLogout}
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

        {/* Search Section */}
        <div className="px-4 md:px-8 py-10 md:py-20 flex flex-col items-center text-center min-h-[400px]">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 max-w-3xl">
            Let your property <br />
            adventure begin!
          </h2>

          <div className="w-full max-w-full md:max-w-xl mt-6 mb-4 md:mb-0 relative overflow-hidden">
            <input
              type="text"
              placeholder="Enter an address, neighborhood, city, or ZIP code"
              className="w-full px-4 py-5 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base text-black"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
            >
              🔍
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Mobile Menu */}
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
                    handleLogout();
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
