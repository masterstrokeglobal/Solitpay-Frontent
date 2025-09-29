import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Wallet, CheckCircle2, XCircle } from "lucide-react";

// Dummy data for payouts
const payouts = [
    {
        id: 1,
        username: "john_doe",
        amount: 1500,
        bank: "Bank of America",
        accountNumber: "1234567890",
        status: "Success",
        walletBalance: 5000,
        createdAt: new Date(),
    },
    {
        id: 2,
        username: "jane_smith",
        amount: 2000,
        bank: "Chase Bank",
        accountNumber: "9876543210",
        status: "Pending",
        walletBalance: 3000,
        createdAt: new Date(),
    },
    {
        id: 3,
        username: "bob_marley",
        amount: 1000,
        bank: "Wells Fargo",
        accountNumber: "5678901234",
        status: "Failed",
        walletBalance: 1000,
        createdAt: new Date(),
    },
];

// Column definitions for payouts table
const payoutColumns: ColumnDef<typeof payouts[0]>[] = [
    {
        header: "USERNAME",
        accessorKey: "username",
        cell: ({ row }) => <div className="w-48 truncate">{row.original.username}</div>,
    },
    {
        header: "AMOUNT",
        accessorKey: "amount",
        cell: ({ row }) => <div className="text-[#6B7280]">Rs.{row.original.amount}</div>,
    },
    {
        header: "BANK",
        accessorKey: "bank",
        cell: ({ row }) => <div className="w-48 truncate">{row.original.bank}</div>,
    },
    {
        header: "ACCOUNT NUMBER",
        accessorKey: "accountNumber",
        cell: ({ row }) => (
            <div className="text-[#6B7280] w-48 truncate">{row.original.accountNumber}</div>
        ),
    },
    {
        header: "STATUS",
        accessorKey: "status",
        cell: ({ row }) => (
            <div className="flex items-center space-x-2">
                {row.original.status === "Success" && <CheckCircle2 className="text-green-500 w-5 h-5" />}
                {row.original.status === "Pending" && <Wallet className="text-yellow-500 w-5 h-5" />}
                {row.original.status === "Failed" && <XCircle className="text-red-500 w-5 h-5" />}
                <span>{row.original.status}</span>
            </div>
        ),
    },
    {
        header: "WALLET BALANCE",
        accessorKey: "walletBalance",
        cell: ({ row }) => <div className="text-[#6B7280]">Rs.{row.original.walletBalance}</div>,
    },
    {
        header: "DATE",
        accessorKey: "createdAt",
        cell: ({ row }) => (
            <span className="text-[#6B7280]">
                {dayjs(row.original.createdAt).format("DD-MM-YYYY")}
            </span>
        ),
    },
];

export { payoutColumns, payouts };
