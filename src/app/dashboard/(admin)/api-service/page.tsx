"use client";
import { useGetAllAPIServices } from "@/features/api-service/api/api-service-query";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table-server";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/context/auth-context";
import apiServiceColumns from "@/features/api-service/components/api-service-columns";
import { AdminRole } from "@/models/admin";
import APIService from "@/models/api-service";
import { Search } from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";

const APIServiceTable = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const { userDetails } = useAuthStore();
    const merchantId = userDetails?.role === AdminRole.Merchant ? userDetails?.id : null;

    const { data, isSuccess, isFetching } = useGetAllAPIServices({
        page: page,
        search: search,
        merchantId: merchantId,
    });

    const apiServices = useMemo(() => {
        if (isSuccess && data?.data?.apiLists) {
            return Array.from(data.data.apiLists).map(
                (apiService: any) => new APIService(apiService)
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
                <h2 className="text-xl font-semibold text-white">API Services</h2>
                <div className="flex gap-5 ">
                    <div className="relative min-w-60 flex-1">
                        <Search size={18} className="absolute top-2.5 left-2.5" />
                        <Input
                            placeholder="Search"
                            onChange={handleSearch}
                            className="pl-10"
                        />
                    </div>

                    <Link href="/dashboard/api-service/create">
                        <Button>Create API Service</Button>
                    </Link>
                </div>
            </header>
            <main className="mt-4">
                <DataTable
                    page={page}
                    loading={isFetching}
                    columns={apiServiceColumns}
                    data={apiServices}
                    totalPage={totalPages}
                    changePage={changePage}
                />
            </main>
        </section>
    );
};

export default APIServiceTable;