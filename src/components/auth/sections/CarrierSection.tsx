
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { RegisterFormValues } from "../validationSchemas";

interface CarrierSectionProps {
  control: Control<RegisterFormValues>;
}

const CarrierSection: React.FC<CarrierSectionProps> = ({ control }) => {
  return (
    <>
      <FormField
        control={control}
        name="mcNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>MC Number <span className="text-sm text-gray-500">(Required: Enter either MC or DOT)</span></FormLabel>
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
        control={control}
        name="dotNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>DOT Number <span className="text-sm text-gray-500">(Required: Enter either MC or DOT)</span></FormLabel>
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
        control={control}
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
        control={control}
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
  );
};

export default CarrierSection;
