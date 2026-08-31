import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SearchBar } from '@/components/ui/SearchBar';
import { Tabs } from '@/components/ui/Tabs';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Info, AlertTriangle, Search } from 'lucide-react';
import * as rulesService from '@/services/rulesService';
import { complianceRules } from '@/data/complianceRules';

export default function RulesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedAuthority, setSelectedAuthority] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [rules, setRules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['All', 'Common', 'Food', 'Edible Oil', 'Cosmetics', 'Household'];
  const authorities = ['All', 'Legal Metrology Division', 'FSSAI', 'CDSCO', 'BIS', 'Consumer Affairs', 'MOEF'];
  const statuses = ['All', 'Active', 'Draft', 'Deprecated'];

  useEffect(() => {
    const fetchRules = async () => {
      setIsLoading(true);
      try {
        const cat = activeTab === 'All' ? undefined : (activeTab.toLowerCase().replace(' ', '-') as any);
        const filteredRules = await rulesService.getRules({
          category: cat,
          authority: selectedAuthority === 'All' ? undefined : selectedAuthority,
          status: selectedStatus === 'All' ? undefined : (selectedStatus.toLowerCase() as any),
          search: searchQuery || undefined,
        });
        setRules(filteredRules || complianceRules);
      } catch (error) {
        console.error('Failed to fetch rules:', error);
        setRules(complianceRules);
      } finally {
        setIsLoading(false);
      }
    };

    // Simulate network delay
    const timer = setTimeout(() => fetchRules(), 500);
    return () => clearTimeout(timer);
  }, [searchQuery, activeTab, selectedAuthority, selectedStatus]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'success';
      case 'draft': return 'warning';
      case 'deprecated': return 'secondary';
      default: return 'default';
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Rules & Information</h1>
        <p className="text-slate-500 dark:text-slate-400">Browse applicable Indian product labelling compliance requirements</p>
        <div className="flex items-center gap-2 mt-2 text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>Some rules are conditional and may not apply to all products</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={(e: any) => setSearchQuery(e.target.value)}
            placeholder="Search rules..."
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500"
            value={selectedAuthority}
            onChange={(e) => setSelectedAuthority(e.target.value)}
          >
            {authorities.map(auth => (
              <option key={auth} value={auth}>{auth}</option>
            ))}
          </select>
          <select 
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <Tabs
        tabs={categories}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="p-5 space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </Card>
          ))}
        </div>
      ) : rules.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {rules.map((rule) => (
            <motion.div key={rule.id} variants={item}>
              <Card className="h-full flex flex-col p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-mono text-sm font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-700 dark:text-slate-300">
                    {rule.id}
                  </span>
                  <Badge variant={getStatusBadgeVariant(rule.status)}>
                    {rule.status}
                  </Badge>
                </div>
                
                <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white line-clamp-2">
                  {rule.requirement}
                </h3>
                
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 flex-grow">
                  {rule.description}
                </p>

                {rule.conditional && (
                  <div className="mb-4 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 text-xs p-2 rounded flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span>{rule.conditionalNote || 'Conditional requirement'}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {rule.applicableTo?.map((cat: string) => (
                    <Chip key={cat} size="sm" variant="secondary">{cat}</Chip>
                  ))}
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {rule.authority}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 truncate">
                      Ref: {rule.legalReference}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    View Rule Details
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyState
          icon={<Search className="w-12 h-12 text-slate-400" />}
          title="No rules found"
          description="We couldn't find any rules matching your filters."
          action={
            <Button onClick={() => {
              setSearchQuery('');
              setActiveTab('All');
              setSelectedAuthority('All');
              setSelectedStatus('All');
            }}>
              Clear Filters
            </Button>
          }
        />
      )}
    </div>
  );
}
