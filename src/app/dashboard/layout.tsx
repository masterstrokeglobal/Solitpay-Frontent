"use client";

import LoadingScreen from "@/components/common/loading-screen";
import Sidebar from "@/components/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/context/auth-context";
import useLogin from "@/hooks/use-login";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";
import Navbar from "./navbar";
import AnimatedWaveBackground from "./animated-background";


const DashboardLayout = ({ children }: PropsWithChildren) => {
    const { loading, userDetails } = useAuthStore();
    const router = useRouter();
    useLogin();
    useEffect(() => {
        if (!loading && !userDetails) {
            router.push("/auth/login");
        }
    }, [userDetails, loading, router]);

    if (!userDetails) {
        return <LoadingScreen className="h-screen" />
    }

    console.log(userDetails);
    return (
        <div className="min-h-screen w-full relative md:p-4 ">
            <AnimatedWaveBackground className="absolute top-0 left-0 w-full h-full" />
            <Sidebar className="h-screen hidden md:block w-64 absolute top-0 left-0" />
            <ScrollArea className="flex flex-col md:ml-64  relative h-[calc(100vh-32px)]  ">
                <Navbar />
                <main className="flex-1 p-4 lg:p-6">
                    {children}
                </main>
            </ScrollArea>
        </div>
    )
}

export default DashboardLayout;