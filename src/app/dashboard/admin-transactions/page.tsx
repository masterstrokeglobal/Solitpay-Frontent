"use client";

import Combobox from "@/components/ui/combobox";
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
import { useGetAllTransactions } from "@/features/transaction/query/transactions-queries";
import transactionColumns from "@/features/user/components/transaction-columns";
import { useGetAllUsers } from "@/features/user/data/user-queries";
import Merchant from "@/models/merchant";
import { Transaction, TransactionStatus, TransactionType } from "@/models/transaction";
import { Search } from "lucide-react";
import React, { useMemo, useState } from "react";


const AdminTransactionTable = () => {
    const [merchanntId, setMerchanntId] = useState<string | undefined>(undefined);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [type, setType] = useState<string | "">("");
    const [status, setStatus] = useState<string | "">("");

    const { data:merchantData, isSuccess:isMerchantSuccess } = useGetAllUsers({
        page: page,
        search: search,
    });

    const merchantOptions = useMemo(() => {
        if (isMerchantSuccess && merchantData?.data?.merchants) {
            return Array.from(merchantData.data.merchants).map((user: any) => new Merchant(user)).map((merchant: Merchant) => {
                return {
                    value: merchant.id!.toString(),
                    label: merchant.name!
                }
            });
        }
        return [];
    }, [ merchantData, isMerchantSuccess]);
    // Fetch all transactions with pagination, search query, and filters
    const { data, isSuccess, isFetching } = useGetAllTransactions({
        page: page,
        search: search,
        type: type === "all" ? "" : type,
        merchantId: merchanntId,
        status: status === "all" ? "" : status,
    });

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
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Transactions</h2>
                <div className="flex gap-5 ">
                    <div className="relative min-w-60 flex-1">
                        <Search size={18} className="absolute top-2.5 left-2.5" />
                        <Input
                            placeholder="Search"
                            onChange={handleSearch}
                            className="pl-10"
                        />
                    </div>
                    {/* ShadCN Select for Type Filter */}
                    <Select value={type} onValueChange={(val) => {
                        setType(val as TransactionType)
                        setPage(1);
                    }} >
                        <SelectTrigger>
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Types</SelectLabel>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value={TransactionType.DEPOSIT}>Deposit</SelectItem>
                                <SelectItem value={TransactionType.WITHDRAWAL}>Withdrawal</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                   <Combobox options={merchantOptions} value={merchanntId} onChange={(value: React.SetStateAction<string | undefined>)=>setMerchanntId(value)}  placeholder="All Merchants" />
 
                    {/* ShadCN Select for Status Filter */}
                    <Select value={status} onValueChange={(val) => {
                        setStatus(val as TransactionStatus)
                        setPage(1);
                    }} >
                        <SelectTrigger>
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Status</SelectLabel>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value={TransactionStatus.PENDING}>Pending</SelectItem>
                                <SelectItem value={TransactionStatus.COMPLETED}>Completed</SelectItem>
                                <SelectItem value={TransactionStatus.FAILED}>Failed</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
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
        </section>
    );
};

export default AdminTransactionTable;
