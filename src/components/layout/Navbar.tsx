
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Truck, Package, UserCircle, LogOut, Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 w-full bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          {user?.role === "driver" ? (
            <Truck className="h-6 w-6 text-brand-blue" />
          ) : (
            <Package className="h-6 w-6 text-brand-blue" />
          )}
          <span className="text-xl font-bold text-brand-blue">RoadSync</span>
        </Link>

        {/* Mobile menu button */}
        <button 
          className="block md:hidden" 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-brand-darkGray" />
          ) : (
            <Menu className="h-6 w-6 text-brand-darkGray" />
          )}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="text-brand-darkGray hover:text-brand-blue transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/shipments"
                className="text-brand-darkGray hover:text-brand-blue transition-colors"
              >
                {user?.role === "shipper" ? "My Shipments" : "Available Loads"}
              </Link>
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center space-x-1 text-brand-darkGray hover:text-brand-blue transition-colors"
                >
                  <UserCircle className="h-5 w-5" />
                  <span>{user?.name}</span>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/auth?mode=login"
                className="text-brand-darkGray hover:text-brand-blue transition-colors"
              >
                Login
              </Link>
              <Button
                variant="default"
                onClick={() => navigate("/auth?mode=register")}
              >
                Sign Up
              </Button>
            </>
          )}
        </nav>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md p-4 flex flex-col space-y-4 border-t">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-brand-darkGray hover:text-brand-blue transition-colors py-2 px-4"
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
                <Link
                  to="/shipments"
                  className="text-brand-darkGray hover:text-brand-blue transition-colors py-2 px-4"
                  onClick={toggleMenu}
                >
                  {user?.role === "shipper" ? "My Shipments" : "Available Loads"}
                </Link>
                <Link
                  to="/profile"
                  className="text-brand-darkGray hover:text-brand-blue transition-colors py-2 px-4"
                  onClick={toggleMenu}
                >
                  Profile
                </Link>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="w-full justify-center"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/auth?mode=login"
                  className="text-brand-darkGray hover:text-brand-blue transition-colors py-2 px-4"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Button
                  variant="default"
                  onClick={() => {
                    navigate("/auth?mode=register");
                    toggleMenu();
                  }}
                  className="w-full justify-center"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
