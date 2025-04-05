
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  status: "pending" | "approved" | "rejected";
  showBadge?: boolean;
}

const StatusInput = React.forwardRef<HTMLInputElement, StatusInputProps>(
  ({ className, status, showBadge = true, ...props }, ref) => {
    const getBadgeVariant = () => {
      switch (status) {
        case "approved":
          return "bg-green-500 text-white";
        case "pending":
          return "bg-yellow-400 text-yellow-900";
        case "rejected":
          return "bg-red-500 text-white";
        default:
          return "";
      }
    };

    const getStatusText = () => {
      switch (status) {
        case "approved":
          return "Approved";
        case "pending":
          return "Pending Approval";
        case "rejected":
          return "Rejected";
        default:
          return "";
      }
    };

    return (
      <div className="relative">
        <Input
          ref={ref}
          readOnly
          className={cn(
            "pr-24", // Add padding for the badge
            className
          )}
          {...props}
        />
        {showBadge && (
          <Badge
            className={cn(
              "absolute right-2 top-1/2 transform -translate-y-1/2",
              getBadgeVariant()
            )}
          >
            {getStatusText()}
          </Badge>
        )}
      </div>
    );
  }
);

StatusInput.displayName = "StatusInput";

export { StatusInput };
