"use client";

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
import { Search } from "lucide-react";
import React, { useMemo, useState } from "react";

import { useAuthStore } from "@/context/auth-context";
import { AdminRole } from "@/models/admin";
import { useGetAllMerchantApiKeys } from "../api/merchant-api-query";
import { ApiKeyMode, ApiKeyStatus } from "@/models/merchant-api";
import merchantApiKeyColumns from "./merchant-api-columns";
import CreateApiKeyDialog from "./generate-key-dialog";
import { Button } from "@/components/ui/button";

type Props = {
    merchantId?: string;
};

const MerchantApiKeyTable = ({ merchantId }: Props) => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [mode, setMode] = useState<string | "">("");
    const [status, setStatus] = useState<string | "">("");
    const { userDetails } = useAuthStore();

    const activeMerchantId = userDetails?.role === AdminRole.Merchant ? userDetails?.id : merchantId;

    // Fetch all API keys with pagination and filters
    const { data, isSuccess, isFetching } = useGetAllMerchantApiKeys({
        page: page,
        search: search,
        mode: mode === "all" ? "" : mode,
        merchantId: activeMerchantId,
        status: status === "all" ? "" : status,
    });

    const apiKeys = useMemo(() => {
        if (isSuccess && data?.data?.data) {
            return Array.from(data.data.data);
        }
        return [];
    }, [data, isSuccess]);

    // Calculate total pages based on data count
    const totalPages = useMemo(() => {
        return data?.data?.totalPages || 1;
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
                <h2 className="text-xl font-semibold text-white">API Keys</h2>
                <div className="flex gap-5">
                    <div className="relative min-w-60 flex-1">
                        <Search size={18} className="absolute top-3 left-2.5 text-blue-600 z-10" />
                        <Input
                        glass
                            placeholder="Search by header key"
                            onChange={handleSearch}
                            className="pl-10"
                        />
                    </div>
                    {/* Select for Mode Filter */}
                    <Select value={mode} onValueChange={(val) => {
                        setMode(val);
                        setPage(1);
                    }}>
                        <SelectTrigger>
                            <SelectValue placeholder="All Modes" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Modes</SelectLabel>
                                <SelectItem value="all">All Modes</SelectItem>
                                <SelectItem value={ApiKeyMode.LIVE_MODE}>Live Mode</SelectItem>
                                <SelectItem value={ApiKeyMode.TEST_MODE}>Test Mode</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {/* Select for Status Filter */}
                    <Select value={status} onValueChange={(val) => {
                        setStatus(val);
                        setPage(1);
                    }}>
                        <SelectTrigger>
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Status</SelectLabel>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value={ApiKeyStatus.ACTIVE}>Active</SelectItem>
                                <SelectItem value={ApiKeyStatus.NOT_ACTIVE}>Not Active</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <CreateApiKeyDialog >
                        <Button>Generate New Key</Button>
                    </CreateApiKeyDialog>
                </div>
            </header>
            <main className="mt-4">
                <DataTable
                    page={page}
                    loading={isFetching}
                    columns={merchantApiKeyColumns as any}
                    data={apiKeys}
                    totalPage={totalPages}
                    changePage={changePage}
                />
            </main>
        </section>
    );
};

export default MerchantApiKeyTable;