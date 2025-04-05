
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, ShieldAlertIcon } from "lucide-react";
import { useLoad } from "@/contexts/LoadContext";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/lib/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  pickupLocation: z.string().min(3, { message: "Pickup location is required" }),
  deliveryLocation: z.string().min(3, { message: "Delivery location is required" }),
  equipmentType: z.string().min(1, { message: "Equipment type is required" }),
  weight: z.string().min(1, { message: "Load weight is required" }),
  rate: z.string().min(1, { message: "Offered rate is required" }),
  availableDate: z.date({
    required_error: "Available date is required",
  }),
  contactInfo: z.string().min(5, { message: "Valid contact information is required" }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const equipmentOptions = [
  { value: "van", label: "Van" },
  { value: "flatbed", label: "Flatbed" },
  { value: "reefer", label: "Reefer" },
  { value: "stepdeck", label: "Step Deck" },
  { value: "specialized", label: "Specialized" },
  { value: "other", label: "Other" },
];

const ShipperForm = () => {
  const { isApproved, user } = useAuth();
  const { addLoad } = useLoad();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pickupLocation: "",
      deliveryLocation: "",
      equipmentType: "",
      weight: "",
      rate: "",
      contactInfo: "",
      notes: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    if (!isApproved) {
      toast("Account Pending Approval", {
        description: "Your account must be approved before you can post loads.",
      });
      return;
    }

    if (!user) {
      toast("Authentication Required", {
        description: "You must be logged in to post loads.",
      });
      return;
    }

    // Make sure all required fields are included and not optional
    const loadId = addLoad({
      pickupLocation: data.pickupLocation,
      deliveryLocation: data.deliveryLocation,
      equipmentType: data.equipmentType,
      weight: data.weight,
      rate: data.rate,
      availableDate: data.availableDate,
      contactInfo: data.contactInfo,
      notes: data.notes || "",
      shipperId: user.id
    });

    if (loadId) {
      toast("Load Posted", {
        description: "Your load has been submitted and is pending admin approval.",
      });
      form.reset();
    }
  };

  if (!isApproved) {
    return (
      <Alert className="bg-yellow-50 border-yellow-200">
        <ShieldAlertIcon className="h-5 w-5 text-yellow-600" />
        <AlertTitle className="text-yellow-800">Account Pending Administrator Approval</AlertTitle>
        <AlertDescription className="text-yellow-700">
          Your account is currently pending review by an administrator. 
          You will be able to post loads once your account has been approved.
          This process typically takes 1-2 business days.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="pickupLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pickup Location</FormLabel>
                <FormControl>
                  <Input placeholder="City, State" {...field} />
                </FormControl>
                <FormDescription>Enter the pickup city and state</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="deliveryLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Location</FormLabel>
                <FormControl>
                  <Input placeholder="City, State" {...field} />
                </FormControl>
                <FormDescription>Enter the delivery city and state</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="equipmentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipment Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select equipment type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {equipmentOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Select the required equipment type</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Load Weight (lbs)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Weight in pounds" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rate Offered ($)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Rate in dollars" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="availableDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Available Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Date when the load will be available for pickup
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="contactInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Information</FormLabel>
                <FormControl>
                  <Input placeholder="Phone or Email" {...field} />
                </FormControl>
                <FormDescription>How carriers can contact you</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any special instructions or requirements"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <h3 className="text-sm font-medium mb-2">Note about load posting:</h3>
          <p className="text-sm text-gray-600">
            Your load will be reviewed by an administrator before it becomes visible to carriers.
            You'll receive an email notification once your load is approved or rejected.
          </p>
        </div>
        
        <Button 
          type="submit" 
          size="lg" 
          className="w-full py-6 text-lg bg-brand-blue hover:bg-brand-blue/90"
        >
          Submit Load for Approval
        </Button>
      </form>
    </Form>
  );
};

export default ShipperForm;
