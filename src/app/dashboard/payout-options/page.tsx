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
        return <div className="flex items-center justify-center min-h-screen text-white">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900/20 rounded-2xl">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-white tracking-tight">Bank Account Details</h1>
                        <p className="text-gray-300">Manage your withdrawal bank accounts</p>
                    </div>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white shadow-lg shadow-black/20 w-full sm:w-auto transition-all duration-200">
                                <Plus className="h-4 w-4 mr-2" />
                                Add New Account
                            </Button>
                        </DialogTrigger>
                        <DialogContent glass className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-6 shadow-lg shadow-black/20">
                            <DialogHeader>
                                <DialogTitle className="text-white">Add New Bank Account</DialogTitle>
                                <DialogDescription className="text-gray-300">
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
                        <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg shadow-black/20">
                            <CardContent className="flex flex-col items-center justify-center py-16">
                                <Building2 className="h-12 w-12 text-gray-300 mb-4" />
                                <p className="text-gray-300 mb-4">No bank accounts added yet</p>
                                <Button className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white shadow-lg shadow-black/20" onClick={() => setOpen(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Bank Account
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    <Alert className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg shadow-black/20">
                        <AlertDescription className="text-gray-300">
                            Your bank account details are encrypted and secure. We use industry-standard security measures to protect your information.
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        </div>
    );
};

export default BankDetailsDashboard;