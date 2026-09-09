import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, ShieldCheck, Scale, FileText, Users, AlertTriangle, 
  Search, Filter, Download, Send, CheckCircle2, XCircle, RefreshCw,
  Building2, ArrowUpRight, Lock, Eye, Trash2, Gavel
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { fetchRealStats, fetchScansFromDB, type RealStatsResponse } from '@/services/api';
import { MinistryLogo } from '@/components/ui/MinistryLogo';
import { SIHLogo } from '@/components/ui/SIHLogo';
import { CompliScanLogo } from '@/components/ui/CompliScanLogo';
import { useAuth } from '@/context/AuthContext';

export const AdminPortalPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<RealStatsResponse | null>(null);
  const [scans, setScans] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'FLAGGED' | 'COMPLIANT'>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [noticeModalScan, setNoticeModalScan] = useState<any | null>(null);
  const [noticeSentToast, setNoticeSentToast] = useState<string | null>(null);

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const [statsData, scansData] = await Promise.all([
        fetchRealStats(),
        fetchScansFromDB({})
      ]);
      setStats(statsData);
      setScans(scansData || []);
    } catch (err) {
      console.warn('Failed to load admin data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleIssueNotice = (scan: any) => {
    setNoticeModalScan(scan);
  };

  const handleConfirmSendNotice = () => {
    if (!noticeModalScan) return;
    const scanName = noticeModalScan.productName || 'Product';
    setNoticeSentToast(`Official Legal Show-Cause Notice dispatched for ${scanName}!`);
    setNoticeModalScan(null);
    setTimeout(() => setNoticeSentToast(null), 4000);
  };

  const filteredScans = scans.filter((s) => {
    const matchesSearch = 
      (s.productName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.brand || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.category || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedFilter === 'FLAGGED') {
      return matchesSearch && (s.overallStatus === 'POTENTIAL_NON_COMPLIANCE' || s.complianceScore < 60);
    }
    if (selectedFilter === 'COMPLIANT') {
      return matchesSearch && s.overallStatus === 'COMPLIANT';
    }
    return matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Ministry Admin Header */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-[#0b1329] to-slate-950 border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0">
              <Gavel size={36} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  GOVERNMENT ENFORCEMENT CONSOLE
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  MIGRATED LIVE TO ATLAS
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                Ministry of Consumer Affairs Admin Portal
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
                Statutory regulatory enforcement tower for Legal Metrology & FSSAI. Audit citizen scans, issue show-cause violation notices, and monitor national compliance telemetry.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={isRefreshing}
              className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Sync Telemetry
            </Button>
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-700">
              <MinistryLogo size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Notice Sent Notification Banner */}
      <AnimatePresence>
        {noticeSentToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500 text-emerald-300 flex items-center gap-3 shadow-xl"
          >
            <CheckCircle2 size={24} className="text-emerald-400 shrink-0" />
            <span className="font-semibold text-sm">{noticeSentToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin KPI Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-slate-900/90 border-slate-800 text-white">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase font-mono">Total Monitored Scans</span>
            <FileText size={18} className="text-cyan-400" />
          </div>
          <div className="text-3xl font-black font-mono text-white">
            {stats?.totalScans ?? scans.length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Across all state checkpoints
          </span>
        </Card>

        <Card className="p-5 bg-slate-900/90 border-slate-800 text-white">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase font-mono">Critical Violations</span>
            <ShieldAlert size={18} className="text-red-400" />
          </div>
          <div className="text-3xl font-black font-mono text-red-400">
            {stats?.nonCompliantProducts ?? 0}
          </div>
          <span className="text-[11px] text-red-400/80 mt-1 block">
            Immediate FSO Action Needed
          </span>
        </Card>

        <Card className="p-5 bg-slate-900/90 border-slate-800 text-white">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase font-mono">100% Certified Safe</span>
            <ShieldCheck size={18} className="text-emerald-400" />
          </div>
          <div className="text-3xl font-black font-mono text-emerald-400">
            {stats?.compliantProducts ?? 0}
          </div>
          <span className="text-[11px] text-emerald-400/80 mt-1 block">
            Clean FSSAI & Metrology Labels
          </span>
        </Card>

        <Card className="p-5 bg-slate-900/90 border-slate-800 text-white">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase font-mono">Citizen Inspectors</span>
            <Users size={18} className="text-amber-400" />
          </div>
          <div className="text-3xl font-black font-mono text-amber-400">
            {stats?.uniqueVisitors ?? 1}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Active Verified User Sessions
          </span>
        </Card>
      </div>

      {/* Enforcement & Audit Registry Table */}
      <Card className="p-6 bg-slate-900/90 border-slate-800 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Scale size={20} className="text-amber-400" />
              National Label Audit & Enforcement Registry
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time audit log of all scanned packaged commodities across Indian territories.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search product, brand, category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 w-64"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
              {(['ALL', 'FLAGGED', 'COMPLIANT'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSelectedFilter(mode)}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                    selectedFilter === mode
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table / List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <th className="py-3 px-4">Product & Brand</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Compliance Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date Logged</th>
                <th className="py-3 px-4 text-right">Enforcement Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredScans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No matching audit records found. Real scans will appear here automatically.
                  </td>
                </tr>
              ) : (
                filteredScans.map((scan, idx) => {
                  const isSafe = scan.overallStatus === 'COMPLIANT' || scan.complianceScore >= 80;
                  return (
                    <tr key={scan.scanId || idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white text-sm">
                          {scan.productName || 'Unlabeled Packaged Good'}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          ID: {scan.scanId || `SCAN-${idx + 100}`} • {scan.brand || 'Local Manufacturer'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">
                          {scan.category || 'Food'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-mono font-bold text-sm ${isSafe ? 'text-emerald-400' : 'text-red-400'}`}>
                          {scan.complianceScore || 0}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={isSafe ? 'success' : 'danger'}>
                          {scan.overallStatus || (isSafe ? 'COMPLIANT' : 'POTENTIAL_VIOLATION')}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                        {new Date(scan.createdAt || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {!isSafe && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleIssueNotice(scan)}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs px-2.5 py-1"
                          >
                            <Send size={12} className="mr-1" />
                            Issue Notice
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`/result/${scan.scanId || 'demo'}`, '_blank')}
                          className="border-slate-700 text-slate-300 hover:text-white text-xs px-2.5 py-1"
                        >
                          <Eye size={12} className="mr-1" />
                          Inspect
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Show Cause Legal Notice Modal */}
      <AnimatePresence>
        {noticeModalScan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-red-500/40 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3 text-red-400 border-b border-slate-800 pb-3">
                <Gavel size={24} />
                <div>
                  <h3 className="text-lg font-bold text-white">Issue Official Show-Cause Notice</h3>
                  <p className="text-xs text-slate-400">Legal Metrology (Packaged Commodities) Rules 2011</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <p>
                  <strong>Product:</strong> {noticeModalScan.productName} ({noticeModalScan.category})
                </p>
                <p>
                  <strong>Compliance Score:</strong> <span className="text-red-400 font-mono font-bold">{noticeModalScan.complianceScore}%</span>
                </p>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400">
                  SECTION 38 NOTICE: Manufacturer/Packer is hereby required to rectify non-compliances (missing FSSAI/misleading MRP) within 15 days or face compounding penalty under Section 51.
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setNoticeModalScan(null)}>
                  Cancel
                </Button>
                <Button variant="danger" size="sm" onClick={handleConfirmSendNotice} className="bg-red-600 hover:bg-red-700">
                  <Send size={14} className="mr-1.5" />
                  Dispatch Statutory Notice
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPortalPage;
