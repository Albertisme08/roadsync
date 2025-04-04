
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, ShieldAlert } from "lucide-react";
import { toast } from "@/lib/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Shipment } from "./ShipmentCard";
import CityAutosuggest from "@/components/common/CityAutosuggest";
import FreightTypeAutosuggest from "@/components/common/FreightTypeAutosuggest";

const shipmentSchema = z.object({
  origin: z.string().min(3, { message: "Origin must be at least 3 characters" }),
  destination: z.string().min(3, { message: "Destination must be at least 3 characters" }),
  date: z.string().min(1, { message: "Pickup date is required" }),
  deliveryDate: z.string().min(1, { message: "Delivery date is required" }),
  freight: z.string().min(3, { message: "Freight description is required" }),
  weight: z.string().min(1, { message: "Weight is required" }),
  price: z.string().min(1, { message: "Price is required" }),
  notes: z.string().optional(),
})
.refine(data => new Date(data.deliveryDate) > new Date(data.date), {
  message: "Delivery date must be after pickup date",
  path: ["deliveryDate"]
});

type ShipmentFormValues = z.infer<typeof shipmentSchema>;

interface CreateShipmentFormProps {
  onShipmentCreated: (shipment: Shipment) => void;
}

const CreateShipmentForm: React.FC<CreateShipmentFormProps> = ({ onShipmentCreated }) => {
  const [submitting, setSubmitting] = useState(false);
  const { user, isApproved } = useAuth();

  const form = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      origin: "",
      destination: "",
      date: "",
      deliveryDate: "",
      freight: "",
      weight: "",
      price: "",
      notes: "",
    },
  });

  const onSubmit = async (values: ShipmentFormValues) => {
    if (!user) {
      toast.error("You must be logged in to create a shipment");
      return;
    }

    if (!isApproved) {
      toast.error("Your account must be approved to create shipments");
      return;
    }

    setSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new shipment (mockup for demo)
      const newShipment: Shipment = {
        id: Math.random().toString(36).substring(2, 9),
        origin: values.origin,
        destination: values.destination,
        date: values.date,
        deliveryDate: values.deliveryDate,
        freight: values.freight,
        weight: values.weight,
        price: parseFloat(values.price),
        status: "pending",
      };
      
      onShipmentCreated(newShipment);
      form.reset();
      toast.success("Shipment created successfully!");
    } catch (error) {
      console.error("Error creating shipment:", error);
      toast.error("Failed to create shipment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isApproved) {
    return (
      <Alert className="bg-yellow-50 border-yellow-200">
        <ShieldAlert className="h-5 w-5 text-yellow-600" />
        <AlertTitle className="text-yellow-800">Account Pending Approval</AlertTitle>
        <AlertDescription className="text-yellow-700">
          Your account is currently pending administrator approval. You will be able to create shipments once an administrator reviews and approves your account.
          This typically takes 24-48 hours. You'll be notified when your account is approved.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Shipment</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origin</FormLabel>
                    <CityAutosuggest
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="e.g. New York, NY"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <CityAutosuggest
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="e.g. Los Angeles, CA"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pickup Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (lbs)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 5000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 1500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="freight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Freight Type</FormLabel>
                  <FreightTypeAutosuggest
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="e.g. Dry Goods, Refrigerated, Construction"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any special instructions or requirements..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Shipment...
                </>
              ) : (
                "Create Shipment"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateShipmentForm;
