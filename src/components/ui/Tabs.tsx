import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content?: React.ReactNode;
}

export interface TabsProps {
  tabs: (Tab | string)[];
  activeTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab: controlledActiveTab, onChange, className }) => {
  const normalizedTabs: Tab[] = tabs.map((t) => (typeof t === 'string' ? { id: t, label: t } : t));
  const [internalActiveTab, setInternalActiveTab] = React.useState(normalizedTabs[0]?.id || '');
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;

  const handleTabClick = (tabId: string) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tabId);
    }
    onChange?.(tabId);
  };

  const activeContent = normalizedTabs.find((t) => t.id === activeTab)?.content;

  return (
    <div className="w-full space-y-4">
      <div className={cn("flex space-x-1 bg-gray-100/80 dark:bg-surface-900/50 p-1 rounded-xl backdrop-blur-sm", className)}>
        {normalizedTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                "relative flex flex-1 items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-colors z-10",
                isActive 
                  ? "text-gray-900 dark:text-white" 
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white dark:bg-surface-800 rounded-lg shadow-sm -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
            </button>
          );
        })}
      </div>
      {activeContent && <div>{activeContent}</div>}
    </div>
  );
};
