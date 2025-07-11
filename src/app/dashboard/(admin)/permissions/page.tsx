"use client";

import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table-server";
import { Input } from "@/components/ui/input";
import { useGetAllPermissions } from "@/features/permission/api/permission-query";
import permissionColumns from "@/features/permission/components/permission-columns";
import Permission from "@/models/permission";
import Link from "next/link";
import { useMemo, useState } from "react";

const PermissionTable = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const { data, isSuccess, isFetching } = useGetAllPermissions({
        page: page,
        limit: 10,
        search: search
    });

    const permissions = useMemo(() => {
        if (isSuccess && data?.data?.permissions) {
            return Array.from(data.data.permissions).map((permission: any) => new Permission(permission));
        }
        return [];
    }, [data, isSuccess]);

    const totalPages = useMemo(() => {
        return Math.ceil(data?.data?.count / 10) || 1;
    }, [data, isSuccess]);

    const changePage = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <section className="container-main min-h-[60vh] my-12">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold">Permissions</h2>
                <div className="flex gap-5 flex-wrap">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Link href="/dashboard/permissions/create">
                        <Button>
                            Create Permission
                        </Button>
                    </Link>
                </div>
            </header>
            <main className="mt-4">
                <DataTable
                    page={page}
                    // loading={isFetching}
                    columns={permissionColumns}
                    data={permissions}
                    totalPage={totalPages}
                    changePage={changePage}
                />
            </main>
        </section>
    );
};

export default PermissionTable;