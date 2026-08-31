import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, CheckCircle, AlertTriangle, Eye, Users, RefreshCw } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ComplianceTrend } from '@/components/charts/ComplianceTrend';
import { CategoryDistribution } from '@/components/charts/CategoryDistribution';
import { CommonIssues } from '@/components/charts/CommonIssues';
import { MonthlyScans } from '@/components/charts/MonthlyScans';
import { fetchRealStats, type RealStatsResponse } from '@/services/api';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<RealStatsResponse | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadStats = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchRealStats();
      setStats(data);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Real-Time Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400">Real activity tracked directly from MongoDB Atlas.</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadStats} 
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Scans"
          value={stats ? stats.totalScans.toString() : "0"}
          icon={<BarChart3 className="w-5 h-5 text-indigo-500" />}
        />
        <StatCard
          title="Compliance Rate"
          value={stats && stats.totalScans > 0 ? `${stats.complianceRate}%` : "0%"}
          icon={<CheckCircle className="w-5 h-5 text-green-500" />}
        />
        <StatCard
          title="Potential Issues"
          value={stats ? stats.nonCompliantProducts.toString() : "0"}
          icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
        />
        <StatCard
          title="Unique Visitors"
          value={stats ? stats.uniqueVisitors.toString() : "0"}
          icon={<Users className="w-5 h-5 text-blue-500" />}
        />
      </div>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <Card className="p-5 h-full">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Scans by Category</h3>
            <div className="h-72">
              {stats && stats.categoryDistribution && stats.categoryDistribution.length > 0 ? (
                <CategoryDistribution data={stats.categoryDistribution} />
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-slate-400">
                  No category data recorded yet
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="p-5 h-full">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Top Compliance Issues</h3>
            <div className="h-72">
              {stats && stats.commonIssues && stats.commonIssues.length > 0 ? (
                <CommonIssues data={stats.commonIssues} />
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-slate-400">
                  No compliance issues recorded yet
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="p-5 h-full">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Monthly Scan Volume</h3>
            <div className="h-72">
              {stats && stats.monthlyScans && stats.monthlyScans.length > 0 ? (
                <MonthlyScans data={stats.monthlyScans} />
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-slate-400">
                  No monthly scan data recorded yet
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="p-5 h-full">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Website Visitor Traffic</h3>
            <div className="h-72 flex flex-col justify-center gap-4 p-4 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-sm text-slate-600 dark:text-slate-400">Total Visits</span>
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{stats?.totalVisits ?? 0}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-sm text-slate-600 dark:text-slate-400">Unique Visitors</span>
                <span className="text-xl font-bold text-slate-900 dark:text-white">{stats?.uniqueVisitors ?? 0}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-sm text-slate-600 dark:text-slate-400">Today's Visits</span>
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{stats?.todayVisits ?? 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">This Month</span>
                <span className="text-xl font-bold text-slate-900 dark:text-white">{stats?.monthVisits ?? 0}</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
