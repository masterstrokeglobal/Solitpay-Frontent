"use client";

import React, { useMemo } from "react";
import LoadingScreen from "@/components/common/loading-screen";
import { useParams, useRouter } from "next/navigation";
import { Transaction, TransactionStatus, TransactionType } from "@/models/transaction";
import TransactionEditForm, { TransactionFormValues } from "@/features/transaction/transaction-form";
import { useApproveTransaction, useConfirmWithdrawal, useGetTransactionById, useRejectTransaction, useUpdateTransactionById } from "@/features/transaction/query/transactions-queries";
import WithdrawDetailsRecord from "@/models/withdrawl-details";
import Merchant from "@/models/merchant";
import { MerchantDetailsCard, WithdrawalDetailsCard } from "@/features/merchant/merchant-card-small";
import { useAuthStore } from "@/context/auth-context";
import Admin from "@/models/admin";

const EditTransactionPage = () => {
    const params = useParams();
    const { userDetails } = useAuthStore();
    const { id } = params;
    const { data, isLoading, isSuccess } = useGetTransactionById(id!.toString());
    const { mutate: approve, isPending: isPending } = useApproveTransaction();
    const { mutate: reject, isPending: confirmPending } = useRejectTransaction();


    const withdrawlDetails = useMemo(() => {
        if (data?.data.withdrawDetails) return new WithdrawDetailsRecord(data?.data.withdrawDetails);
        return null;
    }, [data]);

    const merchant = useMemo(() => {
        return new Merchant(data?.data.merchant);
    }, [data]);

    const onSubmit = (updatedData: TransactionFormValues) => {

        if (updatedData.status == TransactionStatus.COMPLETED) {
            approve(id!.toString());
        }
        if (updatedData.status == TransactionStatus.FAILED) {
            reject(id!.toString());
        }
    };

    if (isLoading) return <LoadingScreen>Loading transaction...</LoadingScreen>;


    return (
        <>
            {isSuccess && data && (
                <div className="grid md:grid-cols-2 gap-8">
                    {withdrawlDetails && <WithdrawalDetailsCard withdrawDetails={withdrawlDetails} />}
                    <MerchantDetailsCard merchant={merchant} />
                    <TransactionEditForm
                        transaction={data.data}
                        onSubmit={onSubmit}
                        showForm={(userDetails as Admin)?.isSuperAdmin}
                        isLoading={isPending || confirmPending}
                    />
                </ div>
            )}
        </>
    );

};

export default EditTransactionPage;
