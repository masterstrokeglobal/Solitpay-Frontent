"use client";

import DataTable from "@/components/ui/data-table-server";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { useGetAllLoginLogs } from "@/features/login-logs/api/login-log-query";
import loginLogColumns from "@/features/login-logs/components/login-log-columns";
import LoginLog from "@/models/login-log";
import { Search } from "lucide-react";
import React, { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";

const LoginLogTable = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

    const { data, isSuccess, isFetching } = useGetAllLoginLogs({
        page: page,
        search: search,
        startDate: dateRange?.from,
        endDate: dateRange?.to,
        limit: 10,
    });

    const loginLogs = useMemo(() => {
        if (isSuccess && data?.data?.loginLogs) {
            return Array.from(data.data.loginLogs).map((log: any) => new LoginLog(log));
        }
        return [];
    }, [data, isSuccess]);

    const totalPages = useMemo(() => {
        return Math.ceil(data?.data?.count / 10) || 1;
    }, [data, isSuccess]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1); // Reset to first page on search
    };

    const changePage = (newPage: number) => {
        setPage(newPage);
    };


    return (
        <section className="container-main min-h-[60vh] my-12">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Login Logs</h2>
                <div className="flex gap-5 flex-wrap md:items-center">
                    <div className="relative min-w-60 flex-1">
                        <Search size={18} className="absolute top-2.5 left-2.5" />
                        <Input
                            placeholder="Search by user, IP, or status"
                            onChange={handleSearch}
                            className="pl-10"
                        />
                    </div>
                    <DatePickerWithRange
                        dateRange={dateRange}
                        onDateRangeChange={setDateRange}
                    />
                </div>
            </header>
            <main className="mt-4">
                <DataTable
                    page={page}
                    loading={isFetching}
                    columns={loginLogColumns}
                    data={loginLogs}
                    totalPage={totalPages}
                    changePage={changePage}
                />
            </main>
        </section>
    );
};

export default LoginLogTable;