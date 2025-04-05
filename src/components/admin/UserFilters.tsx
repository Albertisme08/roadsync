
import React from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ApprovalStatus, UserRole } from "@/types/auth.types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface FiltersState {
  role: "all" | UserRole;
  status: "all" | ApprovalStatus;
  searchQuery: string;
}

interface UserFiltersProps {
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
  className?: string;
}

export const UserFilters: React.FC<UserFiltersProps> = ({ filters, setFilters, className }) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
  };

  const handleRoleChange = (value: string) => {
    console.log("Role changed to:", value);
    setFilters((prev) => ({ 
      ...prev, 
      role: value as "all" | UserRole
    }));
  };

  const handleStatusChange = (value: string) => {
    console.log("Status changed to:", value);
    setFilters((prev) => ({ 
      ...prev, 
      status: value as "all" | ApprovalStatus
    }));
  };

  const resetFilters = () => {
    setFilters({
      role: "all",
      status: "all",
      searchQuery: "",
    });
  };

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, business, DOT/MC number..."
            className="pl-9"
            value={filters.searchQuery}
            onChange={handleSearch}
          />
        </div>

        {/* Role filter dropdown */}
        <div className="w-full md:w-40">
          <Select 
            value={filters.role} 
            onValueChange={handleRoleChange}
            defaultValue="all"
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent position="popper" className="bg-white z-50">
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="shipper">Shippers</SelectItem>
              <SelectItem value="carrier">Carriers</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status filter dropdown */}
        <div className="w-full md:w-40">
          <Select 
            value={filters.status} 
            onValueChange={handleStatusChange}
            defaultValue="pending"
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent position="popper" className="bg-white z-50">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset button */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetFilters}
          className="md:self-center h-10"
        >
          Reset Filters
        </Button>
      </div>
    </Card>
  );
};

