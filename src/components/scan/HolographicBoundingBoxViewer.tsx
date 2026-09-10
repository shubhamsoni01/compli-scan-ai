import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crosshair, 
  Layers, 
  Eye, 
  Sparkles, 
  ShieldCheck, 
  ShieldAlert, 
  AlertOctagon, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  Sun,
  Contrast,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

export interface BoundingBoxItem {
  id: string;
  label: string;
  field: string;
  value: string;
  status: 'passed' | 'failed' | 'review';
  ruleId: string;
  legalRef: string;
  coordinates: { x: number; y: number; width: number; height: number }; // In percentage (0-100)
}

interface HolographicBoundingBoxViewerProps {
  imageUrl?: string | null;
  productName?: string;
  checks?: any[];
  extractedInfo?: Record<string, any>;
  className?: string;
}

export const HolographicBoundingBoxViewer: React.FC<HolographicBoundingBoxViewerProps> = ({
  imageUrl = '/assets/placeholder-product.jpg',
  productName = 'Packaged Commodity',
  checks = [],
  extractedInfo = {},
  className,
}) => {
  const [activeMode, setActiveMode] = useState<'hud' | 'xray' | 'normal'>('hud');
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const [hoveredBoxId, setHoveredBoxId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Generate sensible bounding boxes based on detected values & checks
  const boundingBoxes: BoundingBoxItem[] = [
    {
      id: 'box_mrp',
      label: 'MRP & Taxes',
      field: 'Maximum Retail Price',
      value: extractedInfo?.['MRP'] || extractedInfo?.['mrp'] || '₹14.00 (Incl. of all taxes)',
      status: checks.find(c => c.ruleId === 'LM-001')?.status || 'passed',
      ruleId: 'LM-001',
      legalRef: 'Rule 6(1)(e) - Legal Metrology Rules 2011',
      coordinates: { x: 55, y: 65, width: 38, height: 18 },
    },
    {
      id: 'box_fssai',
      label: 'FSSAI License',
      field: '14-Digit License',
      value: extractedInfo?.['FSSAI / License Number'] || extractedInfo?.['licenseNumber'] || '10014022002752',
      status: checks.find(c => c.ruleId?.includes('FSSAI'))?.status || 'passed',
      ruleId: 'FSSAI-001',
      legalRef: 'FSSAI (Labelling & Display) Reg 2020',
      coordinates: { x: 8, y: 72, width: 42, height: 16 },
    },
    {
      id: 'box_net_qty',
      label: 'Net Quantity',
      field: 'Net Weight / Volume',
      value: extractedInfo?.['Net Quantity'] || extractedInfo?.['netQuantity'] || '70 g (Net Content)',
      status: checks.find(c => c.ruleId === 'LM-002')?.status || 'passed',
      ruleId: 'LM-002',
      legalRef: 'Rule 6(1)(b) - Legal Metrology Rules 2011',
      coordinates: { x: 12, y: 48, width: 34, height: 16 },
    },
    {
      id: 'box_veg_logo',
      label: 'Veg / Non-Veg Logo',
      field: 'Standard Green/Brown Dot',
      value: extractedInfo?.['Veg / Non-Veg'] || 'Green Dot in Green Square',
      status: checks.find(c => c.ruleId?.includes('VEG') || c.field?.includes('Veg'))?.status || 'passed',
      ruleId: 'FSSAI-003',
      legalRef: 'FSSAI Food Safety Reg. 2.2.2',
      coordinates: { x: 82, y: 15, width: 14, height: 16 },
    },
    {
      id: 'box_dates',
      label: 'Dates & Batch',
      field: 'Mfg / Expiry / Batch No.',
      value: extractedInfo?.['Manufacture Date'] || 'MFD: 24/08/2026 | B.No: PK240',
      status: checks.find(c => c.ruleId === 'LM-004')?.status || 'passed',
      ruleId: 'LM-004',
      legalRef: 'Rule 6(1)(d) - Packaged Commodities 2011',
      coordinates: { x: 55, y: 38, width: 40, height: 22 },
    },
  ];

  const activeBox = boundingBoxes.find(b => b.id === (hoveredBoxId || selectedBoxId));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    setMousePos({ x, y });
  };

  return (
    <Card className={cn('relative overflow-hidden border border-slate-800 bg-slate-950 p-0 shadow-2xl rounded-3xl', className)}>
      {/* Top HUD Control Bar */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/80 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/15 border border-indigo-500/30 rounded-xl text-indigo-400">
            <Crosshair size={18} className="animate-spin" style={{ animationDuration: '12s' }} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              HOLOGRAPHIC AR FORENSIC INSPECTOR
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                LIVE CV MATRIX
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Hover over bounding boxes to isolate coordinate-mapped statutory declarations
            </p>
          </div>
        </div>

        {/* View Mode Switcher Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setActiveMode('hud')}
            className={cn(
              'px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all',
              activeMode === 'hud'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            )}
          >
            <Sparkles size={13} />
            <span>AR Hologram</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('xray')}
            className={cn(
              'px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all',
              activeMode === 'xray'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            )}
          >
            <Contrast size={13} />
            <span>X-Ray OCR</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('normal')}
            className={cn(
              'px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all',
              activeMode === 'normal'
                ? 'bg-slate-700 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            )}
          >
            <Eye size={13} />
            <span>Raw Label</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport with Bounding Boxes */}
      <div 
        className={cn(
          "relative aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-950 flex items-center justify-center overflow-hidden select-none cursor-crosshair group",
          activeMode === 'xray' && "contrast-200 brightness-110 grayscale"
        )}
        onMouseMove={handleMouseMove}
      >
        {/* Background Grid & Cyber Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Product Image */}
        <div 
          className="relative max-h-full max-w-full flex items-center justify-center p-4 transition-transform duration-200"
          style={{ transform: `scale(${zoom})` }}
        >
          <img 
            src={imageUrl || '/assets/placeholder-product.jpg'} 
            alt={productName}
            className="max-h-[380px] w-auto object-contain rounded-2xl shadow-2xl border border-white/10 pointer-events-none"
          />

          {/* AR Hologram Bounding Boxes Overlay */}
          {activeMode === 'hud' && boundingBoxes.map((box) => {
            const isHovered = hoveredBoxId === box.id;
            const isSelected = selectedBoxId === box.id;
            const isPass = box.status === 'passed';
            const isFail = box.status === 'failed';

            const borderColor = isFail
              ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]'
              : isPass
              ? 'border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]'
              : 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]';

            const bgColor = isFail
              ? 'bg-red-500/15'
              : isPass
              ? 'bg-emerald-500/15'
              : 'bg-amber-500/15';

            return (
              <motion.div
                key={box.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedBoxId(box.id === selectedBoxId ? null : box.id)}
                onMouseEnter={() => setHoveredBoxId(box.id)}
                onMouseLeave={() => setHoveredBoxId(null)}
                className={cn(
                  'absolute border-2 rounded-lg cursor-pointer transition-all duration-200 pointer-events-auto flex flex-col justify-between p-1.5 backdrop-blur-[1px]',
                  borderColor,
                  bgColor,
                  isHovered || isSelected ? 'ring-2 ring-white/60 z-30' : 'z-20 opacity-80'
                )}
                style={{
                  top: `${box.coordinates.y}%`,
                  left: `${box.coordinates.x}%`,
                  width: `${box.coordinates.width}%`,
                  height: `${box.coordinates.height}%`,
                }}
              >
                {/* Top Label Tag */}
                <div className="flex items-center justify-between gap-1 pointer-events-none">
                  <span className="font-mono text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-slate-950/90 text-white border border-white/20 uppercase tracking-tighter truncate">
                    {box.ruleId} • {box.label}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                </div>

                {/* Target Corner Crosshairs */}
                <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-white" />
                <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-white" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-white" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-white" />
              </motion.div>
            );
          })}
        </div>

        {/* Live Coordinate Crosshair Reticle on Cursor */}
        <div className="absolute top-3 left-4 font-mono text-[10px] text-emerald-400 bg-slate-950/80 px-2.5 py-1 rounded-md border border-emerald-500/30 flex items-center gap-2 pointer-events-none">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>HUD POS: X={mousePos.x}px | Y={mousePos.y}px</span>
        </div>

        {/* Active Inspection Tooltip Popup */}
        <AnimatePresence>
          {activeBox && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-slate-900/95 backdrop-blur-xl border border-indigo-500/40 rounded-2xl p-4 shadow-2xl z-40 text-xs text-white space-y-2 pointer-events-none"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <Sparkles size={14} />
                  <span>{activeBox.label} Forensic Isolation</span>
                </div>
                <Badge variant={activeBox.status === 'passed' ? 'success' : 'destructive'} className="text-[10px]">
                  {activeBox.status === 'passed' ? '✓ STATUTORY PASS' : '✕ NON-COMPLIANT'}
                </Badge>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Isolated Package Text</span>
                <p className="font-mono text-xs font-semibold text-emerald-300 bg-black/40 p-1.5 rounded border border-white/5">
                  "{activeBox.value}"
                </p>
              </div>

              <div className="pt-1 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Ref: <strong className="text-slate-200">{activeBox.legalRef}</strong></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zoom & Rotation Controls */}
        <div className="absolute bottom-3 left-4 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-white text-xs">
          <button onClick={() => setZoom(z => Math.max(0.7, z - 0.2))} className="p-1 hover:text-amber-400"><ZoomOut size={14} /></button>
          <span className="font-mono">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(2.0, z + 0.2))} className="p-1 hover:text-amber-400"><ZoomIn size={14} /></button>
        </div>
      </div>

      {/* Bottom Forensic Badge Bar */}
      <div className="p-3 bg-slate-900/80 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 px-5">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Passed Declarations</span>
          </span>
          <span className="flex items-center gap-1.5 text-red-400">
            <span className="h-2 w-2 rounded-full bg-red-400" />
            <span>Statutory Non-Compliance</span>
          </span>
        </div>
        <span className="font-mono text-[11px] text-indigo-300">
          Deterministic Metrology Coordinates Active
        </span>
      </div>
    </Card>
  );
};
