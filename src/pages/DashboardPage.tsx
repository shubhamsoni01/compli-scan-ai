import React, { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, CheckCircle, AlertTriangle, Eye, Scan, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { StatCard } from '@/components/ui/StatCard';
import { DropZone } from '@/components/ui/DropZone';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { fetchRealStats, fetchScansFromDB, type RealStatsResponse } from '@/services/api';
import { getGreeting } from '@/utils/formatters';

const ProductScanner = lazy(() => import('@/components/3d/ProductScanner'));

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function DashboardPage() {
  const navigate = useNavigate();
  
  const [stats, setStats] = React.useState<RealStatsResponse | null>(null);
  const [recentScans, setRecentScans] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetchRealStats().then(data => setStats(data));
    fetchScansFromDB({}).then(scans => {
      if (scans && scans.length > 0) {
        setRecentScans(scans.slice(0, 5).map((s: any) => ({
          id: s.scanId,
          productName: s.productName,
          category: s.category,
          score: s.complianceScore,
          status: s.overallStatus === 'COMPLIANT' ? 'Compliant' : s.overallStatus === 'NEEDS_REVIEW' ? 'Needs Review' : 'Issues',
          date: s.createdAt,
        })));
      } else {
        setRecentScans([]);
      }
    });
  }, []);

  const handleScanStart = (file?: File) => {
    navigate('/scan', { state: { file } });
  };

  const categories = ["Food", "Edible Oil", "Cosmetics", "Household", "Other"];

  const columns = [
    { header: 'Product', accessor: (row: any) => row.productName },
    { header: 'Category', accessor: (row: any) => row.category },
    { 
      header: 'Score', 
      accessor: (row: any) => (
        <span className={row.score >= 80 ? 'text-green-600' : row.score >= 50 ? 'text-amber-600' : 'text-red-600'}>
          {row.score}%
        </span>
      )
    },
    { 
      header: 'Status', 
      accessor: (row: any) => (
        <Badge 
          variant={row.status === 'Compliant' ? 'success' : row.status === 'Needs Review' ? 'warning' : 'danger'}
        >
          {row.status}
        </Badge>
      )
    },
    { header: 'Date', accessor: (row: any) => new Date(row.date).toLocaleDateString() },
    { 
      header: 'Action', 
      accessor: (row: any) => (
        <Button variant="ghost" size="sm" onClick={() => navigate(`/result/${row.id}`)}>
          View
        </Button>
      )
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">
            {getGreeting()}, Inspector 👋
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Scan any product label and get instant compliance insights.
          </p>
        </motion.div>

        {/* Hero Scan Card */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden bg-white dark:bg-slate-800 border-indigo-100 dark:border-indigo-900/50 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-8 flex flex-col justify-center">
                <h2 className="text-2xl font-bold mb-2 flex items-center">
                  <Scan className="mr-2 text-indigo-500" /> Scan Product Label
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Upload a clear image of the product label to begin analysis.
                </p>
                
                <div className="mb-6">
                  <DropZone 
                    onFileSelect={(file) => handleScanStart(file)} 
                    className="h-48"
                  />
                </div>
                
                <div className="mb-8">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Supported Categories:</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <Chip key={cat} label={cat} variant="default" />
                    ))}
                  </div>
                </div>
                
                <Button size="lg" onClick={() => handleScanStart()} className="w-full sm:w-auto">
                  Start Scanning
                </Button>
              </div>
              
              <div className="relative hidden lg:block bg-slate-50 dark:bg-slate-900 min-h-[400px]">
                <Suspense fallback={<div className="flex items-center justify-center h-full text-indigo-500"><Scan className="h-10 w-10 animate-spin" /></div>}>
                  <ProductScanner />
                </Suspense>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Scans"
            value={stats ? stats.totalScans.toString() : "0"}
            icon={<BarChart3 className="h-5 w-5" />}
          />
          <StatCard
            title="Compliant"
            value={stats ? stats.compliantProducts.toString() : "0"}
            icon={<CheckCircle className="h-5 w-5 text-green-500" />}
          />
          <StatCard
            title="Potential Issues"
            value={stats ? stats.nonCompliantProducts.toString() : "0"}
            icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
          />
          <StatCard
            title="Needs Review"
            value={stats ? stats.needsReviewProducts.toString() : "0"}
            icon={<Eye className="h-5 w-5 text-blue-500" />}
          />
        </motion.div>

        {/* Recent Scans */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-heading">Recent Scans</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/history')} className="text-indigo-600 dark:text-indigo-400">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <Card className="overflow-hidden">
            {recentScans.length > 0 ? (
              <Table 
                data={recentScans} 
                columns={columns} 
              />
            ) : (
              <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
                No scans recorded in MongoDB yet. Upload or capture a label to perform your first scan.
              </div>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
