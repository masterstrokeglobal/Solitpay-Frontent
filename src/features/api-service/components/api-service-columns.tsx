import { AlertDialog, AlertDialogDescription, AlertDialogTitle, AlertDialogHeader, AlertDialogContent, AlertDialogTrigger, AlertDialogCancel, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import APIService from "@/models/api-service";
import { Trash } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { useDeleteAPIService } from "../api/api-service-query";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";

const apiServiceColumns: ColumnDef<APIService>[] = [
    {
        header: "Name",
        accessorKey: "name",
    },
    {
        header: "Description",
        accessorKey: "description",
    },
    {
        header: "Price",
        accessorKey: "price",
    },
    {
        header: "Active",
        accessorKey: "active",
        cell: ({ row }) => {
            return row.original.active ? <Badge variant="default">Active</Badge> : <Badge variant="destructive">Inactive</Badge>;
        }
    },
    {
        header: "Created At",
        accessorKey: "createdAt",
        cell: ({ row }) => {
            const date = new Date(row.original.createdAt!);
            return dayjs(date).format("DD/MM/YYYY");
        }
    },
    {
        header: "Updated At",
        accessorKey: "updatedAt",
        cell: ({ row }) => {
            const date = new Date(row.original.updatedAt!);
            return dayjs(date).format("DD/MM/YYYY");
        }
    },
    {
        header: "Actions",
        accessorKey: "actions",
        cell: ({ row }) => <ActionCell id={row.original.id!} />,
    },
];

const ActionCell = ({ id }: { id: number }) => {
    const { mutate: deleteSurcharge, isPending } = useDeleteAPIService();
    return <div className="flex gap-2">
        <Link href={`/dashboard/api-service/${id}`}>
            <Button variant="outline">
                <Pencil />
            </Button>
        </Link>

        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">
                    <Trash />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Cancel</Button>
                    </AlertDialogCancel>
                    <Button variant="destructive"
                        disabled={isPending}
                        onClick={() => deleteSurcharge(id)}>
                        {isPending ? "Deleting..." : "Delete"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
}

export default apiServiceColumns;
