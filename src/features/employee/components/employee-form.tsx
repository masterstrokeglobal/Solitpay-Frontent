import React from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormInput from "@/components/form/form-input";
import FormProvider from "@/components/form/form-provider";
import FormPassword from "@/components/form/form-password";

// Define schema for employee input
const passwordValidation = z
    .string()
    .min(8)
    .max(100)
    .optional()

export const createEmployeeInputSchema = z
    .object({
        id: z.string().optional(),
        name: z.string().max(100),
        email: z.string().email(),
        password: passwordValidation,
    });

export type EmployeeFormValues = z.infer<typeof createEmployeeInputSchema>;

type Props = {
    defaultValues?: EmployeeFormValues;
    isUpdate?: boolean;
    onSubmit: (data: EmployeeFormValues) => void;
    isLoading?: boolean;
};

const EmployeeForm = ({ defaultValues, onSubmit, isLoading, isUpdate }: Props) => {
    const form = useForm<EmployeeFormValues>({
        resolver: zodResolver(createEmployeeInputSchema),
        defaultValues,
    });

    const handleSubmit = (data: EmployeeFormValues) => {
        onSubmit(data);
    };

    return (
        <FormProvider onSubmit={form.handleSubmit(handleSubmit)} methods={form}>
            <div className="space-y-4">
                <FormInput
                    control={form.control}
                    name="name"
                    glass
                    label="Employee Name*"
                />
                <FormInput
                    control={form.control}
                    name="email"
                    glass
                    label="Email*"
                />
                {!isUpdate && (
                    <FormPassword
                        control={form.control}
                        name="password"
                        type="password"
                        glass
                        label="Password*"
                    />
                )}
            </div>

            <footer className="flex justify-end gap-4 mt-8">
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                    Reset
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Employee"}
                </Button>
            </footer>
        </FormProvider>
    );
};

export default EmployeeForm;