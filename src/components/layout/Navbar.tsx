
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Settings, LogOut, Users, Home } from "lucide-react";

const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
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
        {isAuthenticated && (
          <>
            <Link to="/dashboard">
              <button className="hover:underline">Dashboard</button>
            </Link>
            <Link to="/shipments">
              <button className="hover:underline">
                {user?.role === "shipper" ? "My Shipments" : "Available Loads"}
              </button>
            </Link>
            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-1 text-blue-600 font-medium">
                    <span>Admin</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/admin")}>
                    <Users className="mr-2 h-4 w-4" />
                    <span>User Management</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <Home className="mr-2 h-4 w-4" />
                    <span>Back to Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </>
        )}
      </div>

      {/* Login/Logout Button */}
      <div className="flex space-x-4">
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1 hover:underline">
                  <span>{user?.name}</span>
                  {user?.approvalStatus === "pending" && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full ml-2">
                      Pending Approval
                    </span>
                  )}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={handleLogout} className="bg-blue-600 hover:bg-blue-700 md:flex hidden">
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
