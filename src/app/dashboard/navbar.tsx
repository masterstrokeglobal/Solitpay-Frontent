import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuthStore } from "@/context/auth-context";
import { useDashboardStats, useLogout } from "@/features/user/data/user-queries";
import { cn } from "@/lib/utils";
import { ArrowLeft, CircleUser, Menu, Wallet2 } from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const { data, isLoading } = useDashboardStats();
    const { userDetails } = useAuthStore();
    const { mutate } = useLogout();
    const router = useRouter();

    const isMerchant = userDetails?.isMerchant;

    return (
        <header
            className={cn(
                "relative flex items-center h-[40px] min-h-[40px] w-full z-20 px-2",
            )}
        >
            {/* Mobile menu button (hidden on desktop) */}
            <div className="flex items-center h-full">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="glass"
                            size="icon"
                            className="md:hidden  rounded-full w-8 h-8 p-0 flex items-center justify-center shadow-none border-none"
                            style={{
                                boxShadow: "0 0 0 0 transparent",
                            }}
                        >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex flex-col bg-white/10 backdrop-blur-md border-white/20">
                        <Sidebar />
                    </SheetContent>
                </Sheet>
                <Button variant="glass" onClick={() => router.back()}  >
                    <ArrowLeft className="h-5 w-5 mr-2" />  Back
                </Button>
            </div>

            {/* Center: nothing, just take up space */}
            <div className="flex-1" />

            {/* Right: wallet (if merchant), then user menu */}
            <div className="flex items-center gap-2">
                {isMerchant && (
                    <Button
                        variant="glass"
                        tabIndex={-1}
                    >
                        <Wallet2 className="h-5 w-5" />
                        <span className="whitespace-nowrap text-base font-medium">
                            {isLoading
                                ? 'Loading...'
                                : data
                                    ? `₹ ${data.data?.user?.wallet?.amount}`
                                    : '₹ 0'}
                        </span>
                    </Button>
                )}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="bg-white rounded-full w-8 h-8 p-0 flex items-center justify-center shadow-none border-none"
                            style={{
                                boxShadow: "0 0 0 0 transparent",
                            }}
                        >
                            <CircleUser className="h-5 w-5 text-[#2a2e5a]" />
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                        <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
                        {isMerchant && (
                            <Link href="/dashboard/merchant-stats">
                                <DropdownMenuItem className="text-white hover:bg-white/10">Profile</DropdownMenuItem>
                            </Link>
                        )}
                        <DropdownMenuSeparator className="bg-white/20" />
                        <DropdownMenuItem
                            onClick={() => {
                                mutate();
                            }}
                            className="text-white hover:bg-white/10"
                        >
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default Navbar;