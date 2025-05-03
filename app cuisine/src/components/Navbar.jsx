import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { Menu, X, Sun, Moon, User, LogOut, PenTool, Search } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/recipes?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
      setShowSearch(false);
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg" : "bg-transparent"}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold">
            <motion.span className="text-3xl text-rose-600 dark:text-rose-400">404</motion.span>
            <motion.span className="text-teal-600 dark:text-teal-400">.js</motion.span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {showSearch ? (
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Rechercher des recettes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10 pr-10 w-64"
                  autoFocus
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <button
                  type="button"
                  onClick={() => setShowSearch(false)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              </form>
            ) : (
              <>
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/recipes" className="nav-link">Recipes</Link>
                <button
                  onClick={() => setShowSearch(true)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>
              </>
            )}

            {user ? (
              <>
                {isAdmin && (
                  <>
                    <Link to="/add-recipe" className="nav-link">
                      <PenTool size={18} className="inline mr-1" /> Add Recipe
                    </Link>
                    <Link to="/admin" className="nav-link text-red-500">
                      Admin
                    </Link>
                  </>
                )}
                <div className="relative group">
                  <button className="flex items-center nav-link">
                    <User size={18} className="inline mr-1" /> {user.username}
                  </button>
                  <div className="absolute right-0 w-48 mt-2 p-2 rounded-md shadow-lg hidden group-hover:block bg-white dark:bg-gray-800 border">
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <LogOut size={18} className="inline mr-1" /> Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="btn-primary">Register</Link>
              </>
            )}

            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Toggle dark mode">
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Toggle dark mode">
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {showSearch && (
          <div className="md:hidden mt-2 mb-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Rechercher des recettes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10 pr-10 w-full"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <button
                type="button"
                onClick={() => setShowSearch(false)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="md:hidden bg-white dark:bg-gray-900 shadow-lg py-4 px-4 absolute w-full">
          <div className="flex flex-col space-y-4">
            <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/recipes" onClick={() => setIsOpen(false)}>Recipes</Link>

            {user ? (
              <>
                {isAdmin && (
                  <>
                    <Link to="/add-recipe" onClick={() => setIsOpen(false)}>
                      <PenTool size={18} className="inline mr-1" /> Add Recipe
                    </Link>
                    <Link to="/admin" onClick={() => setIsOpen(false)} className="text-red-500">Admin</Link>
                  </>
                )}
                <Link to="/profile" onClick={() => setIsOpen(false)}>
                  <User size={18} className="inline mr-1" /> Profile
                </Link>
                <button onClick={handleLogout} className="text-left text-red-600 dark:text-red-400">
                  <LogOut size={18} className="inline mr-1" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="bg-rose-600 text-white hover:bg-rose-700 px-4 py-2 rounded-md">
                  Register
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
