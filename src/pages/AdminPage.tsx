
import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  LogOut, 
  AlertTriangle,
  Eye,
  Search,
  Filter,
  Users
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/lib/sonner";
import { format } from "date-fns";
import { UserTable } from "@/components/admin/UserTable";
import { UserFilters } from "@/components/admin/UserFilters";
import { User, ApprovalStatus, UserRole } from "@/types/auth.types";

const AdminPage = () => {
  const { user, isAdmin, allUsers, approveUser, rejectUser, logout } = useAuth();
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    role: "all" as "all" | UserRole,
    status: "all" as "all" | ApprovalStatus,
    searchQuery: "",
  });
  const navigate = useNavigate();
  
  // Apply filters whenever allUsers or filters change
  useEffect(() => {
    if (!allUsers) return;
    
    const filtered = allUsers.filter((user) => {
      // Role filter
      if (filters.role !== "all" && user.role !== filters.role) {
        return false;
      }
      
      // Status filter
      if (filters.status !== "all" && user.approvalStatus !== filters.status) {
        return false;
      }
      
      // Search query (name, email, business name, DOT/MC number)
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesQuery = 
          user.name?.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.businessName?.toLowerCase().includes(query) ||
          user.dotNumber?.includes(query) ||
          user.mcNumber?.includes(query);
          
        if (!matchesQuery) return false;
      }
      
      return true;
    });
    
    setFilteredUsers(filtered);
  }, [allUsers, filters]);
  
  const handleApprove = (userId: string, userName: string) => {
    try {
      approveUser(userId);
      
      toast("User Approved", {
        description: `${userName} has been approved and notified via email.`,
      });
    } catch (error) {
      console.error("Error approving user:", error);
      toast("Error", {
        description: "Failed to approve user. Please try again.",
        style: { backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" },
      });
    }
  };
  
  const handleReject = (userId: string, userName: string) => {
    try {
      rejectUser(userId);
      
      toast("User Rejected", {
        description: `${userName} has been rejected and notified.`,
      });
    } catch (error) {
      console.error("Error rejecting user:", error);
      toast("Error", { 
        description: "Failed to reject user. Please try again.",
        style: { backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" },
      });
    }
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    
    toast("Refreshed", {
      description: "User list has been refreshed.",
    });
    
    setTimeout(() => setIsRefreshing(false), 500);
  };
  
  const handleLogout = () => {
    logout();
    navigate("/");
    toast("Logged out", {
      description: "You have been logged out successfully.",
    });
  };
  
  if (!user) {
    // Redirect to login if not logged in
    return <Navigate to="/auth?from=/admin" replace />;
  }
  
  if (!isAdmin) {
    // Show access denied for non-admin users
    return (
      <div className="container mx-auto py-16 px-4 flex flex-col items-center justify-center min-h-[60vh]">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-center mb-2">Access Denied</h1>
        <p className="text-gray-600 text-center mb-6">
          You don't have permission to access the admin dashboard.
        </p>
        <Button onClick={() => navigate("/")} className="mt-4">
          Return to Homepage
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users and platform access</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-1"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* User filtering component */}
      <UserFilters 
        filters={filters}
        setFilters={setFilters}
        className="mb-6"
      />

      {/* User table component */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" /> User Management
            </CardTitle>
            <Badge variant="outline">
              {filteredUsers.length} Users
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <UserTable 
            users={filteredUsers} 
            onApprove={handleApprove} 
            onReject={handleReject}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
