"use client";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table-server";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/context/auth-context";
import { useSurchargeQuery } from "@/features/surcharge/api/surcharge-query";
import surchargeColumns from "@/features/surcharge/components/surcharge-columns";
import { AdminRole } from "@/models/admin";
import Surcharge from "@/models/surcharge";
import { Search } from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";

const SurchargeTable = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");


    const { userDetails } = useAuthStore();

    const merchantId = userDetails?.role === AdminRole.Merchant ? userDetails?.id : null;

    // Fetch all surcharges with pagination, search query, and filters
    const { data, isSuccess, isFetching } = useSurchargeQuery({
        page: page,
        search: search,
        merchantId: merchantId,
    });



    const surcharges = useMemo(() => {
        if (isSuccess && data?.surcharges) {
            return Array.from(data.surcharges).map(
                (surcharge: any) => new Surcharge(surcharge)
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
                <h2 className="text-xl font-semibold text-white">Surcharges</h2>
                <div className="flex gap-5 ">
                    <div className="relative min-w-60 flex-1">
                        <Search size={18} className="absolute top-2.5 left-2.5" />
                        <Input
                            placeholder="Search"
                            onChange={handleSearch}
                            className="pl-10"
                        />
                    </div>

                    <Link href="/dashboard/surcharge/create">
                        <Button>Create Surcharge</Button>
                    </Link>


                </div>
            </header>
            <main className="mt-4">
                <DataTable
                    page={page}
                    loading={isFetching}
                    columns={surchargeColumns}
                    data={surcharges}
                    totalPage={totalPages}
                    changePage={changePage}
                />
            </main>
        </section>
    );
};

export default SurchargeTable;