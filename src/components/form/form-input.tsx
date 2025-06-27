"use client";

import { Control, FieldPath, FieldValues } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  description,
  inputClassName,
  children,
  label,
  className,
  glass = false,
  ...props
}: {
  label?: string;
  control: Control<TFieldValues>;
  className?: string;
  inputClassName?: string;
  children?: React.ReactNode;
  Icon?: React.ReactNode;
  name: TName;
  description?: string;
  glass?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel className={glass ? "text-white" : ""}>{label}</FormLabel>}
          <FormControl>
            <div className={"relative"}>
              <Input 
                className={`${inputClassName} ${glass ? "bg-white/10 placeholder:text-white/40 backdrop-blur-xl border-white/20 text-white  focus:bg-white/15 focus:border-white/30 shadow-lg shadow-black/20" : ""}`} 
                {...props} 
                {...field} 
              />
              {children}
            </div>
          </FormControl>
          {description && <FormDescription className={glass ? "text-white/80" : ""}>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default FormInput;
