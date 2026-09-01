import React, { useState } from 'react';
import { 
  Edit3, 
  Save, 
  X, 
  Download, 
  FileText, 
  Check, 
  AlertCircle, 
  Loader2, 
  FileCheck2,
  Undo2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { saveScanEditsToDB, generateReportDocx, generateReportPDF } from '@/services/api';

interface EditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: any;
  onSaved?: (updatedEdits: any) => void;
}

export const EditReportModal: React.FC<EditReportModalProps> = ({
  isOpen,
  onClose,
  reportData,
  onSaved,
}) => {
  // Existing edits or initialized from actual scan
  const initialEdits = reportData.reviewerEdits || {};
  const [productName, setProductName] = useState(initialEdits.productName || reportData.productName || '');
  const [category, setCategory] = useState(initialEdits.category || reportData.category || 'Food');
  const [mrp, setMrp] = useState(initialEdits.mrp || reportData.extractedInfo?.['MRP'] || '');
  const [netQuantity, setNetQuantity] = useState(initialEdits.netQuantity || reportData.extractedInfo?.['Net Quantity'] || '');
  const [manufacturer, setManufacturer] = useState(initialEdits.manufacturer || reportData.extractedInfo?.['Manufacturer'] || '');
  const [remarks, setRemarks] = useState(initialEdits.remarks || '');
  const [correctiveAction, setCorrectiveAction] = useState(initialEdits.correctiveAction || '');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isDownloadingDocx, setIsDownloadingDocx] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveEdits = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);

    const edits = {
      productName,
      category,
      mrp,
      netQuantity,
      manufacturer,
      remarks,
      correctiveAction,
      editedAt: new Date().toISOString(),
    };

    try {
      const ok = await saveScanEditsToDB(reportData.scanId, edits);
      if (ok) {
        setSaveSuccess(true);
        reportData.reviewerEdits = edits;
        if (onSaved) onSaved(edits);
        setTimeout(() => setSaveSuccess(false), 2500);
      } else {
        setErrorMessage('Failed to save edits to server. Changes preserved locally.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error saving edits.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadDocx = async () => {
    setIsDownloadingDocx(true);
    try {
      const currentUserRaw = localStorage.getItem('compliscan_user_data');
      let currentAuthUser: any = null;
      try {
        if (currentUserRaw) currentAuthUser = JSON.parse(currentUserRaw);
      } catch {}

      const mergedPayload = {
        ...reportData,
        userName: currentAuthUser?.name || reportData.userName || 'CompliScan User',
        userEmail: currentAuthUser?.email || reportData.userEmail || '',
        originalImageUrl: reportData.originalImageUrl || reportData.uploadedImage,
        originalFilename: reportData.originalFilename || 'Original filename unavailable',
        productName,
        category,
        extractedInfo: {
          ...reportData.extractedInfo,
          'MRP': mrp,
          'Net Quantity': netQuantity,
          'Manufacturer': manufacturer,
        },
        reviewerEdits: {
          productName,
          category,
          mrp,
          netQuantity,
          manufacturer,
          remarks,
          correctiveAction,
        },
      };

      const { blob, filename } = await generateReportDocx(mergedPayload);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to download editable DOCX.');
    } finally {
      setIsDownloadingDocx(false);
    }
  };

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      const currentUserRaw = localStorage.getItem('compliscan_user_data');
      let currentAuthUser: any = null;
      try {
        if (currentUserRaw) currentAuthUser = JSON.parse(currentUserRaw);
      } catch {}

      const mergedPayload = {
        ...reportData,
        userName: currentAuthUser?.name || reportData.userName || 'CompliScan User',
        userEmail: currentAuthUser?.email || reportData.userEmail || '',
        originalImageUrl: reportData.originalImageUrl || reportData.uploadedImage,
        originalFilename: reportData.originalFilename || 'Original filename unavailable',
        productName,
        category,
        extractedInfo: {
          ...reportData.extractedInfo,
          'MRP': mrp,
          'Net Quantity': netQuantity,
          'Manufacturer': manufacturer,
        },
        reviewerEdits: {
          productName,
          category,
          mrp,
          netQuantity,
          manufacturer,
          remarks,
          correctiveAction,
        },
      };

      const { blob, filename } = await generateReportPDF(mergedPayload);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to download updated PDF.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="p-4 px-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/70 dark:bg-gray-950/40">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                <Edit3 size={20} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-gray-900 dark:text-gray-100 text-base">
                  Edit Compliance Report
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Add reviewer notes, verified values & corrective actions before exporting
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm">
            {/* Non-destructive Notice */}
            <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 text-xs text-indigo-800 dark:text-indigo-300">
              <strong>Non-Destructive Editing:</strong> Original OCR text and statutory rule checks are preserved untouched. Reviewer additions are layered on top for compliance auditing.
            </div>

            {/* Editable Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Product Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Food">Food</option>
                  <option value="Edible Oil">Edible Oil</option>
                  <option value="Cosmetics">Cosmetics</option>
                  <option value="Household">Household</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Observed MRP
                </label>
                <input
                  type="text"
                  value={mrp}
                  onChange={(e) => setMrp(e.target.value)}
                  placeholder="e.g. ₹20 (incl. of all taxes)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Observed Net Quantity
                </label>
                <input
                  type="text"
                  value={netQuantity}
                  onChange={(e) => setNetQuantity(e.target.value)}
                  placeholder="e.g. 150 g / 1 L"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Manufacturer / Packer
                </label>
                <input
                  type="text"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  placeholder="Manufacturer name & registered address"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Reviewer Remarks & Observations
                </label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Inspector notes, clarification on visual defects, or statutory findings..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Recommended Corrective Action
                </label>
                <textarea
                  rows={2}
                  value={correctiveAction}
                  onChange={(e) => setCorrectiveAction(e.target.value)}
                  placeholder="Notice to manufacturer, relabelling order, or batch inspection recommended..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Error or Success notification */}
            {saveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                <Check size={16} /> Changes saved successfully to scan record.
              </div>
            )}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle size={16} /> {errorMessage}
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="p-4 px-6 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3 bg-gray-50/70 dark:bg-gray-950/40">
            <Button
              variant="primary"
              onClick={handleSaveEdits}
              disabled={isSaving}
              className="flex items-center gap-2 text-xs h-9"
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              <span>Save Changes</span>
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleDownloadPdf}
                disabled={isDownloadingPdf}
                className="flex items-center gap-1.5 text-xs h-9"
              >
                {isDownloadingPdf ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                <span>Download PDF</span>
              </Button>

              <Button
                onClick={handleDownloadDocx}
                disabled={isDownloadingDocx}
                className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 text-xs h-9 font-semibold shadow-sm"
              >
                {isDownloadingDocx ? <Loader2 size={14} className="animate-spin" /> : <FileCheck2 size={14} />}
                <span>Export Editable Report (DOCX)</span>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
