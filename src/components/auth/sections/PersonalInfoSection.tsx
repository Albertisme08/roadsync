
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { RegisterFormValues } from "../validationSchemas";
import { handlePhoneChange } from "../utils/formUtils";

interface PersonalInfoSectionProps {
  control: Control<RegisterFormValues>;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ control }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Personal Information</h3>
      
      <FormField
        control={control}
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
        control={control}
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
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="••••••" {...field} />
            </FormControl>
            <div className="text-sm text-muted-foreground mt-2 space-y-1">
              <p className="font-medium">Password Security Tips:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Use a password manager to store and generate passwords</li>
                <li>Avoid password reuse across websites and apps</li>
                <li>Avoid using personal information in passwords</li>
              </ul>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
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
        control={control}
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
  );
};

export default PersonalInfoSection;
