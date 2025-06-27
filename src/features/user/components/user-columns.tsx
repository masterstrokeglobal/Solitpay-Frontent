import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuthStore } from "@/context/auth-context";
import Admin, { AdminRole } from "@/models/admin";
import Merchant from "@/models/merchant";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { ChartArea, Eye, Pen, Pencil } from 'lucide-react';
import Link from "next/link";

const merchantColumns: ColumnDef<Merchant>[] = [
    {
        header: "NAME",
        accessorKey: "name",
        cell: ({ row }) => <div className="w-48 truncate text-white">{row.original.name}</div>,
    },
    {
        header: "EMAIL",
        accessorKey: "email",
        cell: ({ row }) => <div className="text-white w-48 truncate">{row.original.email}</div>,
    },
    
    {
        header: "COMPANY NAME",
        accessorKey: "companyName",
        cell: ({ row }) => <div className="w-48 truncate text-white">{row.original.companyName}</div>,
    },
    {
        header: "CREATED ON",
        accessorKey: "createdAt",
        cell: ({ row }) => (
            <span className="text-white">
                {dayjs(row.original.createdAt).format("DD-MM-YYYY")}
            </span>
        ),
    },
    {
        header: "Actions",
        accessorKey: "actions",
        cell: ({ row }) => <ActionColumn merchant={row.original} />,
    },
];



const ActionColumn = ({ merchant }: { merchant: Merchant }) => {
    const { userDetails } = useAuthStore();
    const currentUser = userDetails as Admin;

    let showDelete = true;

    if (currentUser.role == AdminRole.AGENT) {
        showDelete = false;
    }

    return (
        <div className="flex space-x-4 justify-end">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link href={`/dashboard/merchants/${merchant.id}/stats`}>
                            <Button size="icon" variant="ghost" aria-label="View Stats">
                                <ChartArea className="w-5 h-5" />
                            </Button>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>View Statistics</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link href={`/dashboard/merchants/${merchant.id}/permissions`}>
                            <Button size="icon" variant="ghost" aria-label="View Permissions">
                                <Pencil className="w-5 h-5" />
                            </Button>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Edit Merchant Details</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link href={`/dashboard/merchants/${merchant.id}`}>
                            <Button size="icon" variant="ghost" aria-label="View Merchant">
                                <Eye className="w-5 h-5" />
                            </Button>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>View Merchant Details</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};



export default merchantColumns;
