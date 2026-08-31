import React from 'react';
import { cn } from '@/utils/cn';

export interface ColumnDef<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  className?: string;
  keyExtractor?: (row: T) => string | number;
}

export function Table<T>({ data, columns, className, keyExtractor }: TableProps<T>) {
  return (
    <div className={cn("w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800", className)}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 dark:bg-surface-800/50 border-b border-gray-200 dark:border-gray-800">
            {columns.map((col, i) => (
              <th
                key={i}
                className={cn("px-6 py-3.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", col.className)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-surface-900">
          {data.length > 0 ? (
            data.map((row, idx) => (
              <tr key={keyExtractor ? keyExtractor(row) : ((row as any).id || idx)} className="hover:bg-gray-50/50 dark:hover:bg-surface-800/50 transition-colors">
                {columns.map((col, j) => (
                  <td key={j} className={cn("px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100", col.className)}>
                    {typeof col.accessor === 'function' ? col.accessor(row) : (row[col.accessor] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
