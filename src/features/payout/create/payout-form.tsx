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
            "flex items-center justify-between p-4 rounded-xl cursor-pointer",
            "bg-white/5 backdrop-blur-2xl border border-white/10 transition-all duration-300",
            "hover:bg-white/15 hover:border-white/25 hover:shadow-2xl hover:shadow-white/5",
            "shadow-xl shadow-black/10",
            selected && "border-2 border-blue-400/60 bg-blue-500/10 shadow-blue-500/20"
        )}
    >
        <div className="flex items-center gap-3">
            <div className={cn(
                "w-4 h-4 rounded-full transition-all duration-300",
                selected ? "bg-blue-400 shadow-lg shadow-blue-400/50" : "border-2 border-white/30"
            )} />
            <div>
                <p className="font-medium text-white/90">{title}</p>
                <p className="text-sm text-white/60">{details}</p>
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
            <Card className="mb-6 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/20">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-3">
                        <Label className="text-sm font-medium text-white/80">Available Balance</Label>
                        <Wallet className="h-5 w-5 text-blue-400/80" />
                    </div>
                    <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-2xl border border-white/15 p-5 rounded-xl shadow-2xl shadow-black/20">
                        <p className="text-2xl font-bold text-white/90">Rs. {walletBalance.toLocaleString()}</p>
                        <p className="text-sm text-white/60">Available for withdrawal</p>
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
                    glass
                />

                <div className="space-y-3">
                    <Label className="text-white/80">Select Payment Method</Label>
                    {paymentMethods.length === 0 && (
                        <p className="text-sm text-yellow-300/90 bg-gradient-to-r from-yellow-500/20 to-yellow-500/10 backdrop-blur-2xl border border-yellow-500/30 p-4 rounded-xl shadow-xl shadow-yellow-500/10">
                            No payment methods available. Please add a payment method to continue.
                        </p>
                    )}
                    <Controller
                        control={control}
                        name="withdrawDetails"
                        render={({ field }) => (
                            <div className="space-y-3">
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
                                    <p className="text-red-400/90 text-sm bg-gradient-to-r from-red-500/20 to-red-500/10 backdrop-blur-2xl border border-red-500/30 p-3 rounded-xl shadow-xl shadow-red-500/10">{errors.withdrawDetails.message}</p>
                                )}
                            </div>
                        )}
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 backdrop-blur-2xl border border-white/15 text-white/90 shadow-2xl shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-white/5"
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