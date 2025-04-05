
import React, { useState, useEffect } from "react";
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
import { CheckCircle, XCircle, Eye, RefreshCw, AlertTriangle, UserMinus } from "lucide-react";
import { User, ApprovalStatus } from "@/types/auth.types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/lib/sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UserTableProps {
  users: User[];
  onApprove: (userId: string, userName: string) => void;
  onReject: (userId: string, userName: string) => void;
  onRestore: (userId: string, userName: string, newStatus: ApprovalStatus) => void;
  onRemove: (userId: string, userName: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onApprove, onReject, onRestore, onRemove }) => {
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [restoreStatus, setRestoreStatus] = useState<ApprovalStatus>("pending");
  const [confirmRemoveUser, setConfirmRemoveUser] = useState<User | null>(null);

  useEffect(() => {
    console.log("UserTable received users:", users.length);
    const pendingUsers = users.filter(u => u.approvalStatus === "pending");
    const approvedUsers = users.filter(u => u.approvalStatus === "approved");
    const rejectedUsers = users.filter(u => u.approvalStatus === "rejected");
    console.log(`UserTable users by status: pending=${pendingUsers.length}, approved=${approvedUsers.length}, rejected=${rejectedUsers.length}`);
    
    if (pendingUsers.length > 0) {
      console.log("Pending users details:", pendingUsers);
    }
  }, [users]);

  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return "N/A";
    return format(new Date(timestamp), "MMM dd, yyyy");
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="default" className="bg-green-500">Approved</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-400 text-yellow-900">Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const showRestoreOptions = (user: User) => {
    setViewUser({ ...user, _showRestoreOptions: true });
  };

  const handleRestore = (userId: string, userName: string) => {
    onRestore(userId, userName, restoreStatus);
    setViewUser(null); // Close dialog after restore
    toast.success(`User ${userName} has been restored with status: ${restoreStatus}`);
  };
  
  const handleRemoveConfirm = () => {
    if (confirmRemoveUser) {
      onRemove(confirmRemoveUser.id, confirmRemoveUser.name || confirmRemoveUser.email);
      setConfirmRemoveUser(null); // Close confirmation dialog
    }
  };

  // No users message
  if (users.length === 0) {
    return (
      <Alert className="mb-4 bg-blue-50 border-blue-200">
        <AlertTriangle className="h-4 w-4 text-blue-700" />
        <AlertDescription className="text-blue-700">
          No users found matching the current filters. Try adjusting your filters or adding new users.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Business/Info</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className={`group hover:bg-muted/50 ${user.approvalStatus === "pending" ? "bg-yellow-50" : ""}`}>
                <TableCell className="font-mono text-xs">{user.id.substring(0, 8)}</TableCell>
                <TableCell className="font-medium">{user.name || "N/A"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "shipper" ? "secondary" : "default"}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{getStatusBadge(user.approvalStatus)}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {user.role === "carrier" ? (
                    <>
                      {user.dotNumber && <span className="mr-2">DOT: {user.dotNumber}</span>}
                      {user.mcNumber && <span>MC: {user.mcNumber}</span>}
                    </>
                  ) : (
                    <>{user.businessName || "N/A"}</>
                  )}
                </TableCell>
                <TableCell>
                  {user.registrationDate ? formatDate(user.registrationDate) : "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setViewUser(user)}
                      className="flex items-center"
                    >
                      <Eye className="mr-1 h-4 w-4" /> View
                    </Button>
                    
                    {/* New Remove button */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50 flex items-center"
                      onClick={() => setConfirmRemoveUser(user)}
                    >
                      <UserMinus className="mr-1 h-4 w-4" /> Remove
                    </Button>
                    
                    {user.approvalStatus === "pending" && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => onApprove(user.id, user.name || user.email)}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onReject(user.id, user.name || user.email)}
                        >
                          <XCircle className="mr-1 h-4 w-4" /> Reject
                        </Button>
                      </>
                    )}
                    
                    {user.approvalStatus === "rejected" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center border-amber-500 text-amber-600 hover:bg-amber-50"
                        onClick={() => showRestoreOptions(user)}
                      >
                        <RefreshCw className="mr-1 h-4 w-4" /> Restore
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* User details dialog */}
      <Dialog open={!!viewUser} onOpenChange={() => setViewUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">User Profile</DialogTitle>
            <DialogDescription>
              User ID: {viewUser?.id}
            </DialogDescription>
          </DialogHeader>
          
          {viewUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Basic Information</h3>
                  <div className="grid gap-1 mt-1">
                    <div>
                      <span className="font-medium">Name:</span> {viewUser.name || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {viewUser.email}
                    </div>
                    <div>
                      <span className="font-medium">Role:</span> {viewUser.role}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> {viewUser.approvalStatus}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {viewUser.phone || "N/A"}
                    </div>
                  </div>
                </div>

                {viewUser.role === "shipper" ? (
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Shipper Information</h3>
                    <div className="grid gap-1 mt-1">
                      <div>
                        <span className="font-medium">Business Name:</span> {viewUser.businessName || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Address:</span> {viewUser.address || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">City:</span> {viewUser.city || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Description:</span> {viewUser.description || "N/A"}
                      </div>
                    </div>
                  </div>
                ) : viewUser.role === "carrier" ? (
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Carrier Information</h3>
                    <div className="grid gap-1 mt-1">
                      <div>
                        <span className="font-medium">DOT Number:</span> {viewUser.dotNumber || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">MC Number:</span> {viewUser.mcNumber || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Equipment Type:</span> {viewUser.equipmentType || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Max Weight:</span> {viewUser.maxWeight ? `${viewUser.maxWeight} lbs` : "N/A"}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="mt-2">
                <h3 className="font-medium text-sm text-muted-foreground">Status Information</h3>
                <div className="grid gap-1 mt-1">
                  <div>
                    <span className="font-medium">Approval Status:</span> {getStatusBadge(viewUser.approvalStatus)}
                  </div>
                  <div>
                    <span className="font-medium">Registration Date:</span> {viewUser.registrationDate ? formatDate(viewUser.registrationDate) : "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Approval Date:</span> {viewUser.approvalDate ? formatDate(viewUser.approvalDate) : "Not yet approved"}
                  </div>
                  {viewUser.rejectionDate && (
                    <div>
                      <span className="font-medium">Rejection Date:</span> {formatDate(viewUser.rejectionDate)}
                    </div>
                  )}
                  {viewUser.restorationDate && (
                    <div>
                      <span className="font-medium">Last Restored:</span> {formatDate(viewUser.restorationDate)}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                {/* Remove button in user profile */}
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 flex items-center"
                  onClick={() => {
                    setViewUser(null);
                    setConfirmRemoveUser(viewUser);
                  }}
                >
                  <UserMinus className="mr-1 h-4 w-4" /> Remove User
                </Button>
                
                {viewUser.approvalStatus === "pending" && (
                  <>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        onApprove(viewUser.id, viewUser.name || viewUser.email);
                        setViewUser(null);
                      }}
                    >
                      <CheckCircle className="mr-1 h-4 w-4" /> Approve User
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        onReject(viewUser.id, viewUser.name || viewUser.email);
                        setViewUser(null);
                      }}
                    >
                      <XCircle className="mr-1 h-4 w-4" /> Reject User
                    </Button>
                  </>
                )}
              </div>
              
              {(viewUser.approvalStatus === "rejected" || viewUser._showRestoreOptions) && (
                <div className="border rounded-md p-4 bg-amber-50 mt-4">
                  <h3 className="font-medium mb-2">Restore User</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose a status to restore this user to:
                  </p>
                  <div className="flex items-center gap-4">
                    <Select
                      value={restoreStatus}
                      onValueChange={(value) => setRestoreStatus(value as ApprovalStatus)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending Review</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={() => handleRestore(viewUser.id, viewUser.name || viewUser.email)}
                      className="bg-amber-500 hover:bg-amber-600"
                    >
                      <RefreshCw className="mr-1 h-4 w-4" /> Restore User
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Remove User Confirmation Dialog */}
      <Dialog 
        open={!!confirmRemoveUser} 
        onOpenChange={(open) => !open && setConfirmRemoveUser(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-red-600">Remove User</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this user? They will be stored and can be restored later.
            </DialogDescription>
          </DialogHeader>
          
          {confirmRemoveUser && (
            <div className="py-4">
              <div className="mb-4 p-3 border rounded bg-gray-50">
                <p><span className="font-medium">Name:</span> {confirmRemoveUser.name || "N/A"}</p>
                <p><span className="font-medium">Email:</span> {confirmRemoveUser.email}</p>
                <p><span className="font-medium">Role:</span> {confirmRemoveUser.role}</p>
                <p><span className="font-medium">Status:</span> {confirmRemoveUser.approvalStatus}</p>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setConfirmRemoveUser(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleRemoveConfirm}
                >
                  Remove User
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
