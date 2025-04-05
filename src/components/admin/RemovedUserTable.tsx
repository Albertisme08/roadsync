
import React, { useState } from "react";
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
import { Eye, UserPlus } from "lucide-react";
import { User } from "@/types/auth.types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface RemovedUserTableProps {
  users: User[];
  onRestore: (userId: string, userName: string) => void;
}

export const RemovedUserTable: React.FC<RemovedUserTableProps> = ({ users, onRestore }) => {
  const [viewUser, setViewUser] = useState<User | null>(null);

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

  // No users message
  if (users.length === 0) {
    return (
      <Alert className="mb-4 bg-blue-50 border-blue-200">
        <AlertTriangle className="h-4 w-4 text-blue-700" />
        <AlertDescription className="text-blue-700">
          No removed users found. When you remove users, they will appear here.
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
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Original Status</TableHead>
              <TableHead>Removal Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="group hover:bg-muted/50">
                <TableCell className="font-medium">{user.name || "N/A"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "shipper" ? "secondary" : "default"}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{getStatusBadge(user.approvalStatus)}</TableCell>
                <TableCell>
                  {user.removedDate ? formatDate(user.removedDate) : "N/A"}
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
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 flex items-center"
                      onClick={() => onRestore(user.id, user.name || user.email)}
                    >
                      <UserPlus className="mr-1 h-4 w-4" /> Restore
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!viewUser} onOpenChange={() => setViewUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Removed User Profile</DialogTitle>
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
                      <span className="font-medium">Original Status:</span> {viewUser.approvalStatus}
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
                    <span className="font-medium">Removal Date:</span> {viewUser.removedDate ? formatDate(viewUser.removedDate) : "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Registration Date:</span> {viewUser.registrationDate ? formatDate(viewUser.registrationDate) : "N/A"}
                  </div>
                  {viewUser.approvalDate && (
                    <div>
                      <span className="font-medium">Approval Date:</span> {formatDate(viewUser.approvalDate)}
                    </div>
                  )}
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

              <div className="flex justify-end pt-4">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 flex items-center"
                  onClick={() => {
                    onRestore(viewUser.id, viewUser.name || viewUser.email);
                    setViewUser(null);
                  }}
                >
                  <UserPlus className="mr-1 h-4 w-4" /> Restore User
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
