import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, AlertTriangle, Eye, Download, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '@/components/ui/StatCard';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { fetchRealStats, fetchScansFromDB, type RealStatsResponse } from '@/services/api';

export default function ReportsPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<RealStatsResponse | null>(null);
  const [reportsList, setReportsList] = useState<any[]>([]);

  useEffect(() => {
    fetchRealStats().then(data => setStats(data));
    fetchScansFromDB().then(scans => {
      if (scans && scans.length > 0) {
        setReportsList(scans.map(s => ({
          id: s.scanId,
          productName: s.productName,
          brand: s.brand,
          category: s.category,
          score: s.complianceScore,
          status: s.overallStatus === 'COMPLIANT' ? 'Compliant' : s.overallStatus === 'NEEDS_REVIEW' ? 'Needs Review' : 'Issues Found',
          date: s.createdAt,
        })));
      } else {
        setReportsList([]);
      }
    });
  }, []);

  const handleAction = (message: string) => {
    alert(message);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'compliant':
        return <Badge variant="success">Compliant</Badge>;
      case 'issues found':
      case 'issues':
        return <Badge variant="warning">Issues Found</Badge>;
      case 'needs review':
      case 'review':
        return <Badge variant="info">Needs Review</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const columns = [
    {
      header: 'Product',
      accessor: (row: any) => (
        <div>
          <div className="font-medium text-slate-900 dark:text-white">{row.productName}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">{row.brand}</div>
        </div>
      ),
    },
    {
      header: 'Report ID',
      accessor: (row: any) => <span className="font-mono text-sm">{row.id}</span>,
    },
    {
      header: 'Score',
      accessor: (row: any) => (
        <span className={`font-semibold ${getScoreColor(row.score)}`}>{row.score}%</span>
      ),
    },
    {
      header: 'Status',
      accessor: (row: any) => getStatusBadge(row.status),
    },
    {
      header: 'Date',
      accessor: (row: any) => <span className="text-sm">{row.date}</span>,
    },
    {
      header: 'Actions',
      accessor: (row: any) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/reports/${row.id}`)}
            className="p-2"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction('Report downloaded successfully')}
            className="p-2"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction('Share link copied to clipboard')}
            className="p-2"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage and view your product compliance reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Reports"
          value={stats ? stats.totalScans.toString() : "0"}
          icon={<FileText className="w-5 h-5 text-indigo-500" />}
        />
        <StatCard
          title="Compliant Reports"
          value={stats ? stats.compliantProducts.toString() : "0"}
          icon={<CheckCircle className="w-5 h-5 text-green-500" />}
        />
        <StatCard
          title="Issue Reports"
          value={stats ? stats.nonCompliantProducts.toString() : "0"}
          icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
        />
        <StatCard
          title="Review Reports"
          value={stats ? stats.needsReviewProducts.toString() : "0"}
          icon={<Eye className="w-5 h-5 text-blue-500" />}
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Reports</h2>
        </div>
        <div className="p-0">
          {reportsList && reportsList.length > 0 ? (
            <Table columns={columns} data={reportsList} />
          ) : (
            <div className="p-8">
              <EmptyState
                icon={<FileText className="w-12 h-12 text-slate-400" />}
                title="No reports found"
                description="No compliance reports have been generated from scans yet."
                action={<Button onClick={() => navigate('/scan')}>New Scan</Button>}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
