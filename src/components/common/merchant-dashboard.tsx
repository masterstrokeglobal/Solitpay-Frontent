"use client"

import { useEffect, useMemo, useState } from "react"
import { DateRange } from "react-day-picker"
import { endOfDay, format, startOfDay, startOfMonth, startOfWeek } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wallet, CreditCard, BarChart2, PieChart, Loader2 } from 'lucide-react'
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { TransactionChart } from "@/features/merchant/transaction-chart"
import { TransactionDonut } from "@/features/merchant/transaction-donut"
import { useGetMerchantDashboardData } from "@/features/merchant/api/merchant-query"
import { useAuthStore } from "@/context/auth-context"
import { getSolitpayBalance } from "@/features/solitpay/api/solitpay-api"

type Props = {
    merchantId?: string;
}

export default function MerchantDashboard({ merchantId }: Props) {
    const [dateFilter, setDateFilter] = useState("month");
    const today = endOfDay(new Date())
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: startOfMonth(today), to: today
    })

    const { userDetails } = useAuthStore();
    const { data, isLoading, isSuccess } = useGetMerchantDashboardData({
        merchantId: merchantId,
        startDate: dateRange?.from,
        endDate: dateRange?.to
    });

    const merchantStats = useMemo(() => {
        if (isLoading) return null;
        if (!isSuccess) return null;
        return data?.data;
    }, [data, isLoading, isSuccess])

    const [solitpayBalance, setSolitpayBalance] = useState<string>("-")
    useEffect(() => {
        (async () => {
            try {
                const res = await getSolitpayBalance()
                setSolitpayBalance(res?.data?.wallet_balance ?? "-")
            } catch {}
        })()
    }, [])

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    }

    const handleDateFilterChange = (value: string) => {
        setDateFilter(value)

        const today = endOfDay(new Date())
        const startOfToday = startOfDay(new Date())

        switch (value) {
            case "today":
                setDateRange({ from: startOfToday, to: today })
                break
            case "week":
                setDateRange({ from: startOfWeek(today), to: today })
                break
            case "month":
                setDateRange({ from: startOfMonth(today), to: today })
                break
            case "lifetime":
                setDateRange({ from: new Date(2020, 0, 1), to: today })
                break
            default:
                // Keep custom date range if already set
                break
        }
    }

    return (
        <div className="space-y-6 p-4 min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            {/* Enhanced glassmorphism background elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-indigo-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse delay-500"></div>
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-2xl animate-pulse delay-1500"></div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-white/90 px-4 py-2 backdrop-blur-sm bg-white/10 rounded-xl border border-white/20">Dashboard</h1>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Select value={dateFilter} onValueChange={handleDateFilterChange}>
                        <SelectTrigger className="w-full sm:w-[180px] bg-white/10 backdrop-blur-xl border border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 shadow-2xl hover:shadow-3xl rounded-xl">
                            <SelectValue placeholder="Select date range" className="text-white/90 font-medium" />
                        </SelectTrigger>
                        <SelectContent className="bg-white/10 backdrop-blur-2xl border border-white/30 shadow-3xl rounded-xl overflow-hidden">
                            <SelectItem value="today" className="hover:bg-white/20 transition-colors duration-200 text-white/90">Today</SelectItem>
                            <SelectItem value="week" className="hover:bg-white/20 transition-colors duration-200 text-white/90">This Week</SelectItem>
                            <SelectItem value="month" className="hover:bg-white/20 transition-colors duration-200 text-white/90">This Month</SelectItem>
                            <SelectItem value="lifetime" className="hover:bg-white/20 transition-colors duration-200 text-white/90">Lifetime</SelectItem>
                            <SelectItem value="custom" className="hover:bg-white/20 transition-colors duration-200 text-white/90">Custom Range</SelectItem>
                        </SelectContent>
                    </Select>

                    <DatePickerWithRange
                        dateRange={dateRange}
                        onDateRangeChange={(range) => {
                            if (range?.from && range?.to) {
                                setDateFilter("custom")
                                setDateRange(range)
                            }
                        }}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
                        <Loader2 className="h-8 w-8 animate-spin text-white/80" />
                        <span className="ml-2 text-lg text-white/80">Loading dashboard data...</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card variant="glass" className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden hover:scale-105 hover:bg-white/15 group">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-white/90">Pay In Balance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="text-3xl font-bold text-white/95">{merchantStats ? formatCurrency(merchantStats.totalPayIn) : '₹ 0'}</span>
                                        <p className="text-xs text-white/70 mt-1">Total User Deposits</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center border border-emerald-500/30 shadow-lg group-hover:bg-emerald-500/30 transition-all duration-300">
                                        <Wallet className="h-6 w-6 text-emerald-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card variant="glass" className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden hover:scale-105 hover:bg-white/15 group">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-white/90">User Withdrawal</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="text-3xl font-bold text-white/95">{merchantStats ? formatCurrency(merchantStats.totalPayOut) : '₹ 0'}</span>
                                        <p className="text-xs text-white/70 mt-1">Total User Withdrawal</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-rose-500/20 backdrop-blur-sm flex items-center justify-center border border-rose-500/30 shadow-lg group-hover:bg-rose-500/30 transition-all duration-300">
                                        <CreditCard className="h-6 w-6 text-rose-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card variant="glass" className="bg-white/30 backdrop-blur-md border-white/40 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden hover:scale-105 hover:bg-white/40">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-700">Merchant Withdrawal</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="text-3xl font-bold text-gray-800">{merchantStats ? formatCurrency(merchantStats.totalMerchantPayOut) : '₹ 0'}</span>
                                        <p className="text-xs text-gray-600 mt-1">Total Merchant Withdrawal</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-blue-500/30 backdrop-blur-sm flex items-center justify-center border border-blue-500/40 shadow-lg">
                                        <CreditCard className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card variant="glass" className="bg-white/20 backdrop-blur-md border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-700">Wallet Balance (Solitpay)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="text-3xl font-bold text-gray-800">₹ {solitpayBalance}</span>
                                        <p className="text-xs text-gray-600 mt-1">Available balance</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-indigo-500/20 backdrop-blur-sm flex items-center justify-center border border-indigo-500/30">
                                        <Wallet className="h-6 w-6 text-indigo-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card variant="glass" className="lg:col-span-2">
                            <CardHeader className="border-b border-gray-100 pb-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <BarChart2 className="h-5 w-5 text-indigo-600" />
                                        <CardTitle className="text-indigo-700">Transaction Statistics</CardTitle>
                                    </div>
                                    <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
                                        {dateFilter === "custom" && dateRange?.from && dateRange?.to
                                            ? `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}`
                                            : dateFilter.charAt(0).toUpperCase() + dateFilter.slice(1)}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <TransactionChart />
                            </CardContent>
                        </Card>

                        <Card variant="glass" className="transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4">
                                <div className="flex items-center gap-2">
                                    <PieChart className="h-5 w-5 " />
                                    <CardTitle className="">Transaction Status</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <TransactionDonut failed={merchantStats?.failedCount} pending={merchantStats?.pendingCount} successful={merchantStats?.completedCount} />
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </div>
    )
}
