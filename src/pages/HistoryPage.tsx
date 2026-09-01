import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Search, FileX, Download, Edit3, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Card } from '@/components/ui/Card';
import { SearchBar } from '@/components/ui/SearchBar';
import { Chip } from '@/components/ui/Chip';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { fetchScansFromDB, generateReportPDF, fetchScanByIdFromDB } from '@/services/api';
import { EditReportModal } from '@/components/report/EditReportModal';
import { formatDate, formatTime } from '@/utils/formatters';

const categories = ['All', 'Food', 'Edible Oil', 'Cosmetics', 'Household'];
const statuses = ['All', 'Compliant', 'Potential Issue', 'Needs Review'];

export default function HistoryPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState<any[]>([]);

  // Edit modal state
  const [editingScan, setEditingScan] = useState<any | null>(null);
  const [downloadingPdfId, setDownloadingPdfId] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        // Query real scans from MongoDB Atlas with server-side search and filters
        const realScans = await fetchScansFromDB({
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          status: selectedStatus !== 'All' ? selectedStatus : undefined,
          search: searchQuery.trim() || undefined,
        });

        let dataToDisplay: any[] = [];

        if (realScans && realScans.length > 0) {
          dataToDisplay = realScans.map((doc: any) => ({
            id: doc.scanId,
            scanId: doc.scanId,
            productName: doc.productName || 'Scanned Packaged Product',
            brand: doc.brand || 'Detected Brand',
            category: doc.category || 'Food',
            score: doc.complianceScore ?? 80,
            originalImageUrl: doc.originalImageUrl || null,
            status:
              doc.overallStatus === 'COMPLIANT'
                ? 'compliant'
                : doc.overallStatus === 'POTENTIAL_NON_COMPLIANCE'
                ? 'potential-issue'
                : 'needs-review',
            date: doc.createdAt || new Date().toISOString(),
            rawDoc: doc,
          }));
        }

        setHistoryData(dataToDisplay);
      } catch (error) {
        console.error("Failed to fetch scan history", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Debounce search
    const timer = setTimeout(fetchHistory, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedStatus]);

  const handleDownloadPDF = async (scan: any) => {
    setDownloadingPdfId(scan.id);
    try {
      // Fetch complete record if needed
      const fullDoc = await fetchScanByIdFromDB(scan.id);
      const payload = fullDoc || scan.rawDoc || {
        scanId: scan.id,
        productName: scan.productName,
        productBrand: scan.brand,
        category: scan.category,
        score: scan.score,
        scanDate: scan.date,
        overallStatus: scan.status === 'compliant' ? 'COMPLIANT' : 'NEEDS_REVIEW',
        originalImageUrl: scan.originalImageUrl,
      };

      const { blob, filename } = await generateReportPDF(payload);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF Download failed:', err);
    } finally {
      setDownloadingPdfId(null);
    }
  };

  const handleOpenEdit = async (scan: any) => {
    try {
      const fullDoc = await fetchScanByIdFromDB(scan.id);
      setEditingScan(fullDoc || scan.rawDoc || scan);
    } catch {
      setEditingScan(scan.rawDoc || scan);
    }
  };

  const columns = [
    {
      header: 'Product',
      accessor: (row: any) => (
        <div className="flex items-center gap-3">
          {row.originalImageUrl ? (
            <img 
              src={row.originalImageUrl} 
              alt={row.productName} 
              className="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-gray-700 shrink-0" 
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 shrink-0">
              <ImageIcon size={18} />
            </div>
          )}
          <div className="min-w-0">
            <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{row.productName}</p>
            <p className="text-xs text-gray-500 truncate">{row.brand}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Category',
      accessor: (row: any) => <Badge variant="outline">{row.category}</Badge>
    },
    {
      header: 'Score',
      accessor: (row: any) => (
        <span className={cn(
          "font-bold",
          row.score >= 90 ? "text-green-600" : row.score >= 70 ? "text-amber-600" : "text-red-600"
        )}>{row.score}%</span>
      )
    },
    {
      header: 'Status',
      accessor: (row: any) => {
        let variant: 'success' | 'warning' | 'destructive' = 'success';
        let label = 'Compliant';
        if (row.score < 90 && row.score >= 70) { variant = 'warning'; label = 'Potential Issue'; }
        else if (row.score < 70) { variant = 'destructive'; label = 'Needs Review'; }
        return <Badge variant={variant}>{label}</Badge>;
      }
    },
    {
      header: 'Date & Time',
      accessor: (row: any) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>{formatDate(row.date)}</p>
          <p className="text-xs">{formatTime(row.date)}</p>
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: (row: any) => (
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/result/${row.id}`)} title="View Report">
            <Eye size={15} className="mr-1" /> View
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleDownloadPDF(row)}
            disabled={downloadingPdfId === row.id}
            title="Download PDF"
          >
            {downloadingPdfId === row.id ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(row)} title="Edit Report">
            <Edit3 size={15} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Scan History</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage your personal scan history</p>
      </div>

      <Card className="p-4 space-y-4 shadow-sm border-gray-100 dark:border-gray-800">
        <div className="grid md:grid-cols-[1fr_auto] gap-4">
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery} 
            placeholder="Search products..." 
            className="w-full md:max-w-md"
          />
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-500 mr-2">Status:</span>
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Categories</p>
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <Chip 
                key={c} 
                label={c} 
                selected={selectedCategory === c} 
                onClick={() => setSelectedCategory(c)} 
              />
            ))}
          </div>
        </div>
      </Card>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : historyData.length > 0 ? (
          <>
            <div className="hidden md:block">
              <Table columns={columns} data={historyData} />
            </div>
            
            {/* Mobile Card Layout */}
            <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
              {historyData.map((item) => (
                <div key={item.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{item.productName}</p>
                      <p className="text-sm text-gray-500">{item.brand}</p>
                    </div>
                    <Badge variant="outline">{item.category}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                    <div>
                      <span className="text-sm text-gray-500 block">Score</span>
                      <span className={cn(
                        "font-bold text-lg",
                        item.score >= 90 ? "text-green-600" : item.score >= 70 ? "text-amber-600" : "text-red-600"
                      )}>{item.score}%</span>
                    </div>
                    <div className="text-right">
                       <span className="text-sm text-gray-500 block">Date</span>
                       <span className="text-sm font-medium">{formatDate(item.date)}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/result/${item.id}`)} className="text-xs">
                      <Eye size={14} className="mr-1" /> View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDownloadPDF(item)}
                      disabled={downloadingPdfId === item.id}
                      className="text-xs"
                    >
                      {downloadingPdfId === item.id ? <Loader2 size={14} className="animate-spin mr-1" /> : <Download size={14} className="mr-1" />}
                      PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleOpenEdit(item)} className="text-xs">
                      <Edit3 size={14} className="mr-1" /> Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <EmptyState 
            icon={<FileX />}
            title="No scans found"
            description="We couldn't find any scans matching your current filters."
            actionLabel="Clear Filters"
            onAction={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedStatus('All'); }}
          />
        )}
        
        {!loading && historyData.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-center">
            <div className="flex gap-1">
              {[1, 2, 3].map(page => (
                <button key={page} className={cn(
                  "w-8 h-8 rounded-md flex items-center justify-center text-sm font-medium transition-colors",
                  page === 1 ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                )}>
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Edit Report Modal */}
      {editingScan && (
        <EditReportModal
          isOpen={Boolean(editingScan)}
          onClose={() => setEditingScan(null)}
          reportData={editingScan}
        />
      )}
    </div>
  );
}
