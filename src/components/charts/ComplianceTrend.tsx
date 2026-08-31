import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const defaultData = [
  { name: 'Jan', rate: 85 },
  { name: 'Feb', rate: 88 },
  { name: 'Mar', rate: 86 },
  { name: 'Apr', rate: 90 },
  { name: 'May', rate: 92 },
  { name: 'Jun', rate: 94 },
  { name: 'Jul', rate: 96 },
];

export interface ComplianceTrendProps {
  data?: Array<{ month?: string; name?: string; rate: number }>;
}

export const ComplianceTrend: React.FC<ComplianceTrendProps> = ({ data: externalData }) => {
  const chartData = (externalData || defaultData).map((d: any) => ({
    name: d.name || d.month,
    rate: d.rate,
  }));

  return (
    <div className="w-full h-64 md:h-80 text-sm">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
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
            domain={['dataMin - 5', 100]}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#4f46e5', fontWeight: 600 }}
          />
          <Line 
            type="monotone" 
            dataKey="rate" 
            stroke="#4f46e5" 
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
            activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
