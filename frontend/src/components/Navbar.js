import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { carAPI } from '../api';
import { Search, Menu, X, User, LogOut, Heart, Settings, Car } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        searchCars();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const searchCars = async () => {
    try {
      const results = await carAPI.search(searchQuery);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleCarClick = (carId) => {
    navigate(`/car/${carId}`);
    setShowSearchResults(false);
    setSearchQuery('');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" data-testid="logo-link">
            <Car className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-gray-900">Aradaki Fark</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-xl mx-8" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="Araç ara... (marka veya model)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowSearchResults(true)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                data-testid="search-input"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto" data-testid="search-results">
                  {searchResults.map((car) => (
                    <div
                      key={car.CarID}
                      onClick={() => handleCarClick(car.CarID)}
                      className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      data-testid={`search-result-${car.CarID}`}
                    >
                      <img
                        src={car.CarPhotos}
                        alt={`${car.ArabaMarka} ${car.CarModel}`}
                        className="w-16 h-12 object-cover rounded mr-3"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {car.ArabaMarka} {car.CarModel}
                        </div>
                        <div className="text-sm text-gray-600">{car.CarPack}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/cars" className="text-gray-700 hover:text-blue-600 font-medium" data-testid="nav-cars-link">
              Tüm Araçlar
            </Link>
            <Link to="/compare" className="text-gray-700 hover:text-blue-600 font-medium" data-testid="nav-compare-link">
              Karşılaştır
            </Link>
            <Link to="/popular-comparisons" className="text-gray-700 hover:text-blue-600 font-medium" data-testid="nav-popular-link">
              Popüler
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className="flex items-center text-gray-700 hover:text-blue-600 font-medium"
                    data-testid="nav-admin-link"
                  >
                    <Settings className="w-5 h-5 mr-1" />
                    Admin
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="flex items-center text-gray-700 hover:text-blue-600 font-medium"
                  data-testid="nav-profile-link"
                >
                  <User className="w-5 h-5 mr-1" />
                  Profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-red-600 font-medium"
                  data-testid="logout-button"
                >
                  <LogOut className="w-5 h-5 mr-1" />
                  Çıkış
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                data-testid="nav-login-button"
              >
                Giriş Yap
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
            data-testid="mobile-menu-button"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Araç ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowSearchResults(true)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              {/* Mobile Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto z-50 border border-gray-300" data-testid="search-results-mobile">
                  {searchResults.map((car) => (
                    <div
                      key={car.CarID}
                      onClick={() => {
                        handleCarClick(car.CarID);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      data-testid={`search-result-mobile-${car.CarID}`}
                    >
                      <img
                        src={car.CarPhotos}
                        alt={`${car.ArabaMarka} ${car.CarModel}`}
                        className="w-16 h-12 object-cover rounded mr-3"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {car.ArabaMarka} {car.CarModel}
                        </div>
                        <div className="text-sm text-gray-600">{car.CarPack}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Link
              to="/cars"
              className="block py-2 text-gray-700 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Tüm Araçlar
            </Link>
            <Link
              to="/compare"
              className="block py-2 text-gray-700 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Karşılaştır
            </Link>
            {user ? (
              <>
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className="block py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Paneli
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profilim
                  </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-gray-700 hover:text-red-600"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block py-2 text-blue-500 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Giriş Yap
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;