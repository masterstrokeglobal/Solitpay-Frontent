"use client"

import { Control, FieldPath, FieldValues } from "react-hook-form"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

function FormTextArea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  description,
  label,
  glass,
  ...props
}: {
  label?: string
  control: Control<TFieldValues>
  name: TName
  description?: string
  glass?: boolean
} & React.InputHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel className={glass ? "text-white/90" : ""}>{label}</FormLabel>}
          <FormControl>
            <Textarea 
              {...props} 
              {...field} 
              className={glass ? "backdrop-blur-md bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-blue-500/50 focus:border-blue-400/30" : ""}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormTextArea
