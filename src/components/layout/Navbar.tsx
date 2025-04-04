
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLoginClick = () => {
    navigate("/auth?mode=login");
  };

  return (
    <nav className="bg-white border-b p-4 flex justify-between items-center shadow-md sticky top-0 z-50">
      {/* Logo */}
      <Link to="/">
        <div className="text-2xl font-bold text-blue-600">
          RoadSync
        </div>
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex space-x-6">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">
              <button className="hover:underline">Dashboard</button>
            </Link>
            <Link to="/shipments">
              <button className="hover:underline">
                {user?.role === "shipper" ? "My Shipments" : "Available Loads"}
              </button>
            </Link>
          </>
        ) : (
          <Link to="/shipments">
            <button className="hover:underline">Browse Loads</button>
          </Link>
        )}
        <Link to="/carriers">
          <button className="hover:underline">Carriers</button>
        </Link>
      </div>

      {/* Login/Logout Button */}
      <div className="flex space-x-4">
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <Link to="/profile" className="hidden md:flex items-center space-x-1 hover:underline">
              <span>{user?.name}</span>
            </Link>
            <Button onClick={handleLogout} className="bg-blue-600 hover:bg-blue-700">
              Logout
            </Button>
          </div>
        ) : (
          <Button onClick={handleLoginClick} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
            Login
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
