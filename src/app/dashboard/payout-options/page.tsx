"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useCreatePayoutOption, useDeletePayoutOption, useGetAllPayoutOptions, useUpdatePayoutOption } from '@/features/payout/api/payout-quieries';
import BankAccountForm, { BankFormValues } from "@/features/payout/create/bank-form";
import WithdrawDetailsCard from "@/features/payout/create/payout-option-card";
import { Building2, Plus, Trash2 } from 'lucide-react';
import React from 'react';

// Main Dashboard Component
const BankDetailsDashboard = () => {
    const [open, setOpen] = React.useState(false);

    // Queries
    const { data: bankAccounts = [], isLoading: isLoadingAccounts } = useGetAllPayoutOptions();
    const { mutate: createAccount, isPending: isCreating } = useCreatePayoutOption();
    const { mutate: deleteAccount, isPending: isDeleting } = useDeletePayoutOption();

    const handleSubmit = async (data: BankFormValues) => {
        createAccount(data, {
            onSuccess: () => {
                setOpen(false);
            }
        });
    };

    const handleDelete = (accountId: number) => {
        if (window.confirm('Are you sure you want to delete this account?')) {
            deleteAccount(accountId.toString());
        }
    };

    if (isLoadingAccounts) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold text-gray-900">Bank Account Details</h1>
                        <p className="text-gray-600">Manage your withdrawal bank accounts</p>
                    </div>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto">
                                <Plus className="h-4 w-4 mr-2" />
                                Add New Account
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[525px]">
                            <DialogHeader>
                                <DialogTitle>Add New Bank Account</DialogTitle>
                                <DialogDescription className="text-gray-600">
                                    Enter your bank account details for withdrawals
                                </DialogDescription>
                            </DialogHeader>
                            <BankAccountForm onSubmit={handleSubmit} isLoading={isCreating} />
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid gap-6">
                    {bankAccounts.length > 0 ? (
                        <div className="grid gap-4">
                            {bankAccounts.map((account) => (<WithdrawDetailsCard key={account.id} record={account} isDeleting={isDeleting} handleDelete={handleDelete} />))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-16">
                                <Building2 className="h-12 w-12 text-gray-400 mb-4" />
                                <p className="text-gray-500 mb-4">No bank accounts added yet</p>
                                <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setOpen(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Bank Account
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    <Alert className="bg-indigo-50 border-indigo-100">
                        <AlertDescription className="text-indigo-900">
                            Your bank account details are encrypted and secure. We use industry-standard security measures to protect your information.
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        </div>
    );
};

export default BankDetailsDashboard;