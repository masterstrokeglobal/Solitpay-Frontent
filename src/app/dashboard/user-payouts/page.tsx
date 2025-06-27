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
import { TransactionStatus, TransactionType } from "@/models/transaction";
import { FileIcon, Plus, Search } from "lucide-react";
import React, { useMemo, useState } from "react";

import { useAuthStore } from "@/context/auth-context";
import { useGetAllUserWithdrawals } from "@/features/user-withdrawl/api/user-withdrawl-query";
import userWithdrawalColumns from "@/features/user/components/user-payout";
import { AdminRole } from "@/models/admin";
import { UserWithdrawal } from "@/models/user-withdrawl";
import Link from "next/link";
import Merchant, { APIS } from "@/models/merchant";


const UserPaymentsTable = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<string | "">("");
    const { userDetails } = useAuthStore();

    const merchantId = userDetails?.role === AdminRole.Merchant ? userDetails?.id : undefined;
    const merchant = userDetails as Merchant;

    const { data, isSuccess, isFetching } = useGetAllUserWithdrawals({
        page: page,
        search: search,
        type: TransactionType.WITHDRAWAL,
        merchantId: merchantId,
        status: status === "all" ? "" : status,
    });

    const transactions = useMemo(() => {
        if (isSuccess && data?.data) {
            return Array.from(data.data).map(
                (transaction: any) => new UserWithdrawal(transaction)
            );
        }
        return [];
    }, [data, isSuccess]);

    const totalPages = useMemo(() => {
        return Math.ceil(data?.data?.total / 10) || 1;
    }, [data, isSuccess]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const changePage = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <section className="container-main min-h-[60vh] my-12">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold text-white">User Withdrawal Requests</h2>

                </div>
                <div className="flex gap-5">
                    <div className="relative min-w-60 flex-1">
                        <Search size={18} className="absolute top-2.5 left-2.5" />
                        <Input
                            placeholder="Search"
                            onChange={handleSearch}
                            className="pl-10"
                        />
                    </div>

                    {/* Status Filter */}
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
                    {userDetails?.isMerchant &&
                        <Link href={`/withdraw/${userDetails?.id}`}>
                            <Button
                                className="flex items-center gap-2"
                            >
                                <Plus size={16} />
                                Create Request
                            </Button>
                        </Link>
                    }
                    {merchant.hasAccessTo(APIS.USER_WITHDRAW_BULK) &&
                        <Link href="/dashboard/user-payouts/bulk">
                            <Button
                                className="flex items-center gap-2"
                            >
                                <FileIcon size={16} />
                                Bulk Payout
                            </Button>
                        </Link>
                    }
                </div>
            </header>
            <main className="mt-4">
                <DataTable
                    page={page}
                    loading={isFetching}
                    columns={userWithdrawalColumns}
                    data={transactions}
                    totalPage={totalPages}
                    changePage={changePage}
                />
            </main>
        </section>
    );
};

export default UserPaymentsTable;