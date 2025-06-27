import { ColumnDef } from "@tanstack/react-table";
import { Eye, PenIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Transaction, TransactionStatus, TransactionType } from "@/models/transaction";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useAuthStore } from "@/context/auth-context";

const transactionColumns: ColumnDef<Transaction>[] = [
    {
        header: "ID",
        accessorKey: "id",
        cell: ({ row }) => (
            <div className="font-medium text-white">{row.original.id}</div>
        ),
    },
    {
        header: "TYPE",
        accessorKey: "type",
        cell: ({ row }) => {
            const type = row.original.type;
            const colorClass = type === TransactionType.DEPOSIT
                ? "text-green-600"
                : "text-red-600";
            return (
                <Badge variant={type === TransactionType.DEPOSIT ? "success" : "destructive"}>
                    {type}
                </Badge>
            );
        },
    },
    {
        header: "UTR",
        accessorKey: "pgId",
        cell: ({ row }) => (
            <div className="text-white">
                {row.original.pgId}
            </div>
        ),
    },
    {
        header: "AMOUNT",
        accessorKey: "amount",
        cell: ({ row }) => (
            <div className="font-medium text-white">
                Rs.{row.original.amount.toFixed(2)}
            </div>
        ),
    },
    {
        header: "STATUS",
        accessorKey: "status",
        cell: ({ row }) => {
            const status = row.original.status;
            let variant = "";

            switch (status) {
                case TransactionStatus.COMPLETED:
                    variant = "success";
                    break;
                case TransactionStatus.PENDING:
                    variant = "warning";
                    break;
                case TransactionStatus.FAILED:
                    variant = "destructive";
                    break;
            }

            return (
                <Badge variant={variant as any}>
                    {status}
                </Badge>
            );
        },
    },
    {
        header: "Platform Fee %",
        accessorKey: "bonusPercentage",
        cell: ({ row }) => (
            <div className="text-white">
                {row.original.platformFeePercentage}%
            </div>
        ),
    },
    {
        header: "Platform Fee",
        accessorKey: "bonusAmount",
        cell: ({ row }) => (
            <div className="text-white">
                Rs.{row.original.platformFeeAmount.toFixed(2)}
            </div>
        ),
    },
    {
        header: "CREATED AT",
        accessorKey: "createdAt",
        cell: ({ row }) => (
            <div className="text-white">
                {new Date(row.original.createdAt).toLocaleString()}
            </div>
        ),
    },
    {
        header: "",
        accessorKey: "actions",
        cell: ({ row }) => (
            <ActionColumn transaction={row.original} />
        ),
    },
];

export default transactionColumns;

const ActionColumn = ({ transaction }: { transaction: Transaction }) => {
    const { userDetails } = useAuthStore();

    return (
        <div className="flex justify-end">

            <Link href={`/dashboard/transactions/${transaction.id}`}>
                <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Edit Transaction"
                >
                    <Eye className="w-5 h-5" />
                </Button>
            </Link>

        </div>
    );
}