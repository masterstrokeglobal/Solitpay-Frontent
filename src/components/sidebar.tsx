"use client";
import { cn } from "@/lib/utils";
import { BriefcaseBusiness, Home, LucideIcon, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuthStore } from '@/context/auth-context';
import { AdminRole } from '@/models/admin';
import Logo from "./common/logo";

interface SubMenuItem {
    name: string;
    link: string;
}

interface MenuItem {
    name: string;
    icon: LucideIcon;
    link?: string;
    subItems?: SubMenuItem[];
}
const adminMenuItems: MenuItem[] = [
    {
        name: 'Dashboard',
        icon: Home,
        link: '/dashboard',
    },
    {
        name: 'Merchants',
        icon: BriefcaseBusiness,
        link: '/dashboard/merchants',
    },
    {
        name: 'Transactions',
        icon: Users,
        link: '/dashboard/admin-transactions',
    },
];




const Sidebar = ({ className }: PropsWithClassName) => {

    const merchantMenuItems: MenuItem[] = [
        {
            name: 'Dashboard',
            icon: Home,
            link: '/dashboard/merchant-dashboard',
        },
        {
            name: 'Transactions',
            icon: Users,
            link: '/dashboard/transactions',
        },
    ];

    const pathname = usePathname();
    const { userDetails } = useAuthStore();

    const renderMenuItem = (item: MenuItem) => {
        const isActive = pathname === item.link ||
            (item.subItems && item.subItems.some(subItem => pathname === subItem.link));

        if (item.subItems) {
            return (
                <AccordionItem value={item.name} key={item.name}>
                    <AccordionTrigger className={cn(
                        "flex items-center py-2 px-4 text-sm font-medium text-gray-300 [&[data-state=open]]:text-white [&[data-state=open]]:bg-white/20 [&[data-state=open]]:rounded-b-none rounded-md hover:bg-white/10 hover:text-white",
                        isActive && "bg-white/20 text-white hover:bg-white/30"
                    )}>
                        <span className="flex items-center">
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.name}
                        </span>
                    </AccordionTrigger>
                    <AccordionContent className='bg-white/10 rounded-b-md pl-4'>
                        <div className="flex flex-col space-y-1 px-4">
                            {item.subItems.map((subItem) => (
                                <Link
                                    key={subItem.name}
                                    href={subItem.link}
                                    className={cn(
                                        "flex items-center py-2 px-2 text-sm font-medium rounded-md hover:bg-white/20 hover:text-white text-gray-300",
                                        "transition-colors duration-200",
                                        pathname === subItem.link && "bg-white/20 text-white"
                                    )}
                                >
                                    {subItem.name}
                                </Link>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            );
        } else if (item.link) {
            return (
                <Link
                    key={item.name}
                    href={item.link}
                    className={cn(
                        "flex items-center py-2 px-4 text-sm font-medium rounded-md hover:bg-white/10 hover:text-white text-gray-300",
                        "transition-colors duration-200",
                        isActive && "bg-white/20 text-white hover:bg-white/30"
                    )}
                >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                </Link>
            );
        }
        return null;
    };

    const menuItems = userDetails?.role === AdminRole.SUPER_ADMIN ? adminMenuItems : merchantMenuItems;

    // Simplified sidebar per request: only core items retained

    return (
        <div className={cn("flex  flex-col bg-[url('/images/sidebar.jpg')] bg-cover rounded-r-xl shadow-sm bg-center", className)}>
            <div className="flex h-16 items-center  px-4">
                <Logo className="text-white" />
            </div>
            <nav className="flex-1 overflow-y-auto px-4 pt-8">
                <Accordion type="multiple" className="w-full space-y-2">
                    {menuItems.map(renderMenuItem)}
                </Accordion>
            </nav>
        </div>
    );
};

export default Sidebar;