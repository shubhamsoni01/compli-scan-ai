import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ZoomIn, ZoomOut, RotateCw, Maximize2, Package } from 'lucide-react';
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

export default function DetailedResultPage() {
  const { scanId, id } = useParams<{ scanId?: string; id?: string }>();
  const activeId = scanId || id;
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const [dbResult, setDbResult] = useState<any | null>(null);

  React.useEffect(() => {
    if (activeId && !getCachedScanResult(activeId)) {
      getScanResultAsync(activeId).then((res) => {
        if (res) setDbResult(res);
      });
    }
  }, [activeId]);

  const currentResult = (activeId ? getCachedScanResult(activeId) : null) || dbResult || (activeId === 'scan_001' ? mockComplianceResult : mockComplianceResult);
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
                  <p className="text-[11px] text-gray-400 pt-1">
                    Official Reference: <span className="font-medium text-gray-600 dark:text-gray-300">{check.legalReference}</span>
                  </p>
                </div>
              </div>
            </Card>
          ))}
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
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                <p className={cn(
                  "font-medium break-words",
                  !value ? "text-red-500 dark:text-red-400 italic" : "text-gray-900 dark:text-gray-100"
                )}>{String(value) || 'Not detected'}</p>
              </div>
            ))}
          </div>
        </Card>
      )
    },
    {
      id: 'readability',
      label: 'Font Size & Readability',
      content: currentResult.readabilityResult ? (
        <div className="space-y-4">
          <ReadabilityCard data={currentResult.readabilityResult} />
        </div>
      ) : (
        <Card className="p-6 text-center text-gray-500">
          <p>Readability analysis data is not available for this scan.</p>
        </Card>
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
      {/* Left Panel */}
      <div className="w-full md:w-2/5 p-4 flex flex-col gap-4 border-r border-gray-200 dark:border-gray-800 h-[50vh] md:h-full">
        <Card className="flex-1 bg-gray-100 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 flex items-center justify-center overflow-hidden relative shadow-inner">
          <div 
            className="transition-transform duration-200 ease-out flex items-center justify-center w-full h-full p-4"
            style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
          >
            {(currentResult as any).uploadedImage ? (
              <img 
                src={(currentResult as any).uploadedImage} 
                alt="Product label preview" 
                className="max-h-full max-w-full object-contain rounded-lg shadow-md select-none pointer-events-none" 
              />
            ) : (
              <Package size={120} className="text-gray-300 dark:text-gray-700" />
            )}
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full" onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}><ZoomOut size={16} /></Button>
            <span className="text-xs font-medium w-8 text-center">{Math.round(zoom * 100)}%</span>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full" onClick={() => setZoom(z => Math.min(3, z + 0.25))}><ZoomIn size={16} /></Button>
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1" />
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full" onClick={() => setRotation(r => r + 90)}><RotateCw size={16} /></Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full"><Maximize2 size={16} /></Button>
          </div>
        </Card>
        
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
      <div className="w-full md:w-3/5 h-[50vh] md:h-full overflow-y-auto custom-scrollbar p-4 md:p-6">
        <Tabs tabs={tabData} />
      </div>
    </div>
  );
}
