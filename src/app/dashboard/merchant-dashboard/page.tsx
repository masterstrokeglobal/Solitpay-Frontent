"use client"

import { useMemo, useState } from "react"
import { DateRange } from "react-day-picker"
import { addDays, endOfDay, format, startOfDay, startOfMonth, startOfWeek } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wallet, CreditCard, BarChart2, PieChart, Loader2 } from 'lucide-react'
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { TransactionChart } from "@/features/merchant/transaction-chart"
import { TransactionDonut } from "@/features/merchant/transaction-donut"
import { useGetMerchantDashboardData } from "@/features/merchant/api/merchant-query"
import { useAuthStore } from "@/context/auth-context"

export default function Dashboard() {
  const [dateFilter, setDateFilter] = useState("month");
  const today = endOfDay(new Date())
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(today), to: today
  })

  const { userDetails } = useAuthStore();
  const { data, isLoading, isSuccess } = useGetMerchantDashboardData({
    merchantId: userDetails?.id,
    startDate: dateRange?.from,
    endDate: dateRange?.to
  });

  const merchantStats = useMemo(() => {
    if (isLoading) return null;
    if (!isSuccess) return null;
    return data?.data;
  }, [data, isLoading, isSuccess])

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
    <div className="space-y-6 p-6  relative overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select value={dateFilter} onValueChange={handleDateFilterChange}>
            <SelectTrigger className="w-full sm:w-[180px] border-indigo-200 hover:border-indigo-400 transition-colors">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="lifetime">Lifetime</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
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
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2 text-lg">Loading dashboard data...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border border-emerald-700 shadow-lg overflow-hidden bg-gradient-to-t from-emerald-700/80 to-emerald-600/80 backdrop-blur-md text-white hover:shadow-xl transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-emerald-100">Pay In Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-3xl font-bold">{merchantStats ? formatCurrency(merchantStats.totalPayIn) : '₹ 0'}</span>
                    <p className="text-xs text-emerald-100 mt-1">Total User Deposits</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Wallet className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-red-700 shadow-lg overflow-hidden bg-gradient-to-t from-red-700/80 to-red-600/80 backdrop-blur-md text-white hover:shadow-xl transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-rose-100">User Withdrawals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-3xl font-bold">{merchantStats ? formatCurrency(merchantStats.totalPayOut) : '₹ 0'}</span>
                    <p className="text-xs text-rose-100 mt-1">Total User Withdrawals</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-blue-700 shadow-lg overflow-hidden bg-gradient-to-t from-blue-700/80 to-blue-600/80 backdrop-blur-md text-white hover:shadow-xl transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-100">Merchant Withdrawals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-3xl font-bold">{merchantStats ? formatCurrency(merchantStats.totalMerchantPayOut) : '₹ 0'}</span>
                    <p className="text-xs text-blue-100 mt-1">Total Merchant Withdrawals</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-indigo-700 shadow-lg overflow-hidden bg-gradient-to-t from-indigo-700/80 to-indigo-600/80 backdrop-blur-md text-white hover:shadow-xl transition-shadow">
              <CardHeader className="pb-2"> 
                <CardTitle className="text-sm font-medium text-indigo-100">Wallet Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-3xl font-bold">{merchantStats ? formatCurrency(merchantStats.wallet) : '₹ 0'}</span>
                    <p className="text-xs text-indigo-100 mt-1">Available balance</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Wallet className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card variant="glass" className="lg:col-span-2 border border-white/20 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-t from-white/10 to-white/5 backdrop-blur-md">
              <CardHeader className="border-b border-white/20 pb-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="h-5 w-5 text-indigo-50" />
                    <CardTitle className="text-indigo-50">Transaction Statistics</CardTitle>
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

            <Card variant="glass" className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between border-b border-white/20 pb-4">
                <div className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-indigo-50" />
                  <CardTitle className="text-indigo-50">Transaction Status</CardTitle>
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