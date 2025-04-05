
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
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/lib/sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle } from "lucide-react";
import { registerSchema, RegisterFormValues } from "./validationSchemas";
import { Textarea } from "@/components/ui/textarea";
import { UserRole } from "@/types/auth.types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formatPhoneNumber = (value: string): string => {
  if (!value) return value;
  
  const phoneNumber = value.replace(/\D/g, '');
  
  const truncated = phoneNumber.substring(0, 10);
  
  if (truncated.length < 4) {
    return truncated;
  } else if (truncated.length < 7) {
    return `(${truncated.substring(0, 3)}) ${truncated.substring(3)}`;
  }
  return `(${truncated.substring(0, 3)}) ${truncated.substring(3, 6)}-${truncated.substring(6)}`;
};

const isValidMCNumber = (value: string): boolean => {
  return /^MC-\d{5,8}$/.test(value) || /^\d{5,8}$/.test(value);
};

const isValidDOTNumber = (value: string): boolean => {
  return /^\d{5,8}$/.test(value);
};

const RegisterForm: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [idType, setIdType] = useState<"mc" | "dot" | "none">("none");
  const { register } = useAuth();
  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: undefined as unknown as "shipper" | "carrier",
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
  const watchedMcNumber = form.watch("mcNumber");
  const watchedDotNumber = form.watch("dotNumber");

  const handleIdTypeChange = (value: "mc" | "dot" | "none") => {
    setIdType(value);
    
    if (value === "mc") {
      form.setValue("dotNumber", "");
    } else if (value === "dot") {
      form.setValue("mcNumber", "");
    } else {
      form.setValue("mcNumber", "");
      form.setValue("dotNumber", "");
    }
  };

  const handleRegister = async (values: RegisterFormValues) => {
    if (values.role === "carrier") {
      if (!values.mcNumber && !values.dotNumber) {
        toast.error("Carriers must provide either an MC number or a DOT number");
        return;
      }
      
      if (values.mcNumber && !isValidMCNumber(values.mcNumber)) {
        toast.error("Please enter a valid MC number (e.g., MC-12345678 or 12345678)");
        return;
      }
      
      if (values.dotNumber && !isValidDOTNumber(values.dotNumber)) {
        toast.error("Please enter a valid DOT number (5-8 digits)");
        return;
      }
    }
    
    setSubmitting(true);
    try {
      const commonData = {
        name: values.name, 
        email: values.email, 
        password: values.password, 
        role: values.role as UserRole,
        businessName: values.businessName,
        phone: values.phone,
        description: values.description || ""
      };
      
      if (values.role === "carrier") {
        await register(
          commonData.name,
          commonData.email,
          commonData.password,
          commonData.role,
          commonData.businessName,
          values.dotNumber || "",
          values.mcNumber || "",
          commonData.phone,
          commonData.description,
          undefined,
          undefined,
          values.equipmentType || "",
          values.maxWeight || ""
        );
      } else {
        await register(
          commonData.name,
          commonData.email,
          commonData.password,
          commonData.role,
          commonData.businessName,
          values.dotNumber || "",
          values.mcNumber || "",
          commonData.phone,
          commonData.description,
          values.city || "",
          values.address || ""
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
              <div className="space-y-4 border p-4 rounded-md bg-slate-50">
                <FormItem className="space-y-3">
                  <FormLabel>Identification Type</FormLabel>
                  <FormDescription>
                    MC/DOT numbers are optional for shippers. You may provide one if available.
                  </FormDescription>
                  <RadioGroup 
                    defaultValue={idType} 
                    onValueChange={(value) => handleIdTypeChange(value as "mc" | "dot" | "none")}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="mc" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        I have an MC Number
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="dot" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        I have a DOT Number
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="none" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        I don't have either
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                  {idType === "none" && (
                    <FormItem>
                      <FormControl>
                        <Textarea 
                          placeholder="Please describe your shipping volumes, frequency, dock facilities, and any special requirements."
                          className="min-h-[120px]"
                          onChange={(e) => {
                            form.setValue("description", e.target.value);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                </FormItem>

                <FormField
                  control={form.control}
                  name="mcNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MC Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="MC-12345678 or 12345678" 
                          {...field} 
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter your MC number with or without the "MC-" prefix
                      </FormDescription>
                      <FormMessage />
                      {watchedMcNumber && !isValidMCNumber(watchedMcNumber) && (
                        <p className="text-sm font-medium text-destructive">
                          Please enter a valid MC number (e.g., MC-12345678 or 12345678)
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dotNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>DOT Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter DOT Number" 
                          {...field} 
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter your DOT number (typically 5-8 digits)
                      </FormDescription>
                      <FormMessage />
                      {watchedDotNumber && !isValidDOTNumber(watchedDotNumber) && (
                        <p className="text-sm font-medium text-destructive">
                          Please enter a valid DOT number (5-8 digits)
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>

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
