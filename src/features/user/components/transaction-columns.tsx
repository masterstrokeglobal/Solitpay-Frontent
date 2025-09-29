import { ColumnDef } from "@tanstack/react-table";
import { Transaction, TransactionStatus, TransactionType } from "@/models/transaction";
import { Badge } from "@/components/ui/badge";

const transactionColumns: ColumnDef<Transaction>[] = [
    {
        header: "ID",
        accessorKey: "id",
        cell: ({ row }) => (
            <div className="font-medium text-white">{row.original.id}</div>
        ),
    },
    {
        header: "TYPE",
        accessorKey: "type",
        cell: ({ row }) => {
            const type = row.original.type;
            const colorClass = type === TransactionType.DEPOSIT
                ? "text-green-600"
                : "text-red-600";
            return (
                <Badge variant={type === TransactionType.DEPOSIT ? "success" : "destructive"}>
                    {type}
                </Badge>
            );
        },
    },
    {
        header: "UTR",
        accessorKey: "pgId",
        cell: ({ row }) => (
            <div className="text-white">
                {row.original.pgId}
            </div>
        ),
    },
    {
        header: "AMOUNT",
        accessorKey: "amount",
        cell: ({ row }) => (
            <div className="font-medium text-white">
                Rs.{row.original.amount.toFixed(2)}
            </div>
        ),
    },
    {
        header: "STATUS",
        accessorKey: "status",
        cell: ({ row }) => {
            const status = row.original.status;
            let variant = "";

            switch (status) {
                case TransactionStatus.COMPLETED:
                    variant = "success";
                    break;
                case TransactionStatus.PENDING:
                    variant = "warning";
                    break;
                case TransactionStatus.FAILED:
                    variant = "destructive";
                    break;
            }

            return (
                <Badge variant={variant as any}>
                    {status}
                </Badge>
            );
        },
    },
    // Platform fee columns removed per request
    {
        header: "CREATED AT",
        accessorKey: "createdAt",
        cell: ({ row }) => {
            const utc = new Date(row.original.createdAt);
            const istMs = utc.getTime() + (5.5 * 60 * 60 * 1000);
            const d = new Date(istMs);
            const pad = (n: number) => n.toString().padStart(2, '0');
            const dd = pad(d.getDate());
            const mm = pad(d.getMonth() + 1);
            const yyyy = d.getFullYear();   
            let hh = d.getHours();
            const min = pad(d.getMinutes());
            const sec = pad(d.getSeconds());
            const ampm = hh >= 12 ? 'pm' : 'am';
            hh = hh % 12; hh = hh ? hh : 12; // 12-hour format
            const hhStr = pad(hh);
            const display = `${dd}/${mm}/${yyyy}, ${hhStr}:${min}:${sec} ${ampm}`;
            return <div className="text-white">{display}</div>;
        },
    },
];

export default transactionColumns;