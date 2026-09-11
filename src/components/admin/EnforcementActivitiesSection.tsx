import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gavel, Send, Clock, 
  Search, Eye, Printer, FileText, 
  ChevronRight, RefreshCw, X,
  MessageSquareWarning
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { EnforcementCase, EnforcementSummary } from '@/services/api';

interface EnforcementActivitiesSectionProps {
  cases: EnforcementCase[];
  summary?: EnforcementSummary;
  onDispatchNotice: (payload: any) => Promise<void>;
  onUpdateCaseStatus: (caseId: string, status: EnforcementCase['status'], notes?: string, fine?: number) => Promise<void>;
  onUpdateComplaintStatus: (scanId: string, status: string, notes?: string) => Promise<void>;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const EnforcementActivitiesSection: React.FC<EnforcementActivitiesSectionProps> = ({
  cases,
  onDispatchNotice,
  onUpdateCaseStatus,
  onUpdateComplaintStatus,
  onRefresh,
  isRefreshing = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [pipelineStageFilter, setPipelineStageFilter] = useState<string>('ALL');
  
  // Modals
  const [selectedCaseForDossier, setSelectedCaseForDossier] = useState<EnforcementCase | null>(null);
  const [selectedCaseForPrintNotice, setSelectedCaseForPrintNotice] = useState<EnforcementCase | null>(null);
  const [isNewNoticeModalOpen, setIsNewNoticeModalOpen] = useState(false);

  // New Notice Form
  const [newNoticeProduct, setNewNoticeProduct] = useState('');
  const [newNoticeBrand, setNewNoticeBrand] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState('Food');
  const [newNoticeViolation, setNewNoticeViolation] = useState('Missing Mandatory 14-Digit FSSAI License & Logo');
  const [newNoticeSection, setNewNoticeSection] = useState('FSSAI Act 2006 Sec 51 & Legal Metrology Rules Rule 6');
  const [newNoticeOfficer, setNewNoticeOfficer] = useState('Ministry Enforcement Cell (HQ New Delhi)');
  const [newNoticeFine, setNewNoticeFine] = useState(25000);
  const [newNoticeNotes, setNewNoticeNotes] = useState('Formal statutory show-cause notice dispatched. 15-day compliance window begins.');

  // Pipeline stages
  const pipelineStages = [
    {
      id: 'FLAGGED',
      name: '1. Flagged Defect',
      desc: 'AI vision scanned label non-compliance',
      count: cases.filter((c) => ['Flagged', 'Pending Notice'].includes(c.status)).length,
      badgeColor: 'bg-red-950/80 text-red-300 border-red-500/40',
    },
    {
      id: 'NOTICE_DISPATCHED',
      name: '2. Notice Dispatched',
      desc: 'Sec 38 Show-Cause Notice served',
      count: cases.filter((c) => c.status === 'Notice Dispatched').length,
      badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
    },
    {
      id: 'HEARING',
      name: '3. Inquiry / Hearing',
      desc: 'Explanation awaited or hearing scheduled',
      count: cases.filter((c) => ['Hearing Scheduled', 'Under Review'].includes(c.status)).length,
      badgeColor: 'bg-blue-950/80 text-blue-300 border-blue-500/40',
    },
    {
      id: 'INSPECTION',
      name: '4. Physical Inspection',
      desc: 'Market batch seizure / lab audit',
      count: cases.filter((c) => c.status === 'Inspection Ordered').length,
      badgeColor: 'bg-purple-950/80 text-purple-300 border-purple-500/40',
    },
    {
      id: 'RESOLVED',
      name: '5. Compounded / Closed',
      desc: 'Penalty collected or label corrected',
      count: cases.filter((c) => ['Compounded', 'Resolved', 'Closed'].includes(c.status)).length,
      badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
    },
  ];

  // Filtered cases
  const filteredCases = cases.filter((c) => {
    const matchesSearch = 
      (c.productName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.brand || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.caseId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.primaryViolation || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (pipelineStageFilter !== 'ALL') {
      if (pipelineStageFilter === 'FLAGGED') return ['Flagged', 'Pending Notice'].includes(c.status);
      if (pipelineStageFilter === 'NOTICE_DISPATCHED') return c.status === 'Notice Dispatched';
      if (pipelineStageFilter === 'HEARING') return ['Hearing Scheduled', 'Under Review'].includes(c.status);
      if (pipelineStageFilter === 'INSPECTION') return c.status === 'Inspection Ordered';
      if (pipelineStageFilter === 'RESOLVED') return ['Compounded', 'Resolved', 'Closed'].includes(c.status);
    }

    if (statusFilter !== 'ALL') {
      return c.status.toLowerCase() === statusFilter.toLowerCase();
    }

    return true;
  });

  // Citizen complaints queue
  const complaintsCases = cases.filter((c) => Boolean(c.citizenComplaint));

  const handleCreateNoticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onDispatchNotice({
      scanId: `scan-${Date.now().toString().slice(-6)}`,
      actionType: 'NOTICE',
      productName: newNoticeProduct,
      brand: newNoticeBrand,
      category: newNoticeCategory,
      primaryViolation: newNoticeViolation,
      regulatorySection: newNoticeSection,
      officerName: newNoticeOfficer,
      compoundingFine: newNoticeFine,
      officerNotes: newNoticeNotes,
    });
    setIsNewNoticeModalOpen(false);
    setNewNoticeProduct('');
    setNewNoticeBrand('');
  };

  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* 5-Stage Enforcement Pipeline */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Gavel size={18} className="text-amber-400" />
              Statutory Enforcement Pipeline & Progression
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              5-Stage legal enforcement workflow under Legal Metrology Act & FSSAI provisions
            </p>
          </div>
          {pipelineStageFilter !== 'ALL' && (
            <button
              onClick={() => setPipelineStageFilter('ALL')}
              className="text-xs text-amber-400 hover:underline font-mono"
            >
              Reset Pipeline Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {pipelineStages.map((stage) => {
            const isSelected = pipelineStageFilter === stage.id;
            return (
              <div
                key={stage.id}
                onClick={() => setPipelineStageFilter(isSelected ? 'ALL' : stage.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected 
                    ? 'bg-amber-500/15 border-amber-500 shadow-lg shadow-amber-500/10' 
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${stage.badgeColor}`}>
                    {stage.count} CASES
                  </span>
                  <ChevronRight size={14} className="text-slate-500" />
                </div>
                <h4 className="text-xs font-bold text-white mb-1">
                  {stage.name}
                </h4>
                <p className="text-[10px] text-slate-400 leading-tight">
                  {stage.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enforcement Actions Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by case ID, product, brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 w-64"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {['ALL', 'Notice Dispatched', 'Inspection Ordered', 'Compounded', 'Resolved'].map((mode) => (
              <button
                key={mode}
                onClick={() => setStatusFilter(mode)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                  statusFilter === mode
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {mode === 'ALL' ? 'All Statuses' : mode}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="border-slate-700 text-slate-300 hover:text-white text-xs"
          >
            <RefreshCw size={13} className={`mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Sync Cases
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrintDossier}
            className="border-slate-700 text-slate-300 hover:text-white text-xs"
          >
            <Printer size={13} className="mr-1.5" />
            Export Dossier
          </Button>

          <Button
            size="sm"
            onClick={() => setIsNewNoticeModalOpen(true)}
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold text-xs"
          >
            <Send size={13} className="mr-1.5" />
            Dispatch Show-Cause Notice
          </Button>
        </div>
      </div>

      {/* Main Table: Active Enforcement Cases Register */}
      <Card className="p-6 bg-slate-900/90 border-slate-800 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText size={18} className="text-amber-400" />
              National Enforcement Actions & Show-Cause Registry
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Active statutory show-cause notices, compounding notices, and on-site inspection orders
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Showing <strong className="text-amber-400">{filteredCases.length}</strong> active cases
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <th className="py-3 px-3">Case ID & Product</th>
                <th className="py-3 px-3">Primary Infringement</th>
                <th className="py-3 px-3">Statutory Clause</th>
                <th className="py-3 px-3">Deadline</th>
                <th className="py-3 px-3">Compounding Fine</th>
                <th className="py-3 px-3">Enforcement Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-mono text-xs">
                    No enforcement cases matching current criteria.
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => {
                  const isResolved = ['Resolved', 'Compounded', 'Closed'].includes(c.status);

                  return (
                    <tr key={c.caseId} className="hover:bg-slate-800/40 transition-colors">
                      {/* Case ID & Product */}
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white text-sm">
                          {c.productName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                          <span className="text-amber-400 font-bold">{c.caseId}</span>
                          <span>•</span>
                          <span>{c.brand}</span>
                        </div>
                      </td>

                      {/* Primary Infringement */}
                      <td className="py-3.5 px-3 max-w-xs">
                        <div className="text-slate-200 line-clamp-1 font-medium text-xs">
                          {c.primaryViolation}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          Score: <span className={c.complianceScore < 60 ? 'text-red-400 font-bold' : 'text-emerald-400'}>{c.complianceScore}%</span>
                        </div>
                      </td>

                      {/* Statutory Clause */}
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-amber-300 font-mono text-[10px]">
                          {c.regulatorySection}
                        </span>
                      </td>

                      {/* Deadline Countdown */}
                      <td className="py-3.5 px-3 font-mono">
                        {isResolved ? (
                          <span className="text-emerald-400 text-[11px] font-bold">Settled</span>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs">
                            <Clock size={12} className={c.deadlineDaysRemaining <= 3 ? 'text-red-400' : 'text-amber-400'} />
                            <span className={c.deadlineDaysRemaining <= 3 ? 'text-red-400 font-bold' : 'text-slate-300'}>
                              {c.deadlineDaysRemaining} days left
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Compounding Fine */}
                      <td className="py-3.5 px-3 font-mono">
                        <span className="text-emerald-400 font-bold text-xs">
                          ₹{c.compoundingFine.toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <Badge 
                          variant={
                            c.status === 'Resolved' || c.status === 'Compounded' 
                              ? 'success' 
                              : c.status === 'Inspection Ordered' 
                              ? 'default' 
                              : c.status === 'Hearing Scheduled' 
                              ? 'warning' 
                              : 'danger'
                          }
                        >
                          {c.status}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-3 text-right space-x-1.5 whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedCaseForDossier(c)}
                          className="border-slate-700 text-slate-300 hover:text-white text-xs px-2.5 py-1"
                          title="View Case File & Evidence"
                        >
                          <Eye size={12} className="mr-1" />
                          Dossier
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedCaseForPrintNotice(c)}
                          className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10 text-xs px-2.5 py-1"
                          title="Generate Official Statutory Notice PDF"
                        >
                          <Printer size={12} className="mr-1" />
                          Notice
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

      {/* Citizen Grievance Resolution Center */}
      {complaintsCases.length > 0 && (
        <Card className="p-6 bg-slate-900/90 border-slate-800 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageSquareWarning size={18} className="text-red-400" />
              <div>
                <h3 className="text-base font-bold text-white">
                  Citizen Grievances & Rapid Enforcement Queue
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Direct consumer complaints submitted via CompliScan scanner
                </p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/40">
              {complaintsCases.length} GRIEVANCES PENDING
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {complaintsCases.map((c) => {
              const cmp = c.citizenComplaint!;
              return (
                <div 
                  key={cmp.complaintId}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-red-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-red-400">
                        {cmp.complaintId}
                      </span>
                      <Badge variant={cmp.status === 'Resolved' ? 'success' : 'danger'}>
                        {cmp.status.toUpperCase()}
                      </Badge>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-1">
                      {c.productName} ({c.brand})
                    </h4>
                    <p className="text-xs text-slate-400 mb-2">
                      Reported issue: <span className="text-amber-300 font-medium">{c.primaryViolation}</span>
                    </p>

                    <div className="text-[11px] text-slate-400 font-mono space-y-0.5 mb-3 bg-slate-900/80 p-2.5 rounded-xl">
                      <div>Complainant: <span className="text-white">{cmp.userName}</span> ({cmp.userEmail})</div>
                      <div>Date Logged: <span className="text-white">{new Date(cmp.submittedAt).toLocaleString()}</span></div>
                      {cmp.adminNotes && <div>Officer Note: <span className="text-amber-300">{cmp.adminNotes}</span></div>}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-500 font-mono">
                      Priority: <strong className="text-red-400">{cmp.adminPriority || 'HIGH'}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      {cmp.status !== 'Resolved' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onUpdateComplaintStatus(c.scanId, 'Investigation', 'Assigned to field food safety officer for on-site batch testing.')}
                            className="border-blue-500/40 text-blue-300 hover:bg-blue-500/10 text-xs px-2.5 py-1"
                          >
                            Investigate
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => onUpdateComplaintStatus(c.scanId, 'Resolved', 'Manufacturer penalized and corrective label enforced.')}
                            className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs px-2.5 py-1"
                          >
                            Mark Resolved
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* MODAL 1: Case Dossier & Evidence Modal */}
      <AnimatePresence>
        {selectedCaseForDossier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5 text-amber-400">
                  <FileText size={22} />
                  <div>
                    <h3 className="text-lg font-bold text-white">Statutory Enforcement Case Dossier</h3>
                    <p className="text-xs text-slate-400 font-mono">{selectedCaseForDossier.caseId} • Section 38 Inquiry</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCaseForDossier(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Product Info Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px] font-mono">PRODUCT</span>
                  <span className="text-white font-bold">{selectedCaseForDossier.productName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-mono">BRAND/PACKER</span>
                  <span className="text-white font-bold">{selectedCaseForDossier.brand}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-mono">COMPLIANCE SCORE</span>
                  <span className="text-red-400 font-mono font-bold">{selectedCaseForDossier.complianceScore}%</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-mono">CURRENT STATUS</span>
                  <Badge variant="danger">{selectedCaseForDossier.status}</Badge>
                </div>
              </div>

              {/* Specific Infringement & Clause */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Primary Statutory Violation Detected
                </h5>
                <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/30 text-xs text-red-200">
                  <p className="font-bold text-red-300 mb-1">{selectedCaseForDossier.primaryViolation}</p>
                  <p className="text-[11px] text-slate-300 font-mono">
                    Governing Act: {selectedCaseForDossier.regulatorySection}
                  </p>
                </div>
              </div>

              {/* Action History Log */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Enforcement Chronology & Proceedings
                </h5>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedCaseForDossier.actionHistory.map((act, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-amber-300">{act.action}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{new Date(act.timestamp).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mb-1">{act.note}</p>
                      <span className="text-[10px] text-slate-500 font-mono">Officer: {act.officer}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Progression Controls */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Transition Case Progression Status
                </h5>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      await onUpdateCaseStatus(selectedCaseForDossier.caseId, 'Inspection Ordered', 'District inspector deputed for on-site retail check.');
                      setSelectedCaseForDossier(null);
                    }}
                    className="border-purple-500/40 text-purple-300 hover:bg-purple-500/10 text-xs"
                  >
                    Order Field Inspection
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      await onUpdateCaseStatus(selectedCaseForDossier.caseId, 'Hearing Scheduled', 'Summons issued to company director.');
                      setSelectedCaseForDossier(null);
                    }}
                    className="border-blue-500/40 text-blue-300 hover:bg-blue-500/10 text-xs"
                  >
                    Summon Hearing
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      await onUpdateCaseStatus(selectedCaseForDossier.caseId, 'Compounded', 'Compounding fine collected under Section 51.');
                      setSelectedCaseForDossier(null);
                    }}
                    className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 text-xs"
                  >
                    Mark Compounded (₹{selectedCaseForDossier.compoundingFine})
                  </Button>
                  <Button
                    size="sm"
                    onClick={async () => {
                      await onUpdateCaseStatus(selectedCaseForDossier.caseId, 'Resolved', 'Corrected packaging verified.');
                      setSelectedCaseForDossier(null);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                  >
                    Close & Resolve Case
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Printable Statutory Notice Preview */}
      <AnimatePresence>
        {selectedCaseForPrintNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-amber-400">
                  <Printer size={20} />
                  <h3 className="text-base font-bold text-white">Official Legal Show-Cause Notice Preview</h3>
                </div>
                <button 
                  onClick={() => setSelectedCaseForPrintNotice(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Official Government Notice Letterhead */}
              <div className="p-6 rounded-2xl bg-white text-slate-950 font-serif space-y-4 border border-slate-200">
                <div className="text-center border-b border-slate-300 pb-4">
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-700">
                    GOVERNMENT OF INDIA
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION
                  </div>
                  <div className="text-xs text-slate-600">
                    DIRECTORATE OF LEGAL METROLOGY & FOOD ENFORCEMENT CELL
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-1">
                    KRISHI BHAWAN, NEW DELHI - 110001
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-600">
                  <span>NOTICE NO: <strong>{selectedCaseForPrintNotice.caseId}</strong></span>
                  <span>DATE: <strong>{new Date().toLocaleDateString()}</strong></span>
                </div>

                <div className="text-xs leading-relaxed space-y-2 text-slate-800">
                  <p>
                    <strong>TO:</strong> The Managing Director / Authorized Signatory<br />
                    M/s {selectedCaseForPrintNotice.brand}
                  </p>
                  <p>
                    <strong>SUBJECT:</strong> STATUTORY NOTICE UNDER SECTION 38 OF THE LEGAL METROLOGY ACT, 2009 READ WITH RULE 6 OF PACKAGED COMMODITIES RULES, 2011.
                  </p>
                  <p>
                    WHEREAS, an algorithmic inspection conducted by the CompliScan AI Statutory Label Verification System on sample package <strong>"{selectedCaseForPrintNotice.productName}"</strong> (Scan ID: {selectedCaseForPrintNotice.scanId}) detected critical statutory non-compliances:
                  </p>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-900 font-sans text-xs">
                    <strong>Specific Infringement:</strong> {selectedCaseForPrintNotice.primaryViolation}<br />
                    <strong>Governing Section:</strong> {selectedCaseForPrintNotice.regulatorySection}
                  </div>
                  <p>
                    NOW THEREFORE, you are hereby called upon to show cause within <strong>15 days</strong> from receipt of this notice as to why compounding proceedings under Section 51 with a minimum penalty of <strong>₹{selectedCaseForPrintNotice.compoundingFine.toLocaleString('en-IN')}</strong> or prosecution under Section 36(1) should not be initiated against your company.
                  </p>
                </div>

                <div className="pt-6 flex items-center justify-between border-t border-slate-300 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">CompliScan AI Verification Cell</div>
                    <div className="text-[11px] text-slate-600">Authorized Officer, Enforcement Division</div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 rounded bg-amber-100 text-amber-900 font-mono text-[10px] font-bold">
                      STATUTORY DIGITAL SEAL
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedCaseForPrintNotice(null)}
                >
                  Close
                </Button>
                <Button 
                  size="sm" 
                  onClick={handlePrintDossier}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
                >
                  <Printer size={14} className="mr-1.5" />
                  Print Official Notice
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: New Notice Dispatch Modal */}
      <AnimatePresence>
        {isNewNoticeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-red-500/40 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-red-400">
                  <Send size={20} />
                  <h3 className="text-base font-bold text-white">Dispatch Statutory Show-Cause Notice</h3>
                </div>
                <button 
                  onClick={() => setIsNewNoticeModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateNoticeSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-bold font-mono">PRODUCT NAME:</label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Crispy Namkeen 200g"
                    value={newNoticeProduct}
                    onChange={(e) => setNewNoticeProduct(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-bold font-mono">MANUFACTURER / BRAND:</label>
                  <input
                    type="text"
                    placeholder="e.g. Shree Krishna Agro Foods Ltd"
                    value={newNoticeBrand}
                    onChange={(e) => setNewNoticeBrand(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-bold font-mono">CATEGORY:</label>
                    <select
                      value={newNoticeCategory}
                      onChange={(e) => setNewNoticeCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Food">Food & Snacks</option>
                      <option value="Edible Oil">Edible Oil</option>
                      <option value="Cosmetics">Cosmetics</option>
                      <option value="Household">Household Goods</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-bold font-mono">COMPOUNDING FINE (₹):</label>
                    <input
                      type="number"
                      value={newNoticeFine}
                      onChange={(e) => setNewNoticeFine(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-bold font-mono">PRIMARY INFRINGEMENT:</label>
                  <input
                    type="text"
                    value={newNoticeViolation}
                    onChange={(e) => setNewNoticeViolation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-bold font-mono">STATUTORY SECTION / CLAUSE:</label>
                  <input
                    type="text"
                    value={newNoticeSection}
                    onChange={(e) => setNewNoticeSection(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 font-mono focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-bold font-mono">ISSUING OFFICER / CELL:</label>
                  <input
                    type="text"
                    value={newNoticeOfficer}
                    onChange={(e) => setNewNoticeOfficer(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-bold font-mono">OFFICER NOTES & DIRECTIVE:</label>
                  <textarea
                    rows={2}
                    value={newNoticeNotes}
                    onChange={(e) => setNewNoticeNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setIsNewNoticeModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="bg-red-600 hover:bg-red-700 text-white font-bold">
                    <Send size={14} className="mr-1.5" />
                    Dispatch Statutory Notice
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
