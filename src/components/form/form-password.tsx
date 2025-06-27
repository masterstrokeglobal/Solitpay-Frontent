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
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "../ui/button"

function FormPassword<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    control,
    name,
    description,
    label,
    className,
    glass,
    ...props
}: {
    label?: string
    control: Control<TFieldValues>
    className?: string
    Icon?: React.ReactNode
    name: TName
    description?: string
    glass?: boolean
} & React.InputHTMLAttributes<HTMLInputElement>) {
    const [inputType, setInputType] = useState<'password' | 'text'>('password');

    const toggleType = () => {
        if (inputType === 'password') {
            setInputType('text');
        } else {
            setInputType('password');
        }
    }
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    {label && <FormLabel className={glass ? "text-white" : ""}>{label}</FormLabel>}
                    <FormControl >
                        <div className="relative">
                            <Input 
                                {...props} 
                                {...field} 
                                type={inputType} 
                                className={glass ? "backdrop-blur-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60" : ""}
                            />
                            <Button 
                                onClick={toggleType} 
                                variant={'ghost'} 
                                type="button" 
                                size={'sm'} 
                                className={`absolute right-1 top-0.5 cursor-pointer ${glass ? "text-white hover:bg-white/20" : ""}`}
                            >
                                {!(inputType === 'password') ? (
                                    <Eye size={20} />
                                ) : (
                                    <EyeOff size={20} />
                                )}
                            </Button>
                        </div>
                    </FormControl>
                    {description && <FormDescription className={glass ? "text-white/80" : ""}>{description}</FormDescription>}
                    <FormMessage className={glass ? "text-red-300" : ""} />
                </FormItem>
            )}
        />
    )
}

export default FormPassword
