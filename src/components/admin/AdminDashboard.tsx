
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/lib/sonner";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserFilters } from "@/components/admin/UserFilters";
import { UserTable } from "@/components/admin/UserTable";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAdminUsers } from "@/hooks/useAdminUsers";

export const AdminDashboard: React.FC = () => {
  const { approveUser, rejectUser, restoreUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const { 
    filteredUsers, 
    filters, 
    setFilters,
    isRefreshing,
    handleManualRefresh,
    userCounts
  } = useAdminUsers();
  
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

  const handleRestore = (userId: string, userName: string, newStatus: "pending" | "approved" | "rejected") => {
    try {
      restoreUser(userId, newStatus);
      
      const statusText = newStatus === "approved" ? "approved" : "set to pending review";
      
      toast("User Restored", {
        description: `${userName} has been restored and ${statusText}.`,
      });
    } catch (error) {
      console.error("Error restoring user:", error);
      toast("Error", {
        description: "Failed to restore user. Please try again.",
        style: { backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" },
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast("Logged out", {
      description: "You have been logged out successfully.",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Admin header with user counts and actions */}
      <AdminHeader 
        userCounts={userCounts}
        isRefreshing={isRefreshing}
        onRefresh={handleManualRefresh}
        onLogout={handleLogout}
      />

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
            onRestore={handleRestore}
          />
        </CardContent>
      </Card>
    </div>
  );
};
