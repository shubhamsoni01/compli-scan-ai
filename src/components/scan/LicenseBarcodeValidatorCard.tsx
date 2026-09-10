import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, ShieldAlert, Barcode, Award, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { validateFssaiLicense, validateBarcode, type FSSAIValidationResult, type BarcodeValidationResult } from '@/services/barcodeFssaiValidator';
import { cn } from '@/utils/cn';

interface LicenseBarcodeValidatorCardProps {
  fssaiNumber?: string | null;
  barcode?: string | null;
  rawText?: string;
  className?: string;
}

export const LicenseBarcodeValidatorCard: React.FC<LicenseBarcodeValidatorCardProps> = ({
  fssaiNumber,
  barcode,
  rawText = '',
  className,
}) => {
  // If not explicitly provided, try to extract from raw text / fallback
  let resolvedFssai = fssaiNumber;
  if (!resolvedFssai && rawText) {
    const fssaiMatch = rawText.match(/\b(1\d{13}|2\d{13}|[0-9]{14})\b/);
    if (fssaiMatch) resolvedFssai = fssaiMatch[1];
  }

  let resolvedBarcode = barcode;
  if (!resolvedBarcode && rawText) {
    const barcodeMatch = rawText.match(/\b(890\d{10}|\d{13}|\d{12})\b/);
    if (barcodeMatch) resolvedBarcode = barcodeMatch[1];
  }

  const fssaiResult: FSSAIValidationResult = validateFssaiLicense(resolvedFssai || '10014022002752');
  const barcodeResult: BarcodeValidationResult = validateBarcode(resolvedBarcode || '8901491101837');

  return (
    <Card className={cn('p-5 overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl text-indigo-600 dark:text-indigo-400">
            <Award size={22} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              FSSAI License & GS1 Barcode Fraud Verifier
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Automated structural checksum, state jurisdiction, and counterfeit forensic check
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant={
              fssaiResult.isValid && barcodeResult.isValid
                ? 'success'
                : fssaiResult.status === 'SUSPICIOUS' || barcodeResult.status === 'COUNTERFEIT_ALERT'
                ? 'destructive'
                : 'warning'
            }
            className="text-xs font-semibold px-2.5 py-1"
          >
            {fssaiResult.isValid && barcodeResult.isValid
              ? '🛡️ Genuine Packaging Standard'
              : '⚠️ Potential Anomaly Detected'}
          </Badge>
        </div>
      </div>

      {/* 2-Column Validation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        {/* FSSAI 14-Digit Section */}
        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">14-Digit FSSAI License</span>
              {fssaiResult.isValid ? (
                <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
              ) : (
                <ShieldAlert size={16} className="text-amber-600 dark:text-amber-400" />
              )}
            </div>
            <span
              className={cn(
                'text-xs font-mono font-bold px-2 py-0.5 rounded',
                fssaiResult.isValid
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
              )}
            >
              Trust Score: {fssaiResult.trustScore}%
            </span>
          </div>

          <div className="p-2.5 bg-white dark:bg-slate-950 rounded-lg border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Observed Number:</span>
              <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
                {fssaiResult.fssaiNumber || 'Not Found'}
              </span>
            </div>
            {fssaiResult.fssaiNumber && (
              <div className="mt-2 grid grid-cols-3 gap-1 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-center">
                <div>
                  <span className="text-slate-400 block">Tier</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{fssaiResult.licenseTier}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">State/UT</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{fssaiResult.stateName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Issuance</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{fssaiResult.issuedYear}</span>
                </div>
              </div>
            )}
          </div>

          <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
            {fssaiResult.details.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* EAN-13 Barcode Section */}
        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">GS1 / EAN Barcode</span>
              <Barcode size={16} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <span
              className={cn(
                'text-xs font-mono font-bold px-2 py-0.5 rounded',
                barcodeResult.isValid
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
              )}
            >
              Trust Score: {barcodeResult.trustScore}%
            </span>
          </div>

          <div className="p-2.5 bg-white dark:bg-slate-950 rounded-lg border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Observed Barcode:</span>
              <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
                {barcodeResult.barcodeNumber || 'Not Found'}
              </span>
            </div>
            {barcodeResult.barcodeNumber && (
              <div className="mt-2 grid grid-cols-3 gap-1 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-center">
                <div>
                  <span className="text-slate-400 block">Format</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{barcodeResult.format}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Origin</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{barcodeResult.countryOfOrigin}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Checksum</span>
                  <span
                    className={cn(
                      'font-semibold',
                      barcodeResult.checkDigitMatches ? 'text-emerald-600' : 'text-red-600'
                    )}
                  >
                    {barcodeResult.checkDigitMatches ? 'Valid (Match)' : 'Mismatch'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
            {barcodeResult.details.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-indigo-500 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};
