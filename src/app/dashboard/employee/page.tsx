"use client";

import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table-server";
import { Input } from "@/components/ui/input";
import { useGetAllEmployees } from "@/features/employee/api/employee-query";
import employeeColumns from "@/features/employee/components/employee-columns";
import Employee from "@/models/employee";
import { Search } from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";

const EmployeeTable = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const { data, isSuccess, isFetching } = useGetAllEmployees({
        page: page,
        search: search,
    });

    const employees = useMemo(() => {
        if (isSuccess && data?.data?.employees) {
            return Array.from(data.data.employees).map((employee: any) => new Employee(employee));
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
                <h2 className="text-xl font-semibold text-white">Employees</h2>
                <div className="flex gap-5 flex-wrap">
                    <div className="relative min-w-60 flex-1">
                        <Search size={18} className="absolute top-2.5 left-2.5" />
                        <Input
                            placeholder="Search"
                            onChange={handleSearch}
                            className="pl-10"
                        />
                    </div>
                    <Link href="/dashboard/employee/create">
                        <Button>
                            Create Employee
                        </Button>
                    </Link>
                </div>
            </header>
            <main className="mt-4">
                <DataTable
                    page={page}
                    // loading={isFetching}
                    columns={employeeColumns}
                    data={employees}
                    totalPage={totalPages}
                    changePage={changePage}
                />
            </main>
        </section>
    );
};

export default EmployeeTable;