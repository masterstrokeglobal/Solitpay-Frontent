"use client";

import React from 'react';
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import WithdrawDetailsRecord from '@/models/withdrawl-details';
import FormInput from '@/components/form/form-input';
import FormProvider from '@/components/form/form-provider';

// Create a more specific schema that includes wallet balance validation
const createPayoutSchema = (walletBalance: number) => z.object({
    amount: z.coerce
        .number({ invalid_type_error: "Amount must be a number" })
        .min(1, "Amount is required")
        .max(walletBalance, `Amount cannot exceed wallet balance of $${walletBalance}`)
        .refine((val) => val <= walletBalance, `Amount cannot exceed wallet balance of $${walletBalance}`),
    withdrawDetails: z.coerce.number({
        required_error: "Please select a payment method"
    }).min(1, "Please select a payment method"),
});

export type PayoutFormValues = z.infer<ReturnType<typeof createPayoutSchema>>;

interface PaymentMethodOptionProps {
    title: string;
    details: string;
    selected: boolean;
    onClick: () => void;
}

const PaymentMethodOption = ({
    title,
    details,
    selected,
    onClick,
}: PaymentMethodOptionProps) => (
    <div
        onClick={onClick}
        className={cn(
            "flex items-center justify-between p-4 rounded-lg cursor-pointer",
            "bg-slate-100 transition-all duration-200",
            "hover:bg-slate-200",
            selected && "border-2 border-blue-500"
        )}
    >
        <div className="flex items-center gap-3">
            <div className={cn(
                "w-3 h-3 rounded-full",
                selected ? "bg-blue-500" : "border-2 border-gray-400"
            )} />
            <div>
                <p className="font-medium">{title}</p>
                <p className="text-sm text-gray-600">{details}</p>
            </div>
        </div>
    </div>
);

interface PayoutRequestFormProps {
    onSubmit: (data: PayoutFormValues) => void;
    isLoading?: boolean;
    paymentMethods: WithdrawDetailsRecord[];
    walletBalance: number;
}

const PayoutRequestForm = ({
    onSubmit,
    isLoading = false,
    paymentMethods,
    walletBalance
}: PayoutRequestFormProps) => {
    const form = useForm<PayoutFormValues>({
        resolver: zodResolver(createPayoutSchema(walletBalance)),
        defaultValues: {
            amount: 0,
            withdrawDetails: 0,
        }
    });

    const { control, handleSubmit, formState: { errors } } = form;

    const isFormDisabled = paymentMethods.length === 0 || isLoading;

    return (
        <div className="w-full max-w-md mx-auto p-6">
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium">Available Balance</Label>
                        <Wallet className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-2xl font-bold">Rs. {walletBalance.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Available for withdrawal</p>
                    </div>
                </CardContent>
            </Card>

            <FormProvider methods={form} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <FormInput
                    name="amount"
                    label="Amount"
                    type="number"
                    control={control}
                    placeholder="Enter withdrawal amount"
                />

                <div className="space-y-2">
                    <Label>Select Payment Method</Label>
                    {paymentMethods.length === 0 && (
                        <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded">
                            No payment methods available. Please add a payment method to continue.
                        </p>
                    )}
                    <Controller
                        control={control}
                        name="withdrawDetails"
                        render={({ field }) => (
                            <div className="space-y-2">
                                {paymentMethods.map((method) => (
                                    <PaymentMethodOption
                                        key={method.id}
                                        title={method.accountName?.toString() ?? ''}
                                        details={method.accountNumber?.toString() ?? ''}
                                        selected={field.value === method.id}
                                        onClick={() => field.onChange(method.id)}
                                    />
                                ))}
                                {errors.withdrawDetails && (
                                    <p className="text-red-500 text-sm">{errors.withdrawDetails.message}</p>
                                )}
                            </div>
                        )}
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isFormDisabled}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing Request
                        </>
                    ) : (
                        paymentMethods.length === 0
                            ? "Add Payment Method"
                            : "Request Payout"
                    )}
                </Button>
            </FormProvider>
        </div>
    );
};

export default PayoutRequestForm;