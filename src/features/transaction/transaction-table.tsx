"use client";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table-server";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/context/auth-context";
import { AdminRole } from "@/models/admin";
import { Transaction, TransactionStatus, TransactionType } from "@/models/transaction";
import { Download, Search } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import transactionColumns from "../user/components/transaction-columns";
import { useGetAllTransactions, useGetTransactionDownload } from "./query/transactions-queries";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getExtension } from "@/lib/utils";

type Props = {
    userId?: string;
};

const TransactionTable = ({ userId }: Props) => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const [type, setType] = useState<string | "">("");
    const [status, setStatus] = useState<string | "">("");
    const { userDetails } = useAuthStore();

    const merchanntId = userDetails?.role === AdminRole.Merchant ? userDetails?.id : userId;

    // Fetch all transactions with pagination, search query, and filters
    const { data, isSuccess, isFetching, refetch } = useGetAllTransactions({
        page: page,
        search: search,
        type: type === "all" ? "" : type,
        merchantId: merchanntId,
        status: status === "all" ? "" : status,
    });



    useEffect(() => {
        const interval = setInterval(() => {
            refetch();
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const { mutateAsync: downloadData, isPending } = useGetTransactionDownload();

    const handleClickDownload = async (format: "excel" | "pdf" | "csv") => {
        const response = await downloadData({
            page: page,
            search: search,
            format: format,
            type: type === "all" ? "" : type,
            merchantId: merchanntId,
            status: status === "all" ? "" : status,
        });
        if (response.status === 200) {
            const blob = new Blob([response.data], { type: response.headers["content-type"] });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;

            a.download = `transactions.${getExtension(format)}`;
            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
                document.body.removeChild(a);
            }, 1000);
        }

    }

    const transactions = useMemo(() => {
        if (isSuccess && data?.data?.transactions) {
            return Array.from(data.data.transactions).map(
                (transaction: any) => new Transaction(transaction)
            );
        }
        return [];
    }, [data, isSuccess]);

    // Calculate total pages based on data count
    const totalPages = useMemo(() => {
        return Math.ceil(data?.data?.total / 10) || 1;
    }, [data, isSuccess]);

    // Handle search input change
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1); // Reset to first page on search
    };

    // Change page when pagination controls are used
    const changePage = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <section className="container-main min-h-[60vh] my-12">
            <div className="border-white/20 bg-white/10 backdrop-blur-md shadow-lg rounded-lg p-6">
                <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">Transactions</h2>
                    <div className="flex gap-5 ">
                        <div className="relative min-w-60 flex-1">
                            <Search size={18} className="absolute top-2.5 left-2.5 text-white" />
                            <Input
                                placeholder="Search"
                                onChange={handleSearch}
                                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/70 backdrop-blur-sm"
                            />
                        </div>
                        {/* ShadCN Select for Type Filter */}
                        <Select value={type} onValueChange={(val) => {
                            setType(val as TransactionType)
                            setPage(1);
                        }} >
                            <SelectTrigger className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/10 border-white/20 backdrop-blur-md">
                                <SelectGroup>
                                    <SelectLabel className="text-white">Types</SelectLabel>
                                    <SelectItem value="all" className="text-white hover:bg-white/20">All Types</SelectItem>
                                    <SelectItem value={TransactionType.DEPOSIT} className="text-white hover:bg-white/20">Deposit</SelectItem>
                                    <SelectItem value={TransactionType.WITHDRAWAL} className="text-white hover:bg-white/20">Withdrawal</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        {/* ShadCN Select for Status Filter */}
                        <Select value={status} onValueChange={(val) => {
                            setStatus(val as TransactionStatus)
                            setPage(1);
                        }} >
                            <SelectTrigger className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/10 border-white/20 backdrop-blur-md">
                                <SelectGroup>
                                    <SelectLabel className="text-white">Status</SelectLabel>
                                    <SelectItem value="all" className="text-white hover:bg-white/20">All Statuses</SelectItem>
                                    <SelectItem value={TransactionStatus.PENDING} className="text-white hover:bg-white/20">Pending</SelectItem>
                                    <SelectItem value={TransactionStatus.COMPLETED} className="text-white hover:bg-white/20">Completed</SelectItem>
                                    <SelectItem value={TransactionStatus.FAILED} className="text-white hover:bg-white/20">Failed</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-2" asChild>
                                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm" >
                                    <Download size={18} /> Download
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-white/10 border-white/20 backdrop-blur-md">
                                <DropdownMenuItem onClick={() => handleClickDownload("excel")} disabled={isPending} className="text-white hover:bg-white/20">
                                    Excel
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleClickDownload("pdf")} disabled={isPending} className="text-white hover:bg-white/20">
                                    PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleClickDownload("csv")} disabled={isPending} className="text-white hover:bg-white/20">
                                    CSV
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>
                <main className="mt-4">
                    <DataTable
                        page={page}
                        loading={isFetching}
                        columns={transactionColumns}
                        data={transactions}
                        totalPage={totalPages}
                        changePage={changePage}
                    />
                </main>
            </div>
        </section>
    );
};

export default TransactionTable;
