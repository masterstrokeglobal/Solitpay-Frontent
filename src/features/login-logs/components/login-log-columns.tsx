"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import LoginLog from "@/models/login-log";
import { Button } from "@/components/ui/button";
import {
    MapPin,
    Globe
} from "lucide-react";
import { toast } from "sonner";

const loginLogColumns: ColumnDef<LoginLog>[] = [
    {
        accessorKey: "merchant.name",
        header: "Merchant",
        cell: ({ row }) => {
            const merchantName = row.original.merchant?.name || "Unknown";
            return <span className="font-medium">{merchantName}</span>;
        },
    },
    {
        accessorKey: "ipAddress",
        header: "IP Address",
        cell: ({ row }) => <span className="font-mono text-sm">{row.original.ipAddress}</span>,
    },
    {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => {
            const copyLocation = () => {
                if (row.original.location) {
                    navigator.clipboard.writeText(row.original.location);
                    toast.success("Location coordinates copied to clipboard");
                }
            };

            return (
                <div className="flex items-center space-x-2">
                    <MapPin size={14} className="text-muted-foreground" />
                    <span className="text-sm">
                        {row.original.location || "Unknown"}
                    </span>
                    {row.original.location && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={copyLocation}
                            className="h-6 w-6"
                        >
                            <Globe size={14} />
                        </Button>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "platform",
        header: "Platform",
        cell: ({ row }) => <span className="text-sm">{row.original.platform || "Unknown"}</span>,
    },
    {
        accessorKey: "userAgent",
        header: "User Agent",
        cell: ({ row }) => {
            const userAgent = row.original.userAgent || "Unknown";
            const browser = userAgent.split(" ")[0];
            const version = userAgent.split(" ").slice(1).join(" ");
            return <span className="text-sm truncate max-w-[150px] block">{browser} {version}</span>;
        },
    },
    {
        accessorKey: "createdAt",
        header: "Login Time",
        cell: ({ row }) => format(new Date(row.original.createdAt || new Date()), "MMM dd, yyyy HH:mm"),
    }
];

export default loginLogColumns;