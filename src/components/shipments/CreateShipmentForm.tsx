
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Shipment } from "./ShipmentCard";

const shipmentSchema = z.object({
  origin: z.string().min(3, { message: "Origin must be at least 3 characters" }),
  destination: z.string().min(3, { message: "Destination must be at least 3 characters" }),
  date: z.string().min(1, { message: "Date is required" }),
  freight: z.string().min(3, { message: "Freight description is required" }),
  weight: z.string().min(1, { message: "Weight is required" }),
  price: z.string().min(1, { message: "Price is required" }),
  notes: z.string().optional(),
});

type ShipmentFormValues = z.infer<typeof shipmentSchema>;

interface CreateShipmentFormProps {
  onShipmentCreated: (shipment: Shipment) => void;
}

const CreateShipmentForm: React.FC<CreateShipmentFormProps> = ({ onShipmentCreated }) => {
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const form = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      origin: "",
      destination: "",
      date: "",
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
                    <FormControl>
                      <Input placeholder="e.g. New York, NY" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input placeholder="e.g. Los Angeles, CA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <FormControl>
                    <Input placeholder="e.g. Dry Goods, Refrigerated, Construction" {...field} />
                  </FormControl>
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
