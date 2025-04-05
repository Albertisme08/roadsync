
import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Control, UseFormSetValue } from "react-hook-form";
import { RegisterFormValues } from "../validationSchemas";
import { isValidMCNumber, isValidDOTNumber } from "../utils/formUtils";

interface ShipperSectionProps {
  control: Control<RegisterFormValues>;
  setValue: UseFormSetValue<RegisterFormValues>;
  watchedMcNumber: string;
  watchedDotNumber: string;
}

const ShipperSection: React.FC<ShipperSectionProps> = ({ 
  control, 
  setValue, 
  watchedMcNumber, 
  watchedDotNumber 
}) => {
  const [idType, setIdType] = useState<"mc" | "dot" | "none">("none");

  const handleIdTypeChange = (value: "mc" | "dot" | "none") => {
    setIdType(value);
    
    if (value === "mc") {
      setValue("dotNumber", "");
    } else if (value === "dot") {
      setValue("mcNumber", "");
    } else {
      setValue("mcNumber", "");
      setValue("dotNumber", "");
    }
  };

  return (
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
                    setValue("description", e.target.value);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        </FormItem>

        {idType === "mc" && (
          <FormField
            control={control}
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
        )}

        {idType === "dot" && (
          <FormField
            control={control}
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
        )}
      </div>

      <FormField
        control={control}
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
        control={control}
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
  );
};

export default ShipperSection;
