import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertOctagon } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockComplianceResult, complianceRules } from '@/data/complianceRules';
import { getCachedScanResult, getScanResultAsync } from '@/services/scanService';
import { formatDate } from '@/utils/formatters';
import { AIProcessingDetails } from '@/components/scan/AIProcessingDetails';
import { ReadabilityCard } from '@/components/scan/ReadabilityCard';

import { NutritionThresholdCard } from '@/components/scan/NutritionThresholdCard';
import { OfficialGazetteDocsCard } from '@/components/scan/OfficialGazetteDocsCard';
import { VoiceAudioAssistantCard } from '@/components/voice/VoiceAudioAssistantCard';
import { LicenseBarcodeValidatorCard } from '@/components/scan/LicenseBarcodeValidatorCard';
import { CompliBotWidget } from '@/components/chat/CompliBotWidget';
import { HolographicBoundingBoxViewer } from '@/components/scan/HolographicBoundingBoxViewer';
import { StatutoryPenaltyRiskMeter } from '@/components/scan/StatutoryPenaltyRiskMeter';

export default function DetailedResultPage() {
  const navigate = useNavigate();
  const { scanId, id } = useParams<{ scanId?: string; id?: string }>();
  const activeId = scanId || id;

  const cached = activeId ? getCachedScanResult(activeId) : null;
  const [dbResult, setDbResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!cached && activeId !== 'scan_001');

  React.useEffect(() => {
    if (activeId && !getCachedScanResult(activeId) && activeId !== 'scan_001') {
      setIsLoading(true);
      getScanResultAsync(activeId)
        .then((res) => {
          if (res) setDbResult(res);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [activeId]);

  const currentResult = cached || dbResult || (activeId === 'scan_001' ? mockComplianceResult : null);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-spin" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 font-heading">Loading Detailed Inspection...</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Retrieving full statutory compliance audit breakdown.</p>
      </div>
    );
  }

  if (!currentResult) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-lg text-center space-y-6">
        <Card className="p-8 border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 text-center space-y-4">
          <AlertOctagon className="w-12 h-12 text-amber-600 dark:text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 font-heading">Inspection Record Not Found</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            The detailed record for this scan could not be loaded. Please perform a fresh scan or select an item from history.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Button variant="primary" onClick={() => navigate('/scan')}>
              Scan Product
            </Button>
            <Button variant="outline" onClick={() => navigate('/history')}>
              View History
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const productRules = complianceRules.filter(r => (r.applicableTo as string[]).includes(currentResult.category) || (r.applicableTo as string[]).includes('all'));

  const tabData = [
    {
      id: 'analysis',
      label: 'Rule Compliance Analysis',
      content: (
        <div className="space-y-4">
          <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50 text-xs text-indigo-700 dark:text-indigo-300 font-medium flex items-center justify-between">
            <span>Deterministic Legal Rule Engine • {currentResult.checks.length} Official Statutory Rules Evaluated</span>
            <span className="font-mono text-[11px] bg-white/80 dark:bg-gray-900 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
              Score: {currentResult.score}%
            </span>
          </div>
          {currentResult.checks.map((check: any) => (
            <Card key={check.ruleId} className="p-4 flex flex-col space-y-3 shadow-sm border-gray-100 dark:border-gray-800">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <StatusIndicator status={check.status === 'passed' ? 'passed' : check.status === 'failed' ? 'failed' : 'warning'} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{check.ruleId}</span>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{check.field}</h4>
                    </div>
                  </div>
                </div>
                <Badge variant={
                  check.status === 'passed' ? 'success' : 
                  check.status === 'failed' ? 'destructive' : 
                  check.status === 'not-applicable' ? 'outline' : 'warning'
                }>
                  {check.status === 'passed' ? '✓ PASS' : check.status === 'failed' ? '✕ FAIL' : check.status === 'review' ? '⚠ NEEDS REVIEW' : '— NOT APPLICABLE'}
                </Badge>
              </div>
              <div className="pl-9 space-y-2">
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Observed Value</span>
                  <p className={cn(
                    "font-medium text-sm mt-0.5",
                    !check.detectedValue ? "text-red-500 dark:text-red-400 italic" : "text-gray-800 dark:text-gray-200"
                  )}>
                    {check.detectedValue || 'Not detected on package'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-xs text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700 space-y-1">
                  <p><strong className="text-gray-700 dark:text-gray-200">Requirement:</strong> {check.requirement}</p>
                  <p><strong className="text-gray-700 dark:text-gray-200">Deterministic Reason:</strong> {check.explanation}</p>
                  <div className="pt-1 flex items-center justify-between text-[11px] text-gray-400">
                    <span>Official Reference: <span className="font-medium text-gray-600 dark:text-gray-300">{check.legalReference}</span></span>
                    <a
                      href="https://www.fssai.gov.in/upload/uploadfiles/files/Gazette_Notification_Labelling_Display_18_11_2020.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline font-mono"
                    >
                      Gazette PDF ↗
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )
    },
    {
      id: 'penalty-risk',
      label: '⚖️ Statutory Risk & Liability',
      content: (
        <div className="space-y-4">
          <StatutoryPenaltyRiskMeter
            score={currentResult.score}
            failedCount={currentResult.checks?.filter((c: any) => c.status === 'failed').length ?? 0}
            checks={currentResult.checks}
            productName={currentResult.productName}
          />
        </div>
      )
    },
    {
      id: 'voice-brief',
      label: '🎙️ AI Voice Brief',
      content: (
        <div className="space-y-4">
          <VoiceAudioAssistantCard scanData={currentResult} />
        </div>
      )
    },
    {
      id: 'nutrition',
      label: '🥗 Nutrition & HFSS Audit',
      content: (
        <div className="space-y-4">
          <NutritionThresholdCard 
            extractedInfo={{
              ...(currentResult.extractedInfo || {}),
              rawText: (currentResult as any).ocrText || (currentResult.extractedInfo && currentResult.extractedInfo['rawText']) || '',
              ocrText: (currentResult as any).ocrText || '',
            }} 
            category={currentResult.category} 
            auditReport={currentResult.nutritionAudit}
          />
        </div>
      )
    },
    {
      id: 'extracted',
      label: 'Extracted Information',
      content: (
        <Card className="p-0 overflow-hidden shadow-sm border-gray-100 dark:border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-800">
            {Object.entries(currentResult.extractedInfo).map(([key, value], idx, arr) => (
              <div key={key} className={cn(
                "p-4",
                idx >= arr.length - (arr.length % 2 === 0 ? 2 : 1) ? "border-b-0" : "border-b border-gray-100 dark:border-gray-800"
              )}>
                <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">{key}</span>
                <p className={cn(
                  "font-medium text-sm mt-1 break-words",
                  !value ? "text-red-500 dark:text-red-400 italic" : "text-gray-800 dark:text-gray-200"
                )}>
                  {value ? (typeof value === 'object' ? JSON.stringify(value) : String(value)) : 'Not detected'}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )
    },
    {
      id: 'readability',
      label: 'Readability Analysis',
      content: currentResult.readabilityResult ? (
        <ReadabilityCard data={currentResult.readabilityResult} />
      ) : (
        <Card className="p-6 text-center text-gray-500">
          <p>Readability analysis data is not available for this scan.</p>
        </Card>
      )
    },
    {
      id: 'license-barcode',
      label: '🛡️ FSSAI & Barcode Verifier',
      content: (
        <div className="space-y-4">
          <LicenseBarcodeValidatorCard
            fssaiNumber={currentResult.extractedInfo?.['FSSAI / License Number'] || (currentResult.extractedInfo && currentResult.extractedInfo['licenseNumber']) || ''}
            barcode={currentResult.extractedInfo?.['Barcode'] || (currentResult.extractedInfo && currentResult.extractedInfo['barcode']) || ''}
            rawText={(currentResult as any).ocrText || (currentResult.extractedInfo && currentResult.extractedInfo['rawText']) || ''}
          />
        </div>
      )
    },
    {
      id: 'gazettes',
      label: '🏛️ Official Acts & Gazettes',
      content: (
        <OfficialGazetteDocsCard category={currentResult.category} />
      )
    },
    {
      id: 'rules',
      label: 'Applicable Rules',
      content: (
        <div className="space-y-4">
          {productRules.map(rule => (
            <Card key={rule.id} className="p-4 space-y-2 cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors shadow-sm border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="mb-2">{rule.id}</Badge>
                <Badge variant="secondary" className="text-xs">{rule.authority}</Badge>
              </div>
              <p className="font-medium text-gray-900 dark:text-gray-100">{rule.requirement}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{rule.description}</p>
            </Card>
          ))}
        </div>
      )
    },
    {
      id: 'ai-processing',
      label: 'AI Processing Details',
      content: (
        <AIProcessingDetails
          scanId={currentResult.scanId}
          image={(currentResult as any).uploadedImage}
          ocrText={(currentResult as any).ocrText}
          groqData={(currentResult as any).structuredProduct}
          ocrEngine={(currentResult as any).ocrEngine}
        />
      )
    }
  ];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden bg-gray-50/50 dark:bg-[#0a0e1a]">
      {/* Left Panel - Holographic Forensic AR Viewer */}
      <div className="w-full md:w-5/12 p-4 flex flex-col gap-4 border-r border-gray-200 dark:border-gray-800 h-[50vh] md:h-full overflow-y-auto custom-scrollbar">
        <HolographicBoundingBoxViewer
          imageUrl={(currentResult as any).uploadedImage || (currentResult as any).originalImageUrl}
          productName={currentResult.productName}
          checks={currentResult.checks}
          extractedInfo={currentResult.extractedInfo}
          className="shadow-md"
        />
        
        <Card className="p-4 shrink-0 shadow-sm border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="font-bold text-lg">{currentResult.productName}</h2>
              <p className="text-sm text-gray-500">{currentResult.productBrand}</p>
            </div>
            <Badge>{currentResult.category}</Badge>
          </div>
          <p className="text-xs text-gray-400">Scanned on {formatDate(currentResult.scanDate)}</p>
        </Card>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-7/12 h-[50vh] md:h-full overflow-y-auto custom-scrollbar p-4 md:p-6">
        <Tabs tabs={tabData} />
      </div>

      {/* Interactive AI Legal Copilot Chatbot */}
      <CompliBotWidget scanData={currentResult} />
    </div>
  );
}
