"use client";

import FormInput from '@/components/form/form-input';
import FormProvider from '@/components/form/form-provider';
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Schema
export const bankAccountSchema = z.object({
    accountName: z.string().min(1, "Account holder name is required"),
    accountNumber: z.string().min(8, "Account number must be at least 8 digits"),
    confirmAccountNumber: z.string(),
    ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format"),
    bankName: z.string().min(1, "Bank name is required"),
}).refine((data) => data.accountNumber === data.confirmAccountNumber, {
    message: "Account numbers don't match",
    path: ["confirmAccountNumber"],
});

export type BankFormValues = z.infer<typeof bankAccountSchema>;

// Form Component
const BankAccountForm = ({
    onSubmit,
    isLoading
}: {
    onSubmit: (data: BankFormValues) => void;
    isLoading?: boolean;
}) => {
    const form = useForm<BankFormValues>({
        resolver: zodResolver(bankAccountSchema),
        defaultValues: {
            accountName: "",
            accountNumber: "",
            confirmAccountNumber: "",
            ifscCode: "",
        },
    });

    return (
        <FormProvider methods={form} onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6">
                <FormInput
                    control={form.control}
                    name="accountName"
                    label="Account Holder Name*"
                    className="bg-gray-50"
                />
                <FormInput
                    control={form.control}
                    name="accountNumber"
                    label="Account Number*"
                    type="password"
                    className="bg-gray-50"
                />
                <FormInput
                    control={form.control}
                    name="confirmAccountNumber"
                    label="Confirm Account Number*"
                    type="password"
                    className="bg-gray-50"
                />
                <FormInput
                    control={form.control}
                    name="ifscCode"
                    label="IFSC Code*"
                    className="uppercase bg-gray-50"
                />
                <FormInput
                    control={form.control}
                    name="bankName"
                    label="Bank Name*"
                    className="bg-gray-50"
                />
            </div>

            <footer className="flex justify-end gap-4 mt-8">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                    className="hover:bg-gray-100"
                >
                    Reset
                </Button>
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-700"
                >
                    {isLoading ? "Saving..." : "Save Account"}
                </Button>
            </footer>
        </FormProvider>
    );
};

export default BankAccountForm;