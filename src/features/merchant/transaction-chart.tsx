"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useGetBarChartData } from "./api/merchant-query"

export function TransactionChart() {
  const { data, isLoading } = useGetBarChartData({});
  
  if (isLoading) return <div className="text-white">Loading...</div>
  
  // Transform the data to match the expected format for the chart
  const chartData = data?.data?.map((item: { month: any; totalPayIn: any; totalWithdraw: any; totalPayOut: any; }) => ({
    name: item.month,  // "name" for X-axis
    userDeposit: item.totalPayIn,
    userWithdrawal: item.totalWithdraw,
    merchantPayout: item.totalPayOut
  })) || [];
  
  if (chartData.length === 0) return <div className="text-white">No data</div>
  
  return (
    <div className="w-full h-72" >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="white" />
          <XAxis dataKey="name" stroke="white" tick={{ fill: 'white' }} />
          <YAxis stroke="white" tick={{ fill: 'white' }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)', 
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="userDeposit" 
            stackId="1" 
            stroke="white" 
            fill="white" 
            fillOpacity={0.6} 
          />
          <Area 
            type="monotone" 
            dataKey="userWithdrawal" 
            stackId="1" 
            stroke="white" 
            fill="white" 
            fillOpacity={0.6} 
          />
          <Area 
            type="monotone" 
            dataKey="merchantPayout" 
            stackId="1" 
            stroke="white" 
            fill="white" 
            fillOpacity={0.6} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}