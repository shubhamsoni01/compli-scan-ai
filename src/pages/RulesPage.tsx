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
import { Info, Search, Sparkles } from 'lucide-react';
import { SIHLogo } from '@/components/ui/SIHLogo';
import { MinistryLogo } from '@/components/ui/MinistryLogo';
import * as rulesService from '@/services/rulesService';
import { complianceRules } from '@/data/complianceRules';

import { OfficialGazetteDocsCard } from '@/components/scan/OfficialGazetteDocsCard';

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
  }, [activeTab, selectedAuthority, selectedStatus, searchQuery]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight font-heading text-slate-900 dark:text-slate-100">
              Rules & Statutory Knowledge Base
            </h1>
            <span className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              <Sparkles size={12} />
              <span>Gazette 2026 Engine</span>
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse official Legal Metrology, FSSAI, and CDSCO packaged commodity labelling mandates.
          </p>
        </div>

        {/* National Governance Badge */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 shadow-xs shrink-0">
          <SIHLogo size="md" />
          <div className="h-8 w-px bg-slate-200 dark:border-slate-800" />
          <MinistryLogo size="md" />
        </div>
      </div>

      {/* Info Callout */}
      <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-3">
        <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-indigo-900 dark:text-indigo-200 space-y-0.5">
          <p className="font-semibold">Deterministic Legal Compliance Engine</p>
          <p className="text-indigo-700/80 dark:text-indigo-300/80">
            Rules marked conditional depend on product net weight, perishable shelf-life, and mandatory commodity schedules under the Legal Metrology (Packaged Commodities) Rules, 2011 and FSSAI 2020 Gazette.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by rule ID (e.g. LM-001, FSSAI-001), keyword, or authority..."
          className="w-full"
        />

        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <Tabs
            tabs={categories.map(cat => ({ id: cat, label: cat }))}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="flex flex-wrap gap-2 items-center">
            {/* Authority Filter */}
            <select
              value={selectedAuthority}
              onChange={(e) => setSelectedAuthority(e.target.value)}
              className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {authorities.map(auth => (
                <option key={auth} value={auth}>{auth}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Rules Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <Skeleton key={n} variant="card" className="h-48" />
          ))}
        </div>
      ) : rules.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05 }}
        >
          {rules.map((rule) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="h-full flex flex-col p-5 hover:shadow-md transition-shadow border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    {rule.ruleId || rule.id}
                  </span>
                  <Badge variant={rule.status === 'active' ? 'success' : rule.status === 'draft' ? 'warning' : 'outline'}>
                    {rule.status}
                  </Badge>
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-2 line-clamp-2">
                  {rule.requirement}
                </h3>
                
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 flex-grow">
                  {rule.description}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {rule.authority}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 truncate">
                      Ref: {rule.legalReference}
                    </span>
                  </div>
                  <a
                    href="https://www.fssai.gov.in/upload/uploadfiles/files/Gazette_Notification_Labelling_Display_18_11_2020.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Official Gazette PDF ↗
                  </a>
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

      {/* Official Government Gazettes & Acts Direct PDF Library */}
      <OfficialGazetteDocsCard />
    </div>
  );
}
