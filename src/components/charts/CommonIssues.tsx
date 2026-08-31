import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

const defaultData = [
  { issue: 'Missing Allergen Info', count: 120 },
  { issue: 'Incorrect Font Size', count: 98 },
  { issue: 'Invalid Additive Code', count: 86 },
  { issue: 'Missing Net Weight', count: 45 },
  { issue: 'Improper Date Format', count: 32 },
];

export interface CommonIssuesProps {
  data?: Array<{ issue: string; count: number; percentage?: number }>;
}

export const CommonIssues: React.FC<CommonIssuesProps> = ({ data: externalData }) => {
  const chartData = externalData || defaultData;

  return (
    <div className="w-full h-64 md:h-80 text-sm">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" className="dark:stroke-gray-800" />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="issue" 
            type="category" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 11 }}
            width={120}
          />
          <Tooltip
            cursor={{ fill: '#f3f4f6', className: 'dark:fill-gray-800' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#ef4444', fontWeight: 600 }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
            {chartData.map((_entry: any, index: number) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index < 2 ? '#ef4444' : index < 4 ? '#f59e0b' : '#fbbf24'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
