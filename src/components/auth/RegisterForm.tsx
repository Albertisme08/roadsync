
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/lib/sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { registerSchema, RegisterFormValues, validateCarrierData } from "./validationSchemas";
import { Textarea } from "@/components/ui/textarea";
import { UserRole } from "@/types/auth.types";

// Format phone number as (XXX) XXX-XXXX
const formatPhoneNumber = (value: string): string => {
  if (!value) return value;
  
  // Remove all non-digit characters
  const phoneNumber = value.replace(/\D/g, '');
  
  // Limit to 10 digits
  const truncated = phoneNumber.substring(0, 10);
  
  // Format the phone number
  if (truncated.length < 4) {
    return truncated;
  } else if (truncated.length < 7) {
    return `(${truncated.substring(0, 3)}) ${truncated.substring(3)}`;
  }
  return `(${truncated.substring(0, 3)}) ${truncated.substring(3, 6)}-${truncated.substring(6)}`;
};

const RegisterForm: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: undefined as unknown as "shipper" | "carrier", // Start with no role selected
      businessName: "",
      description: "",
      phone: "",
      city: "",
      address: "",
      dotNumber: "",
      mcNumber: "",
      equipmentType: "",
      maxWeight: "",
    },
    mode: "onChange",
  });

  const selectedRole = form.watch("role");

  const handleRegister = async (values: RegisterFormValues) => {
    setSubmitting(true);
    try {
      // Validate carrier data manually
      const validatedData = validateCarrierData(values);
      
      // Extract common fields
      const commonData = {
        name: validatedData.name, 
        email: validatedData.email, 
        password: validatedData.password, 
        role: validatedData.role as UserRole,
        businessName: validatedData.businessName,
        phone: validatedData.phone,
        description: validatedData.description || ""
      };
      
      // Add role-specific data
      if (validatedData.role === "carrier") {
        const carrierData = validatedData as typeof carrierSchema._type;
        await register(
          commonData.name,
          commonData.email,
          commonData.password,
          commonData.role,
          commonData.businessName,
          carrierData.dotNumber || "",
          carrierData.mcNumber || "",
          commonData.phone,
          commonData.description,
          undefined,
          undefined,
          carrierData.equipmentType,
          carrierData.maxWeight
        );
      } else {
        // Shipper data
        const shipperData = validatedData as typeof shipperSchema._type;
        await register(
          commonData.name,
          commonData.email,
          commonData.password,
          commonData.role,
          commonData.businessName,
          shipperData.dotNumber || "",
          shipperData.mcNumber || "",
          commonData.phone,
          commonData.description,
          shipperData.city,
          shipperData.address
        );
      }
      
      toast.success("Registration successful. Your account is pending approval.");
      navigate("/dashboard");
    } catch (error) {
      console.error("Register error:", error);
      toast.error("Failed to register. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Phone number input change handler
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    onChange(formattedValue);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleRegister)}
        className="space-y-4"
      >
        {/* Personal Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Personal Information</h3>
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number<span className="text-red-500 ml-1">*</span></FormLabel>
                <FormControl>
                  <Input 
                    placeholder="(555) 123-4567" 
                    {...field}
                    onChange={(e) => handlePhoneChange(e, field.onChange)}
                    inputMode="numeric"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Business Information Section */}
        <div className="space-y-4 pt-2">
          <h3 className="text-lg font-medium">Business Information</h3>
          
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>I am a<span className="text-red-500 ml-1">*</span></FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="shipper">Shipper</SelectItem>
                    <SelectItem value="carrier">Carrier</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name<span className="text-red-500 ml-1">*</span></FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your company name"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedRole === "shipper" && (
            <>
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City<span className="text-red-500 ml-1">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Your city" 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Your address" 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your business"
                    className="min-h-[100px]"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedRole === "carrier" && (
            <>
              <FormField
                control={form.control}
                name="mcNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MC Number {selectedRole === "carrier" && <span className="text-sm text-gray-500">(Required: Enter either MC or DOT)</span>}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="MC-12345678" 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dotNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DOT Number {selectedRole === "carrier" && <span className="text-sm text-gray-500">(Required: Enter either MC or DOT)</span>}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="12345678" 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="equipmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipment Type<span className="text-red-500 ml-1">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Flatbed, Van, Reefer, etc." 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Weight Capacity (lbs)<span className="text-red-500 ml-1">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="40000" 
                        {...field}
                        value={field.value || ""}
                        inputMode="numeric"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
