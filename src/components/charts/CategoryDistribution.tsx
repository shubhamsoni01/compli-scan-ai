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
  { name: 'Snacks', value: 400 },
  { name: 'Beverages', value: 300 },
  { name: 'Dairy', value: 200 },
  { name: 'Meat', value: 150 },
  { name: 'Bakery', value: 100 },
];

const COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];

export interface CategoryDistributionProps {
  data?: Array<{ category?: string; name?: string; count?: number; value?: number }>;
}

export const CategoryDistribution: React.FC<CategoryDistributionProps> = ({ data: externalData }) => {
  const chartData = (externalData || defaultData).map((d: any) => ({
    name: d.name || d.category,
    value: d.value !== undefined ? d.value : d.count,
  }));

  return (
    <div className="w-full h-64 md:h-80 text-sm">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" className="dark:stroke-gray-800" />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            width={80}
          />
          <Tooltip
            cursor={{ fill: '#f3f4f6', className: 'dark:fill-gray-800' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
            {chartData.map((_entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
