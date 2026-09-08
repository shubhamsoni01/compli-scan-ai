import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, AlertTriangle, XCircle, ArrowRight, 
  Sparkles, ExternalLink, ShieldAlert, Cpu, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

interface SampleProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  categoryIcon: string;
  score: number;
  status: 'compliant' | 'warning' | 'non-compliant';
  statusLabel: string;
  tagline: string;
  checks: {
    title: string;
    authority: string;
    passed: boolean;
    detail: string;
  }[];
  extracted: {
    mrp: string;
    netQty: string;
    fssaiOrLic: string;
    mfgDate: string;
    vegNonVeg: string;
  };
}

const SAMPLE_PRODUCTS: SampleProduct[] = [
  {
    id: 'sample-1',
    name: 'Classic Masala Instant Noodles 70g',
    brand: 'Nestle Maggi',
    category: 'Food',
    categoryIcon: '🍜',
    score: 94,
    status: 'compliant',
    statusLabel: 'Fully Compliant',
    tagline: 'FSSAI (Packaging & Labelling) 2020 & Legal Metrology 2011 Verified',
    checks: [
      { title: 'FSSAI 14-Digit License Number', authority: 'FSSAI', passed: true, detail: 'Valid Lic: 10012011000168 detected with official logo' },
      { title: 'Standard Green Veg Logo', authority: 'FSSAI Reg. 2.2.2', passed: true, detail: 'Green filled circle in green square detected on front panel' },
      { title: 'Standard Metric Net Quantity', authority: 'Legal Metrology Sec 18', passed: true, detail: 'Declared as 70 g in compliant font size (>3mm)' },
      { title: 'Nutritional Facts & Energy Breakdown', authority: 'FSSAI 2020', passed: true, detail: 'Per 100g and per serving values present' },
    ],
    extracted: {
      mrp: '₹14.00 (Incl. of all taxes)',
      netQty: '70 g',
      fssaiOrLic: '10012011000168',
      mfgDate: '12/2025',
      vegNonVeg: '100% Vegetarian (Green Symbol)'
    }
  },
  {
    id: 'sample-2',
    name: 'Herbal Sunscreen SPF 50+ Lotion',
    brand: 'Aura Glow Cosmetics',
    category: 'Cosmetics',
    categoryIcon: '🧴',
    score: 72,
    status: 'warning',
    statusLabel: 'Potential Issue Detected',
    tagline: 'CDSCO Cosmetics Rules 2020 & Legal Metrology Audit',
    checks: [
      { title: 'Manufacturing License Number', authority: 'CDSCO Rule 34', passed: false, detail: 'Missing or illegible state cosmetics Mfg. Lic. No.' },
      { title: 'Use Before / Best Before Date', authority: 'Legal Metrology 2011', passed: true, detail: 'Declared: 24 Months from Mfd (Exp: 08/2027)' },
      { title: 'Complete Ingredient Declaration', authority: 'CDSCO Rule 35', passed: true, detail: 'Descending order of concentration listed' },
      { title: 'Batch Number / Lot Identification', authority: 'Legal Metrology Rule 6', passed: true, detail: 'Batch: AG-2026-08' },
    ],
    extracted: {
      mrp: '₹349.00 (Incl. of all taxes)',
      netQty: '100 ml',
      fssaiOrLic: 'NOT DETECTED ⚠',
      mfgDate: '08/2025',
      vegNonVeg: 'Not Applicable'
    }
  },
  {
    id: 'sample-3',
    name: 'Kachi Ghani Mustard Oil 1 Litre',
    brand: 'Puro Pure Foods',
    category: 'Edible Oil',
    categoryIcon: '🫒',
    score: 100,
    status: 'compliant',
    statusLabel: '100% Deterministic Pass',
    tagline: 'Dual Mass & Volume Unit Mandate (Legal Metrology Notification 2022)',
    checks: [
      { title: 'Dual Net Quantity Declaration', authority: 'Legal Metrology (Amendment) 2022', passed: true, detail: 'Declared in Volume (1 L) and Equivalent Weight (910 g)' },
      { title: 'Fortified +F Logo (Vitamin A & D)', authority: 'FSSAI Fortification Reg.', passed: true, detail: '+F Blue Logo detected in right corner' },
      { title: 'Free from Argemone Oil Statement', authority: 'FSSAI Standards', passed: true, detail: 'Statutory declaration present in bold lettering' },
      { title: 'Maximum Retail Price with Unit Sale Price', authority: 'Legal Metrology Rule 6(1)', passed: true, detail: 'MRP ₹175.00 (Unit Sale Price ₹0.175/ml)' },
    ],
    extracted: {
      mrp: '₹175.00 (₹0.175 / ml)',
      netQty: '1 L (910 g equivalent mass)',
      fssaiOrLic: '10819003000452',
      mfgDate: '01/2026',
      vegNonVeg: '100% Vegetarian'
    }
  }
];

export const LiveCompliancePreviewSection: React.FC = () => {
  const [activeSampleIndex, setActiveSampleIndex] = useState(0);
  const activeProduct = SAMPLE_PRODUCTS[activeSampleIndex];

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden border-t border-emerald-500/20">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Interactive Live Demo</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight mb-4">
            Experience the <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">AI Compliance Engine</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Click on any sample product below to see how our hybrid OCR & deterministic rules engine instantly audits packaging labels.
          </p>
        </div>

        {/* Product Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {SAMPLE_PRODUCTS.map((prod, idx) => (
            <button
              key={prod.id}
              onClick={() => setActiveSampleIndex(idx)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 border ${
                activeSampleIndex === idx
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-lg shadow-emerald-500/10 scale-105'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{prod.categoryIcon}</span>
              <span>{prod.brand}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                prod.score >= 90 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
              }`}>
                {prod.score}%
              </span>
            </button>
          ))}
        </div>

        {/* Live Interactive Inspection HUD Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProduct.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-950/80 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-500/10 relative"
          >
            {/* Corner Decorative Tech Markers */}
            <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-emerald-400" />
            <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-emerald-400" />
            <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-emerald-400" />
            <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-emerald-400" />

            {/* Left Column: Product Score Card & Detected Details */}
            <div className="lg:col-span-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 pb-6 lg:pb-0 lg:pr-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4" /> AI Label Extraction
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    activeProduct.status === 'compliant'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {activeProduct.statusLabel}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-1">{activeProduct.name}</h3>
                <p className="text-xs text-slate-400 mb-6">{activeProduct.tagline}</p>

                {/* Extracted Key Parameters */}
                <div className="space-y-2.5 bg-slate-900/90 rounded-2xl p-4 border border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    OCR Parsed Declarations
                  </div>
                  <div className="flex justify-between items-center text-xs py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Max Retail Price (MRP):</span>
                    <span className="font-semibold text-white">{activeProduct.extracted.mrp}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Net Quantity:</span>
                    <span className="font-semibold text-emerald-400">{activeProduct.extracted.netQty}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Reg / License:</span>
                    <span className={`font-semibold ${activeProduct.extracted.fssaiOrLic.includes('NOT') ? 'text-amber-400' : 'text-white'}`}>
                      {activeProduct.extracted.fssaiOrLic}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs py-1">
                    <span className="text-slate-400">Classification:</span>
                    <span className="font-semibold text-white">{activeProduct.extracted.vegNonVeg}</span>
                  </div>
                </div>
              </div>

              {/* Overall Score Meter */}
              <div className="mt-6 flex items-center justify-between bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4">
                <div>
                  <div className="text-xs font-semibold text-emerald-300">Deterministic Compliance Score</div>
                  <div className="text-2xl font-extrabold text-emerald-400">{activeProduct.score}/100</div>
                </div>
                <Link to="/scan">
                  <Button size="sm" className="shadow-md shadow-emerald-500/20">
                    Scan Own Product <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: Rule-by-Rule Regulatory Audit Breakdown */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-emerald-400" />
                    Statutory Rule Verification Matrix
                  </h4>
                  <span className="text-xs text-slate-500">4 Legal Standards Audited</span>
                </div>

                <div className="space-y-3">
                  {activeProduct.checks.map((chk, i) => (
                    <div
                      key={i}
                      className={`p-3.5 rounded-xl border transition-all ${
                        chk.passed
                          ? 'bg-emerald-950/20 border-emerald-500/20 hover:border-emerald-500/40'
                          : 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          {chk.passed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <div className="text-sm font-semibold text-white">{chk.title}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{chk.detail}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 shrink-0 border border-slate-700">
                          {chk.authority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Deterministic Rule Evaluation (Zero Hallucination)
                </span>
                <Link to="/rules" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline">
                  View full rule library <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
