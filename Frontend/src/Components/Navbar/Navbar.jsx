import { Home, Menu, Package, Plus, ShoppingCart, User, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/product-entry-page", label: "Add Products", icon: Plus },
    { to: "/cart", label: "Cart", icon: ShoppingCart },
    { to: "/profile", label: "Profile", icon: User },
    { to: "/order-history", label: "Orders", icon: Package },
  ];

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-lg border-b border-gray-200">
      <div className="container-modern">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">EcoMart</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100 hover:text-purple-600"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{label}</span>
              </NavLink>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link to="/login" className="btn-outline-modern">
              Login
            </Link>
            <Link to="/signup" className="btn-gradient">
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-gray-200">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </NavLink>
            ))}

            <div className="pt-4 space-y-2 border-t border-gray-200">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center btn-outline-modern"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center btn-gradient"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
