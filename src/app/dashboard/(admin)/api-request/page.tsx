"use client";

import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table-server";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/context/auth-context";
import { AdminRole } from "@/models/admin";
import APIRequest, { ApiRequestStatus } from "@/models/api-request";
import { Search, Filter } from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllAPIRequests } from "@/features/api-service/api/api-service-query";
import apiRequestColumns from "@/features/api-service/components/api-request-column";

const APIRequestTable = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApiRequestStatus | "all">("all");

  const { userDetails } = useAuthStore();

  const { data, isSuccess, isFetching } = useGetAllAPIRequests({
    page: page,
    search: search,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const apiRequests = useMemo(() => {
    if (isSuccess && data?.data?.apiRequests) {
      return Array.from(data.data.apiRequests).map(
        (apiRequest: any) => new APIRequest(apiRequest)
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

  // Handle status filter change
  const handleStatusChange = (value: string) => {
    setStatusFilter(value as ApiRequestStatus | "all");
    setPage(1); // Reset to first page on filter change
  };

  // Change page when pagination controls are used
  const changePage = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <section className="container-main min-h-[60vh] my-12">
      <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
        <h2 className="text-xl font-semibold text-white">API Requests</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex gap-2 flex-1">
            <div className="relative min-w-52 flex-1">
              <Search size={18} className="absolute top-2.5 left-2.5" />
              <Input
                placeholder="Search"
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-40">
                <div className="flex items-center gap-2">
                  <Filter size={16} />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value={ApiRequestStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={ApiRequestStatus.APPROVED}>Approved</SelectItem>
                <SelectItem value={ApiRequestStatus.REJECTED}>Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>
      <main className="mt-4">
        <DataTable
          page={page}
          loading={isFetching}
          columns={apiRequestColumns}
          data={apiRequests}
          totalPage={totalPages}
          changePage={changePage}
        />
      </main>
    </section>
  );
};

export default APIRequestTable;