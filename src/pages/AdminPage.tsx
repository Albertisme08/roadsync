
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
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
import { CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AdminPage = () => {
  const { user, isAdmin, getPendingUsers, approveUser, rejectUser } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    if (isAdmin) {
      setPendingUsers(getPendingUsers());
    }
  }, [isAdmin, getPendingUsers]);
  
  const handleApprove = (userId: string, userName: string) => {
    approveUser(userId);
    setPendingUsers(getPendingUsers());
    
    toast({
      title: "User Approved",
      description: `${userName} has been approved and notified.`,
      variant: "default",
    });
  };
  
  const handleReject = (userId: string, userName: string) => {
    rejectUser(userId);
    setPendingUsers(getPendingUsers());
    
    toast({
      title: "User Rejected",
      description: `${userName} has been rejected and notified.`,
      variant: "default",
    });
  };
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Pending Approvals</h2>
        {pendingUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="capitalize">{user.role}</TableCell>
                    <TableCell>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        Pending
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(user.id, user.name)}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(user.id, user.name)}
                        >
                          <XCircle className="mr-1 h-4 w-4" /> Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-gray-600">No pending approvals at this time.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
