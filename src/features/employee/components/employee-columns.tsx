import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuthStore } from "@/context/auth-context";
import Admin, { AdminRole } from "@/models/admin";
import Employee from "@/models/employee";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Loader2, Pencil, Trash } from 'lucide-react';
import Link from "next/link";
import { useDeleteEmployeeById } from "../api/employee-query";

const employeeColumns: ColumnDef<Employee>[] = [
    {
        header: "NAME",
        accessorKey: "name",
        cell: ({ row }) => <div className="w-48 truncate">{row.original.name}</div>,
    },
    {
        header: "EMAIL",
        accessorKey: "email",
        cell: ({ row }) => <div className="text-[#6B7280] w-48 truncate">{row.original.email}</div>,
    },
    {
        header: "ROLE",
        accessorKey: "role",
        cell: ({ row }) => <div className="text-[#6B7280]">{row.original.role || 'N/A'}</div>,
    },
    {
        header: "CREATED ON",
        accessorKey: "createdAt",
        cell: ({ row }) => (
            <span className="text-[#6B7280]">
                {dayjs(row.original.createdAt).format("DD-MM-YYYY")}
            </span>
        ),
    },
    {
        header: "Actions",
        accessorKey: "actions",
        cell: ({ row }) => <ActionColumn employee={row.original} />,
    },
];

const ActionColumn = ({ employee }: { employee: Employee }) => {
    const { userDetails } = useAuthStore();
    const currentUser = userDetails as Admin;
    const { mutate: deleteEmployee, isPending: isDeleting } = useDeleteEmployeeById();

    let showActions = true;

    if (currentUser.role == AdminRole.AGENT) {
        showActions = false;
    }

    return (
        <div className="flex space-x-4 justify-end">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link href={`/dashboard/employee/${employee.id}/edit`}>
                            <Button size="icon" variant="ghost" aria-label="Edit Employee">
                                <Pencil className="w-5 h-5" />
                            </Button>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Edit Employee Details</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="icon" variant="ghost" aria-label="Delete Employee" onClick={() => deleteEmployee(employee.id!.toString())}>

                            {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash className="w-5 h-5" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Delete Employee</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export default employeeColumns;