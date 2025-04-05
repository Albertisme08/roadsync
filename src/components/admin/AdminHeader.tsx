
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "@/lib/sonner";

interface AdminHeaderProps {
  userCounts: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  isRefreshing: boolean;
  onRefresh: () => boolean;
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  userCounts, 
  isRefreshing, 
  onRefresh,
  onLogout 
}) => {
  const handleRefresh = () => {
    const showToast = onRefresh();
    if (showToast) {
      toast("Refreshed", {
        description: "User list has been refreshed.",
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users and platform access</p>
        <p className="text-sm text-gray-500 mt-1">
          Total users: {userCounts.total} | 
          Pending: {userCounts.pending} | 
          Approved: {userCounts.approved} | 
          Rejected: {userCounts.rejected}
        </p>
      </div>
      <div className="flex gap-2 mt-4 md:mt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={onLogout}
          className="flex items-center gap-1"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};
