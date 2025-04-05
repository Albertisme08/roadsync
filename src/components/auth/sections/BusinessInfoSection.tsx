
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { RegisterFormValues } from "../validationSchemas";

interface BusinessInfoSectionProps {
  control: Control<RegisterFormValues>;
  selectedRole?: "shipper" | "carrier";
}

const BusinessInfoSection: React.FC<BusinessInfoSectionProps> = ({ control, selectedRole }) => {
  return (
    <div className="space-y-4 pt-2">
      <h3 className="text-lg font-medium">Business Information</h3>
      
      <FormField
        control={control}
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
        control={control}
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

      <FormField
        control={control}
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
    </div>
  );
};

export default BusinessInfoSection;
