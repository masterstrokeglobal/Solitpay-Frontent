"use client"
import { Control, FieldPath, FieldValues } from "react-hook-form"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"

function FormSwitch<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  description,
  label,
  className,
  glass = false,
}: {
  label?: string
  control: Control<TFieldValues>
  className?: string
  name: TName
  description?: string
  glass?: boolean
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className={`flex flex-row items-center justify-between rounded-lg border p-4 ${glass ? "bg-white/10 backdrop-blur-xl border-white/20 shadow-lg shadow-black/20" : ""}`}>
        <div className="space-y-0.5">
          {label && <FormLabel className={glass ? "text-white" : ""}>{label}</FormLabel>}
          {description && <FormDescription className={glass ? "text-white/80" : ""}>{description}</FormDescription>}
        </div>
        <FormControl>
          <Switch
            checked={field.value}
            onCheckedChange={field.onChange}
            className={`${className} ${glass ? "bg-white/10 backdrop-blur-xl border-white/20 text-white placeholder-white/60 focus:bg-white/15 focus:border-white/30 shadow-lg shadow-black/20" : ""}`}
          />
        </FormControl>
      </FormItem>
    )}
  />
  )
}

export default FormSwitch
