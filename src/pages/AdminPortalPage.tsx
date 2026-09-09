import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, ShieldCheck, Scale, FileText, Users, AlertTriangle, 
  Search, Filter, Download, Send, CheckCircle2, XCircle, RefreshCw,
  Building2, ArrowUpRight, Lock, Eye, Trash2, Gavel, UserPlus, Key, LogOut,
  Sparkles, Mail
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  fetchRealStats, fetchScansFromDB, fetchAppointedAdmins, 
  createNewAdmin, revokeAdminPrivilege, type RealStatsResponse 
} from '@/services/api';
import { MinistryLogo } from '@/components/ui/MinistryLogo';
import { SIHLogo } from '@/components/ui/SIHLogo';
import { CompliScanLogo } from '@/components/ui/CompliScanLogo';
import { useAuth } from '@/context/AuthContext';

export const AdminPortalPage: React.FC = () => {
  const { user, login } = useAuth();
  
  // Officer Session State
  const [adminUser, setAdminUser] = useState<any>(() => {
    const cached = sessionStorage.getItem('compliscan_officer_session');
    if (cached) {
      try { return JSON.parse(cached); } catch { return null; }
    }
    if (user?.email === 'sih@gmail.com' || user?.role === 'super_admin') {
      return { email: 'sih@gmail.com', name: user.name || 'Super Admin', role: 'super_admin' };
    }
    return null;
  });

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Portal Navigation Tabs
  const [activeTab, setActiveTab] = useState<'REGISTRY' | 'ADMIN_MANAGEMENT'>('REGISTRY');

  // Appointed Admins State
  const [adminList, setAdminList] = useState<any[]>([]);
  const [isNewAdminModalOpen, setIsNewAdminModalOpen] = useState(false);
  const [newOfficerName, setNewOfficerName] = useState('');
  const [newOfficerEmail, setNewOfficerEmail] = useState('');
  const [newOfficerPassword, setNewOfficerPassword] = useState('');
  const [newOfficerDept, setNewOfficerDept] = useState('Legal Metrology Division');
  const [modalActionError, setModalActionError] = useState('');

  // Scans & Stats State
  const [stats, setStats] = useState<RealStatsResponse | null>(null);
  const [scans, setScans] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'FLAGGED' | 'COMPLIANT'>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [noticeModalScan, setNoticeModalScan] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isSuperAdmin = adminUser?.email === 'sih@gmail.com' || adminUser?.role === 'super_admin';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handle Officer Login
  const handleOfficerLogin = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    const emailToUse = (customEmail || loginEmail).trim().toLowerCase();
    const passToUse = customPass || loginPassword;

    // 1. Check Super Admin Credentials
    if (emailToUse === 'sih@gmail.com' && passToUse === '822115') {
      const superSession = {
        name: 'Super Admin (National Governance)',
        email: 'sih@gmail.com',
        role: 'super_admin',
        organization: 'Ministry of Consumer Affairs & FSSAI',
      };
      setAdminUser(superSession);
      sessionStorage.setItem('compliscan_officer_session', JSON.stringify(superSession));
      setIsLoggingIn(false);
      showToast('Welcome back, Super Admin! Full Governance Authority Active.');
      return;
    }

    // 2. Check Appointed Admins (from API & Local Cache)
    try {
      const localAdminsRaw = localStorage.getItem('compliscan_local_admins');
      const localAdmins = localAdminsRaw ? JSON.parse(localAdminsRaw) : [];
      const matchedLocal = localAdmins.find(
        (a: any) => a.email.toLowerCase() === emailToUse && a.password === passToUse
      );

      if (matchedLocal) {
        const officerSession = {
          name: matchedLocal.name,
          email: matchedLocal.email,
          role: 'admin',
          organization: matchedLocal.organization || 'Ministry Enforcement Cell',
        };
        setAdminUser(officerSession);
        sessionStorage.setItem('compliscan_officer_session', JSON.stringify(officerSession));
        setIsLoggingIn(false);
        showToast(`Officer Login Successful: ${matchedLocal.name}`);
        return;
      }

      // Try Backend Authentication
      try {
        const u = await login(emailToUse, passToUse);
        if (u.role === 'admin' || u.role === 'super_admin' || u.email === 'sih@gmail.com') {
          const officerSession = {
            name: u.name,
            email: u.email,
            role: u.role,
            organization: u.organization || 'Ministry Enforcement Cell',
          };
          setAdminUser(officerSession);
          sessionStorage.setItem('compliscan_officer_session', JSON.stringify(officerSession));
          setIsLoggingIn(false);
          showToast(`Welcome Officer ${u.name}`);
          return;
        } else {
          setLoginError('Access Denied: This account does not have Ministry Admin privileges. Only Super Admin (sih@gmail.com) can appoint you.');
          setIsLoggingIn(false);
          return;
        }
      } catch (err: any) {
        setLoginError(err.message || 'Invalid Officer Email or Password.');
      }
    } catch (err) {
      setLoginError('Authentication service error. Please verify credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogoutOfficer = () => {
    setAdminUser(null);
    sessionStorage.removeItem('compliscan_officer_session');
    setLoginEmail('');
    setLoginPassword('');
    showToast('Officer session terminated.');
  };

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const [statsData, scansData, adminsData] = await Promise.all([
        fetchRealStats(),
        fetchScansFromDB({}),
        fetchAppointedAdmins()
      ]);
      setStats(statsData);
      setScans(scansData || []);
      setAdminList(adminsData || []);
    } catch (err) {
      console.warn('Failed to load admin data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (adminUser) {
      loadData();
    }
  }, [adminUser]);

  // Super Admin: Appoint New Admin
  const handleAppointAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalActionError('');

    if (!newOfficerName || !newOfficerEmail || !newOfficerPassword) {
      setModalActionError('Please fill out all officer details including assigned password.');
      return;
    }

    try {
      const res = await createNewAdmin({
        name: newOfficerName.trim(),
        email: newOfficerEmail.trim().toLowerCase(),
        password: newOfficerPassword,
        organization: newOfficerDept,
      });

      if (res.success) {
        showToast(`Officer ${newOfficerName} appointed successfully with assigned password!`);
        setIsNewAdminModalOpen(false);
        setNewOfficerName('');
        setNewOfficerEmail('');
        setNewOfficerPassword('');
        loadData();
      } else {
        setModalActionError(res.error || 'Failed to appoint officer.');
      }
    } catch (err: any) {
      setModalActionError(err.message || 'Error appointing admin.');
    }
  };

  // Super Admin: Revoke Admin
  const handleRevokeAdmin = async (admin: any) => {
    if (admin.email === 'sih@gmail.com') {
      showToast('Cannot revoke Super Admin account!');
      return;
    }
    if (!window.confirm(`Are you sure you want to revoke admin permissions for ${admin.name} (${admin.email})?`)) {
      return;
    }

    try {
      await revokeAdminPrivilege(admin.id || admin._id);
      showToast(`Admin access revoked for ${admin.name}.`);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to revoke admin.');
    }
  };

  const handleConfirmSendNotice = () => {
    if (!noticeModalScan) return;
    const scanName = noticeModalScan.productName || 'Product';
    showToast(`Official Legal Show-Cause Notice dispatched for ${scanName}!`);
    setNoticeModalScan(null);
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

  if (!adminUser) {
    return (
      <div className="min-h-[82vh] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl bg-slate-900/95 border border-amber-500/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-2xl"
        >
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-lg">
              <Lock size={30} />
            </div>

            <div className="flex items-center justify-center gap-2 mb-1">
              <MinistryLogo size="sm" showText={false} />
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400">
                OFFICER ACCESS ONLY
              </span>
            </div>

            <h2 className="text-2xl font-black text-white font-heading">
              Ministry Admin Login
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Only authorized officers appointed by Super Admin can access this portal.
            </p>
          </div>

          <form onSubmit={handleOfficerLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 font-bold">
                OFFICER GMAIL / EMAIL:
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  placeholder="e.g. sih@gmail.com"
                  value={loginEmail}
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                    setLoginError('');
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 font-bold">
                ASSIGNED PASSWORD:
              </label>
              <div className="relative">
                <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  placeholder="Enter Password (e.g. 822115)"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    setLoginError('');
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-amber-300 font-mono placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle size={16} className="shrink-0 text-red-400" />
                <span>{loginError}</span>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={isLoggingIn}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-bold py-3 text-sm flex items-center justify-center gap-2"
            >
              <Gavel size={16} />
              <span>{isLoggingIn ? 'Verifying Credentials...' : 'Authenticate Officer Access'}</span>
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-400 mb-2">
              👑 <strong>Super Admin Credentials:</strong>
            </p>
            <button
              type="button"
              onClick={() => {
                setLoginEmail('sih@gmail.com');
                setLoginPassword('822115');
                handleOfficerLogin(undefined, 'sih@gmail.com', '822115');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold transition-all hover:scale-105 cursor-pointer shadow-lg shadow-amber-500/10"
            >
              <span>Auto-Login: <strong>sih@gmail.com (822115)</strong></span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
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
                {isSuperAdmin ? (
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-400" />
                    👑 SUPER ADMIN (NATIONAL OVERSIGHT & DELEGATION)
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    🏛️ APPOINTED MINISTRY ENFORCEMENT OFFICER
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  ONLINE: {adminUser.name}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                Ministry of Consumer Affairs Admin Portal
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
                {isSuperAdmin 
                  ? 'Supreme Authority: Manage appointed ministry officers, assign passwords, audit national food scans, and issue legal show-cause notices.'
                  : 'Authorized Enforcement Officer: Audit citizen scans, generate legal notices, and monitor compliance records.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={isRefreshing}
              className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Sync
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogoutOfficer}
              className="border-red-500/40 text-red-300 hover:bg-red-500/10"
            >
              <LogOut size={14} className="mr-1.5" />
              Sign Out
            </Button>

            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-700">
              <MinistryLogo size="sm" />
            </div>
          </div>
        </div>

        {/* Portal Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('REGISTRY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'REGISTRY'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Scale size={16} />
            <span>National Label Audit Registry</span>
          </button>

          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab('ADMIN_MANAGEMENT')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'ADMIN_MANAGEMENT'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              <Users size={16} />
              <span>👥 Appoint & Manage Admins ({adminList.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Notice Sent Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500 text-emerald-300 flex items-center gap-3 shadow-xl"
          >
            <CheckCircle2 size={24} className="text-emerald-400 shrink-0" />
            <span className="font-semibold text-sm">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TAB 1: REGISTRY */}
      {activeTab === 'REGISTRY' && (
        <div className="space-y-6">
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
                <span className="text-xs font-semibold uppercase font-mono">Appointed Admins</span>
                <Users size={18} className="text-amber-400" />
              </div>
              <div className="text-3xl font-black font-mono text-amber-400">
                {adminList.length > 0 ? adminList.length : 1}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Active Verified Enforcement Staff
              </span>
            </Card>
          </div>

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
                                onClick={() => setNoticeModalScan(scan)}
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
        </div>
      )}

      {/* TAB 2: ADMIN DELEGATION (SUPER ADMIN ONLY) */}
      {activeTab === 'ADMIN_MANAGEMENT' && isSuperAdmin && (
        <div className="space-y-6">
          <Card className="p-6 bg-slate-900/90 border-slate-800 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Users size={22} className="text-amber-400" />
                    Appointed Ministry Admins & Enforcement Officers
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    SUPER ADMIN EXCLUSIVE
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Only Super Admin (sih@gmail.com) has authority to create new officers, assign login passwords, and revoke access.
                </p>
              </div>

              <Button
                onClick={() => setIsNewAdminModalOpen(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-bold px-4 py-2 text-xs flex items-center gap-2"
              >
                <UserPlus size={16} />
                <span>Appoint New Admin</span>
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                    <th className="py-3 px-4">Officer Name</th>
                    <th className="py-3 px-4">Assigned Gmail / Email</th>
                    <th className="py-3 px-4">Department / Cell</th>
                    <th className="py-3 px-4">Authority Level</th>
                    <th className="py-3 px-4">Date Appointed</th>
                    <th className="py-3 px-4 text-right">Super Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr className="bg-amber-950/20">
                    <td className="py-3.5 px-4 font-bold text-amber-300 flex items-center gap-2">
                      <span>👑</span>
                      <span>Super Admin (sih@gmail.com)</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono">
                      sih@gmail.com
                    </td>
                    <td className="py-3.5 px-4 text-amber-200/80">
                      Ministry of Consumer Affairs & FSSAI
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-amber-500/30 text-amber-300 border border-amber-500/50 font-mono font-bold text-[10px]">
                        SUPREME GOVERNANCE
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      Permanent
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-500 text-[10px] font-mono">
                      PRIMARY ROOT
                    </td>
                  </tr>

                  {adminList.filter((a) => a.email !== 'sih@gmail.com').map((admin, idx) => (
                    <tr key={admin.id || admin._id || idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-white">
                        {admin.name}
                      </td>
                      <td className="py-3 px-4 text-cyan-300 font-mono">
                        {admin.email}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {admin.organization || 'Ministry Enforcement Division'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-mono text-[10px]">
                          ENFORCEMENT OFFICER
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                        {new Date(admin.createdAt || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleRevokeAdmin(admin)}
                          className="bg-red-950/80 hover:bg-red-700 text-red-300 hover:text-white text-xs px-2.5 py-1 border border-red-500/40"
                        >
                          <Trash2 size={12} className="mr-1" />
                          Revoke Access
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* MODAL: APPOINT NEW ADMIN */}
      <AnimatePresence>
        {isNewAdminModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3 text-amber-400 border-b border-slate-800 pb-3">
                <UserPlus size={24} />
                <div>
                  <h3 className="text-lg font-bold text-white">Appoint New Ministry Admin / Officer</h3>
                  <p className="text-xs text-slate-400">Grant statutory audit and show-cause notice powers</p>
                </div>
              </div>

              <form onSubmit={handleAppointAdmin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 font-bold">
                    OFFICER FULL NAME:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Rajesh Kumar, Joint Director"
                    value={newOfficerName}
                    onChange={(e) => setNewOfficerName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 font-bold">
                    OFFICIAL GMAIL / EMAIL:
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. rajesh.fssai@gmail.com"
                    value={newOfficerEmail}
                    onChange={(e) => setNewOfficerEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 font-bold">
                    ASSIGN SECRET LOGIN PASSWORD:
                  </label>
                  <input
                    type="text"
                    placeholder="Assign Password for this officer (e.g. Officer@789)"
                    value={newOfficerPassword}
                    onChange={(e) => setNewOfficerPassword(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-500"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    The officer will use their Gmail and this assigned password to login to /admin.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 font-bold">
                    MINISTRY DEPARTMENT:
                  </label>
                  <select
                    value={newOfficerDept}
                    onChange={(e) => setNewOfficerDept(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Legal Metrology Division">Legal Metrology Division (Dept. of Consumer Affairs)</option>
                    <option value="FSSAI Enforcement Division">FSSAI Central Enforcement Division</option>
                    <option value="CDSCO Cosmetics Cell">CDSCO Cosmetics & Drug Standards</option>
                    <option value="BIS Product Standards">Bureau of Indian Standards (BIS)</option>
                  </select>
                </div>

                {modalActionError && (
                  <div className="p-3 rounded-xl bg-red-950 border border-red-500 text-red-300 text-xs">
                    {modalActionError}
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setIsNewAdminModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                    <CheckCircle2 size={14} className="mr-1.5" />
                    Appoint Officer & Save Credentials
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
