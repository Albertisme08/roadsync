
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/lib/sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { registerSchema, RegisterFormValues } from "./validationSchemas";
import { UserRole } from "@/types/auth.types";
import { isValidMCNumber, isValidDOTNumber } from "./utils/formUtils";

// Import the new component sections
import PersonalInfoSection from "./sections/PersonalInfoSection";
import BusinessInfoSection from "./sections/BusinessInfoSection";
import ShipperSection from "./sections/ShipperSection";
import CarrierSection from "./sections/CarrierSection";
import ExistingUserAlert from "./sections/ExistingUserAlert";

const RegisterForm: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [existingUserAlert, setExistingUserAlert] = useState<{ show: boolean; status: string }>({ 
    show: false, 
    status: '' 
  });
  const { register, allUsers } = useAuth();
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
  const watchedEmail = form.watch("email");
  const watchedMcNumber = form.watch("mcNumber");
  const watchedDotNumber = form.watch("dotNumber");
  
  useEffect(() => {
    if (!watchedEmail || watchedEmail.trim() === '') {
      setExistingUserAlert({ show: false, status: '' });
      return;
    }
    
    const existingUser = allUsers.find(
      (user) => user.email.toLowerCase() === watchedEmail.toLowerCase()
    );
    
    if (existingUser) {
      if (existingUser.approvalStatus === "pending") {
        setExistingUserAlert({ 
          show: true, 
          status: 'pending' 
        });
        
        form.setValue("name", existingUser.name || "");
        form.setValue("role", existingUser.role as "shipper" | "carrier");
        form.setValue("businessName", existingUser.businessName || "");
        form.setValue("phone", existingUser.phone || "");
        form.setValue("description", existingUser.description || "");
        form.setValue("city", existingUser.city || "");
        form.setValue("address", existingUser.address || "");
        form.setValue("dotNumber", existingUser.dotNumber || "");
        form.setValue("mcNumber", existingUser.mcNumber || "");
        form.setValue("equipmentType", existingUser.equipmentType || "");
        form.setValue("maxWeight", existingUser.maxWeight || "");
      } else if (existingUser.approvalStatus === "approved") {
        setExistingUserAlert({ 
          show: true, 
          status: 'approved' 
        });
      } else if (existingUser.approvalStatus === "rejected") {
        setExistingUserAlert({ 
          show: true, 
          status: 'rejected' 
        });
      }
    } else {
      setExistingUserAlert({ show: false, status: '' });
    }
  }, [watchedEmail, allUsers]);

  const handleRegister = async (values: RegisterFormValues) => {
    if (values.role === "carrier") {
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
      await register(
        values.name,
        values.email,
        values.password,
        values.role,
        values.businessName,
        values.dotNumber || "",
        values.mcNumber || "",
        values.phone,
        values.description || "",
        (values as any).city || "",
        (values as any).address || "",
        (values as any).equipmentType || "",
        (values as any).maxWeight || ""
      );
      
      toast.success("Thanks! We will reach out soon.");
      window.location.href = "/";
    } catch (error) {
      console.error("Register error:", error);
      toast.error("Failed to register. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleRegister)}
        className="space-y-4"
      >
        <ExistingUserAlert 
          show={existingUserAlert.show} 
          status={existingUserAlert.status} 
        />

        <PersonalInfoSection control={form.control} />

        <BusinessInfoSection 
          control={form.control}
          selectedRole={selectedRole} 
        />

        {selectedRole === "shipper" && (
          <ShipperSection 
            control={form.control} 
            setValue={form.setValue}
            watchedMcNumber={watchedMcNumber}
            watchedDotNumber={watchedDotNumber}
          />
        )}

        {selectedRole === "carrier" && (
          <CarrierSection control={form.control} />
        )}

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
