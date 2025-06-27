"use client";

import { Control, FieldPath, FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";

import {
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

function FormGroupSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  placeholder,
  options,
  className,
  disabled,
  glass,
  ...props
}: {
  label?: string;
  control: Control<TFieldValues>;
  options: { value: string; label: string }[];
  className?: string;
  name: TName;
  description?: string;
  glass?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem {...props}>
          <FormLabel className={cn(
            glass 
              ? "text-white/90"
              : ""
          )}>{label}</FormLabel>
          <Select disabled={disabled} onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger className={cn(
                glass 
                  ? "border-white/20 bg-white/10 backdrop-blur-xl text-white placeholder:text-white/60 focus-visible:ring-white/50 shadow-lg shadow-black/20"
                  : "",
                className
              )}>
                {options.find((option) => option.value == field.value)?.label ??
                  <SelectValue placeholder={placeholder} />}
              </SelectTrigger>
            </FormControl>
            <SelectContent className={cn(
              glass 
                ? "border-white/20 bg-white/10 backdrop-blur-xl text-white shadow-lg shadow-black/20"
                : ""
            )}>
              {options.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className={cn(
                    glass 
                      ? "text-white hover:bg-white/20 focus:bg-white/20"
                      : ""
                  )}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default FormGroupSelect;
