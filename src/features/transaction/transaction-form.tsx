"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, TransactionStatus } from "@/models/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import TransactionStatusAlert from "./transaction-status";
import FormProvider from "@/components/form/form-provider";
import FormGroupSelect from "@/components/form/form-select";
import { CreditCard, Calendar, Hash, DollarSign } from "lucide-react";

// Schema for transaction form validation
export const transactionEditSchema = z.object({
    status: z.enum([TransactionStatus.PENDING, TransactionStatus.COMPLETED, TransactionStatus.FAILED]),
});

export type TransactionFormValues = z.infer<typeof transactionEditSchema>;

type TransactionEditProps = {
    transaction: Transaction;
    showForm?: boolean;
    onSubmit: (data: TransactionFormValues) => void;
    isLoading?: boolean;
};

const DetailRow = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | number | null | undefined }) => {
    if (value === null || value === undefined) return null;
    
    return (
        <div className="flex items-start gap-3 py-2">
            <Icon className="w-5 h-5 text-white/60 mt-0.5" />
            <div>
                <p className="text-sm text-white/60">{label}</p>
                <p className="text-sm font-medium text-white">{value}</p>
            </div>
        </div>
    );
};

const TransactionEditForm = ({ transaction, onSubmit, isLoading, showForm = false }: TransactionEditProps) => {
    const form = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionEditSchema),
        defaultValues: { status: TransactionStatus.FAILED },
    });

    const { control, handleSubmit } = form;
    const currentStatus = transaction.status

    return (
        <section className="container-main min-h-[60vh] max-w-xl">
            <Card className="w-full bg-white/10 border-white/20 backdrop-blur-md shadow-lg">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-white">Transaction Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
                    <DetailRow
                        icon={CreditCard}
                        label="Type"
                        value={transaction.type}
                    />
                    
                    <DetailRow
                        icon={DollarSign}
                        label="Amount"
                        value={`₹${transaction.amount}`}
                    />
                    
                    <DetailRow
                        icon={Hash}
                        label="PG ID"
                        value={transaction.pgId || "N/A"}
                    />
                    
                    {/* Platform fee removed per request */}
                    
                    <DetailRow
                        icon={Calendar}
                        label="Created At"
                        value={new Date(transaction.createdAt).toLocaleDateString()}
                    />
                    
                    {(currentStatus === TransactionStatus.PENDING && showForm) && (
                        <FormProvider methods={form} onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                            <FormGroupSelect
                                control={control}
                                name="status"
                                defaultValue={TransactionStatus.COMPLETED.toString()}
                                label="Change Status"
                                options={[
                                    { label: "Completed", value: TransactionStatus.COMPLETED.toString() },
                                    { label: "Cancelled", value: TransactionStatus.FAILED.toString() },
                                ]}
                            />

                            <footer className="flex justify-end gap-4 mt-8">
                                <Button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                                >
                                    {isLoading ? "Updating..." : "Update Status"}
                                </Button>
                            </footer>
                        </FormProvider>
                    )}
                    {(currentStatus !== TransactionStatus.PENDING && showForm) && (
                        <TransactionStatusAlert currentStatus={currentStatus} />
                    )}
                </CardContent>
            </Card>
        </section>
    );
};

export default TransactionEditForm;
