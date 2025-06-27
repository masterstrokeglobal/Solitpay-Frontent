"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

interface TransactionDonutProps {
  successful?: number;
  pending?: number;
  failed?: number;
}

type DataItem = {
  name: string;
  value: number;
  color: string;
}

export function TransactionDonut({ 
  successful = 0, 
  pending = 0, 
  failed = 0 
}: TransactionDonutProps) {
  const data: DataItem[] = [
    { name: "Successful", value: successful, color: "#10b981" },
    { name: "Failed", value: failed, color: "#ef4444" },
    { name: "Pending", value: pending, color: "#f59e0b" },
  ]

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
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
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="text-center">
        <h3 className="text-lg font-medium text-white">Total</h3>
        <p className="text-2xl font-bold text-white">{total}</p>
      </div>
      
      <div className="flex flex-wrap gap-4 w-full">
        {data.map((item) => (
          <div 
            key={item.name} 
            className="flex flex-1 items-center p-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
              <span className="font-medium text-white">{item.name}</span>
            </div>
            <span className="text-lg font-bold ml-auto text-white">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}