import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/lib/sonner";
import { Users, Archive } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserFilters } from "@/components/admin/UserFilters";
import { UserTable } from "@/components/admin/UserTable";
import { RemovedUserTable } from "@/components/admin/RemovedUserTable";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAdminUsers } from "@/hooks/useAdminUsers";

export const AdminDashboard: React.FC = () => {
  const { approveUser, rejectUser, restoreUser, removeUser, restoreRemovedUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const { 
    filteredUsers, 
    filters, 
    setFilters,
    isRefreshing,
    handleManualRefresh,
    showRemovedUsers,
    toggleShowRemovedUsers,
    userCounts
  } = useAdminUsers();
  
  const handleApprove = (userId: string, userName: string) => {
    try {
      approveUser(userId);
      
      toast.success("User Approved", {
        description: `${userName} has been approved and notified via email. They now have full access to platform features.`,
      });
      
      // Log for demonstration purposes
      console.log(`Admin action: Approved user ${userName} (${userId}). User now has full platform access.`);
    } catch (error) {
      console.error("Error approving user:", error);
      toast.error("Error", {
        description: "Failed to approve user. Please try again.",
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

  const handleRemove = (userId: string, userName: string) => {
    try {
      removeUser(userId);
      
      toast("User Removed", {
        description: `${userName} has been removed from active users.`,
      });
    } catch (error) {
      console.error("Error removing user:", error);
      toast("Error", {
        description: "Failed to remove user. Please try again.",
        style: { backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" },
      });
    }
  };

  const handleRestoreRemovedUser = (userId: string, userName: string) => {
    try {
      restoreRemovedUser(userId);
      
      toast("User Restored", {
        description: `${userName} has been restored from removed users.`,
      });
    } catch (error) {
      console.error("Error restoring removed user:", error);
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
      <AdminHeader 
        userCounts={userCounts}
        isRefreshing={isRefreshing}
        onRefresh={handleManualRefresh}
        onLogout={handleLogout}
      />

      <div className="mb-4 flex justify-end">
        <Button 
          onClick={toggleShowRemovedUsers} 
          variant="outline"
          className={`flex items-center ${showRemovedUsers ? 'bg-blue-50 border-blue-200' : ''}`}
        >
          <Archive className="mr-2 h-4 w-4" />
          {showRemovedUsers ? 'Show Active Users' : 'Show Past Users'}
          {userCounts.removed > 0 && !showRemovedUsers && (
            <Badge variant="secondary" className="ml-2">{userCounts.removed}</Badge>
          )}
        </Button>
      </div>

      {!showRemovedUsers && (
        <>
          <UserFilters 
            filters={filters}
            setFilters={setFilters}
            className="mb-6"
          />

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
                onRemove={handleRemove}
              />
            </CardContent>
          </Card>
        </>
      )}

      {showRemovedUsers && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5" /> Removed Users
              </CardTitle>
              <Badge variant="outline">
                {filteredUsers.length} Removed Users
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <RemovedUserTable 
              users={filteredUsers}
              onRestore={handleRestoreRemovedUser}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
