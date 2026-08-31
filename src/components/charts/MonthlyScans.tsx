import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const defaultData = [
  { name: 'Week 1', scans: 400 },
  { name: 'Week 2', scans: 550 },
  { name: 'Week 3', scans: 480 },
  { name: 'Week 4', scans: 700 },
];

export interface MonthlyScansProps {
  data?: Array<{ month?: string; name?: string; scans: number }>;
}

export const MonthlyScans: React.FC<MonthlyScansProps> = ({ data: externalData }) => {
  const chartData = (externalData || defaultData).map((d: any) => ({
    name: d.name || d.month,
    scans: d.scans,
  }));

  return (
    <div className="w-full h-64 md:h-80 text-sm">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-800" />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#4f46e5', fontWeight: 600 }}
          />
          <Area 
            type="monotone" 
            dataKey="scans" 
            stroke="#4f46e5" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorScans)" 
            activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
