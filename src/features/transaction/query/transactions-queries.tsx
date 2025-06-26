import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { transactionAPI } from "./transaction-API";

export const useCreateTransaction = () => {
    return useMutation({
        mutationFn: transactionAPI.createTransaction,
        onSuccess: () => {
            toast.success("Transaction created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error creating transaction");
        },
    });
};

export const useCreatePayout = () => {
    return useMutation({
        mutationFn: transactionAPI.createPayout,
        onSuccess: () => {
            toast.success("Payout created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error creating payout");
        },
    });
};
export const useGetAllTransactions = (filter?: Record<string, any>) => {
    return useQuery({
        queryKey: ["transactions", filter],
        queryFn: () => transactionAPI.getAlltransaction(filter),
    });
};

export const useGetTransactionById = (transactionId: string) => {
    return useQuery({
        queryKey: ["transaction", transactionId],
        queryFn: () => transactionAPI.getTransactionById(transactionId),
    });
};


export const useUpdateTransactionById = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: transactionAPI.updateTransactionById,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "transactions";
                },
            });
            toast.success("Transaction updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error updating transaction");
        },
    });
};

export const useDeleteTransactionById = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: transactionAPI.deleteTransactionById,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "transactions";
                },
            });
            toast.success("Transaction deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error deleting transaction");
        },
    });
};


export const useConfirmWithdrawal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: transactionAPI.confirmWithdrawal,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "transactions";
                },
            });
            toast.success("Withdrawal confirmed successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error confirming withdrawal");
        },
    });
};

export const useApproveTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: transactionAPI.approveTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "transactions";
                },
            });
            toast.success("Transaction approved successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error approving transaction");
        },
    });
}

export const useRejectTransaction = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: transactionAPI.rejectTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "transactions";
                },
            });
            toast.success("Transaction rejected successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error rejecting transaction");
        },
    });
};

export const useGetTransactionDownload = () => {
    return useMutation({
        mutationFn: transactionAPI.getTransactionDownload,
        onSuccess: () => {
            toast.success("Transaction downloaded successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error downloading transaction");
        },
    });
};

