import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Scan, ShieldCheck, FileText, Cpu, LayoutGrid, Clock, 
  Globe, WifiOff, Play, Layers, Sparkles, CheckCircle2, ArrowRight
} from 'lucide-react';
import { TiltCard } from '@/components/ui/TiltCard';
import { Card } from '@/components/ui/Card';
import { FeatureDemoModal, type FeatureDemoData } from '@/components/media/FeatureDemoModal';

const FEATURES_DATA: FeatureDemoData[] = [
  {
    id: 'vision-ocr',
    title: 'AI-Powered Vision OCR',
    category: 'Computer Vision',
    tag: 'Sub-Second OCR',
    shortDesc: 'Extracts 20+ mandatory declarations, barcode numbers, and nutritional values with pixel-perfect coordinate tracking.',
    detailedDesc: 'CompliScan AI leverages a dual-engine architecture combining OpenCV image preprocessing, Tesseract OCR, and Groq Llama-3 Vision. It extracts raw text, bounding box coordinates, and entity layout while correcting for camera tilt, glare, and curved cylindrical packaging surfaces.',
    videoSrc: '/sih.mp4',
    statutoryRule: 'Rule 6 & Rule 7 of Legal Metrology (Packaged Commodities) Rules, 2011',
    keyHighlights: [
      'Sub-1.2 second end-to-end token extraction latency',
      'Layout-aware bounding box detection for all 8 mandatory fields',
      'Automatic perspective correction for crumpled foils and bottles',
      'Extracts MRP, Net Qty, Batch No, FoSCoS Lic, Dates & Consumer Care'
    ],
    simulationMockup: {
      type: 'ocr',
      badge: 'Vision Extraction',
      fields: [
        { label: 'MRP (Incl. Taxes)', value: '₹185.00', status: 'PASS' },
        { label: 'Unit Sale Price (USP)', value: 'MISSING (Violates Rule 6.11)', status: 'FAIL' },
        { label: 'Net Quantity', value: '1 L (Equiv weight missing)', status: 'FAIL' },
        { label: 'FSSAI License No.', value: '10020043000123 (Valid 14-digit)', status: 'PASS' }
      ]
    }
  },
  {
    id: 'deterministic-law',
    title: '100% Deterministic Law Engine',
    category: 'Legal Metrology & FSSAI',
    tag: 'Zero Hallucination',
    shortDesc: 'Hardcoded statutory algorithms evaluate extracted entities against Gazette rules. Zero AI hallucinations in legal judgment.',
    detailedDesc: 'AI is strictly utilized as a visual parser. All compliance determinations, font-size vs PDP area mathematical checks, date freshness calculations, and penalty formulas are executed deterministically by code to produce court-defensible statutory reports.',
    statutoryRule: 'Legal Metrology Act, 2009 & FSSAI (Labelling & Display) Regulations, 2020',
    keyHighlights: [
      'Strict separation of AI visual parser and deterministic legal rules',
      'Rule 7 mathematical font height vs package area verification',
      '14-digit FoSCoS license checksum and checksum algorithm audit',
      'Court-admissible audit log with cryptographic evidence hash'
    ],
    simulationMockup: {
      type: 'rule',
      badge: 'Statutory Engine',
      fields: [
        { label: 'Rule 6(1)(a) Common Name', value: 'Mustard Oil (Compliant)', status: 'PASS' },
        { label: 'Rule 6(11) USP Declaration', value: 'NON-COMPLIANT (₹/ml missing)', status: 'FAIL' },
        { label: 'Rule 7 Font Height Ratio', value: '1.4mm (Required >= 2.0mm)', status: 'FAIL' },
        { label: 'FSSAI Veg/Non-Veg Logo', value: 'Green Square + Dot (Pass)', status: 'PASS' }
      ]
    }
  },
  {
    id: 'section-39-notice',
    title: 'Section 39 Notice Generator',
    category: 'Enforcement Workflow',
    tag: '1-Click Legal PDF',
    shortDesc: 'Auto-drafts official Section 39 Show Cause Notices with statutory citations, compounding fee math, and evidence dossiers.',
    detailedDesc: 'When non-compliance is identified, CompliScan AI instantly constructs an official Gazette-formatted legal show cause notice citing contravened rules, compounding calculations under Section 48, and digital signature integration for enforcement controllers.',
    statutoryRule: 'Section 39 & Section 48 of the Legal Metrology Act, 2009',
    keyHighlights: [
      '1-Click court-ready PDF generation with verified timestamp & QR code',
      'Auto-calculation of statutory compounding fees under Section 48',
      'Aadhaar e-Sign and DSC token authorization integration',
      'Direct speed-post / registered email payload dispatch webhook'
    ],
    simulationMockup: {
      type: 'notice',
      badge: 'Section 39 Notice',
      fields: [
        { label: 'Notice Reference', value: 'LM/DL/2026/VIO-8921', status: 'PASS' },
        { label: 'Statutory Penalty', value: 'Up to ₹25,000 (1st Offence)', status: 'REVIEW' },
        { label: 'Response Period', value: '15 Days Statutory Notice', status: 'PASS' },
        { label: 'Evidence Dossier', value: 'Photographic Proof Attached', status: 'PASS' }
      ]
    }
  },
  {
    id: 'multi-angle-stitching',
    title: 'Multi-Panel Label Stitching',
    category: 'Packaging Inspection',
    tag: '360° Coverage',
    shortDesc: 'Uploads and analyzes front, back, side panels, and QR codes together to perform unified package cross-referencing.',
    detailedDesc: 'Packaged commodities distribute mandatory declarations across various sides (e.g., brand on front, MRP and batch on bottom, nutritional facts on back). CompliScan AI stitches multiple angles into a single unified packaging session.',
    statutoryRule: 'Rule 6(1) Principal Display Panel (PDP) Declarations',
    keyHighlights: [
      'Multi-image upload stream with smart duplicate declaration resolver',
      'Principal Display Panel (PDP) area auto-calculation',
      'Front-to-back cross validation of net quantity and nutritional claims',
      'GS1 DataBar and Barcode cross-reference check'
    ],
    simulationMockup: {
      type: 'portal',
      badge: 'Multi-Panel Ingest',
      fields: [
        { label: 'Front Panel PDP', value: '100% Extracted & Sized', status: 'PASS' },
        { label: 'Back Nutrition Panel', value: 'Table Parsed (12 Nutrients)', status: 'PASS' },
        { label: 'MRP & Batch Stamp', value: 'Ocr Confidence 98.6%', status: 'PASS' },
        { label: 'GS1 Barcode 13-Digit', value: '8901234567890 (Matched)', status: 'PASS' }
      ]
    }
  },
  {
    id: 'multi-agency-portal',
    title: 'Multi-Agency Enforcement Hub',
    category: 'Government Intelligence',
    tag: 'Inter-Agency Sync',
    shortDesc: 'Unifies Legal Metrology Controllers, FSSAI Food Safety Officers, and National Consumer Helpline on one dashboard.',
    detailedDesc: 'Provides central and state regulatory agencies with role-based access control, digital compounding registries, evidence repository, and real-time raid coordination workflows.',
    statutoryRule: 'Department of Consumer Affairs & Central Consumer Protection Authority (CCPA)',
    keyHighlights: [
      'Role-Based Access: Super Admin, State Controller, Food Safety Inspector',
      'Cross-jurisdictional e-commerce inspection synchronization',
      'National Consumer Helpline (NCH) grievance linkage',
      'Digital fine collection registry and recurring offender tracking'
    ],
    simulationMockup: {
      type: 'portal',
      badge: 'Enforcement Hub',
      fields: [
        { label: 'Active State Cells', value: '28 States & 8 UTs Synced', status: 'PASS' },
        { label: 'Raid Coordination', value: 'Joint Metrology + FSSAI', status: 'PASS' },
        { label: 'Repeat Offender Flag', value: '3 Previous Violations Logged', status: 'REVIEW' },
        { label: 'NCH Redressal Sync', value: 'Auto-Cross Referenced', status: 'PASS' }
      ]
    }
  },
  {
    id: 'realtime-analytics',
    title: 'Real-Time Analytics & Heatmaps',
    category: 'Big Data & Insights',
    tag: 'National Telemetry',
    shortDesc: 'Live dashboards tracking regional non-compliance rates, recurring manufacturer issues, and market trends.',
    detailedDesc: 'Enforcement controllers can visualize real-time compliance trends across product categories (Food, Edible Oil, Cosmetics, Household), identify rogue brands, and allocate inspection officers to high-risk retail hotspots.',
    statutoryRule: 'National Metrology Intelligence System',
    keyHighlights: [
      'Real-time MongoDB Atlas aggregation telemetry',
      'Category-wise failure distribution (Edible oil weight, cosmetics expiry)',
      'Regional non-compliance heatmaps for targeted market audits',
      'Exportable monthly statutory audit dossiers for Ministry reviews'
    ],
    simulationMockup: {
      type: 'portal',
      badge: 'Analytics Telemetry',
      fields: [
        { label: 'Total Scans Logged', value: '1,248+ Today', status: 'PASS' },
        { label: 'National Pass Rate', value: '82.4% Compliant', status: 'PASS' },
        { label: 'Top Violation', value: 'Rule 6(11) USP Missing (42%)', status: 'FAIL' },
        { label: 'Avg Audit Speed', value: '1.18 seconds / scan', status: 'PASS' }
      ]
    }
  },
  {
    id: 'multilingual-ocr',
    title: '22 Indian Regional Languages',
    category: 'Multilingual AI',
    tag: 'Bharat OCR Engine',
    shortDesc: 'Parses label text across Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, and other regional scripts.',
    detailedDesc: 'Indian packaging frequently carries bilingual or trilingual disclosures. CompliScan AI handles Indic text normalization and multilingual dictionary matching for non-English packaged commodities.',
    statutoryRule: 'Schedule VIII Official Languages & Rule 6(3) Language Declarations',
    keyHighlights: [
      'Supports Devanagari (Hindi, Marathi), Tamil, Telugu, Bengali, Gujarati',
      'Bilingual MRP and manufacturer address token alignment',
      'Regional allergen and ingredient vocabulary parsing',
      'Universal UTF-8 statutory report generation'
    ],
    simulationMockup: {
      type: 'multilingual',
      badge: 'Indic OCR',
      fields: [
        { label: 'Hindi (देवनागरी)', value: 'शुद्ध सरसों का तेल (Extracted)', status: 'PASS' },
        { label: 'Tamil (தமிழ்)', value: 'சுத்தமான கடுகு எண்ணெய்', status: 'PASS' },
        { label: 'Bengali (বাংলা)', value: 'খাঁটি সরিষার তেল', status: 'PASS' },
        { label: 'Indic Match Rate', value: '98.2% Accurate', status: 'PASS' }
      ]
    }
  },
  {
    id: 'offline-edge-ai',
    title: 'Offline Edge AI Mobile Inspector',
    category: 'Field Inspection',
    tag: 'No Internet Required',
    shortDesc: 'Enables field enforcement officers to inspect packages in remote rural mandis with zero internet connectivity.',
    detailedDesc: 'Packaged commodities in remote rural markets and small kirana stores can be audited directly on-device using quantized Tesseract and local deterministic rule evaluation without cloud dependencies.',
    statutoryRule: 'Rural Market Enforcement Taskforce Protocol',
    keyHighlights: [
      'Quantized on-device OCR pipeline for Android and low-power devices',
      'Local SQLite/IndexedDB rule cache of all 37+ Gazette rules',
      'Auto-syncs inspection logs to Ministry cloud whenever network resumes',
      'Tamper-proof encrypted local inspection audit trail'
    ],
    simulationMockup: {
      type: 'offline',
      badge: 'Offline Mode',
      fields: [
        { label: 'Connectivity Status', value: '100% Offline Active', status: 'PASS' },
        { label: 'Local Rule Cache', value: '37 Gazette Rules Embedded', status: 'PASS' },
        { label: 'On-Device Latency', value: '850ms on mobile CPU', status: 'PASS' },
        { label: 'Pending Sync Queue', value: '12 Scans Cached to DB', status: 'REVIEW' }
      ]
    }
  }
];

export const InteractiveFeaturesShowcase: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<FeatureDemoData | null>(null);

  return (
    <section className="py-24 bg-white dark:bg-[#070b12] border-t border-slate-100 dark:border-white/5 relative overflow-hidden">
      {/* Decorative background grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-500/30 shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span>INTERACTIVE FEATURE CATALOG • CLICK ANY CARD FOR LIVE DEMO</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight leading-tight">
            Complete Regulatory Inspection Capabilities
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Click on any feature below to watch its <strong>Demo Video / Interactive Simulation</strong>, inspect statutory rule citations, and test it live.
          </p>
        </div>

        {/* 8 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES_DATA.map((feat, idx) => (
            <motion.div
              key={feat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              className="h-full"
            >
              <TiltCard tiltFactor={6} className="h-full">
                <Card 
                  onClick={() => setSelectedFeature(feat)}
                  className="h-full p-6 bg-slate-50/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-2xl hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
                >
                  {/* Top accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                        {idx === 0 && <Scan size={24} />}
                        {idx === 1 && <ShieldCheck size={24} />}
                        {idx === 2 && <FileText size={24} />}
                        {idx === 3 && <Layers size={24} />}
                        {idx === 4 && <Cpu size={24} />}
                        {idx === 5 && <LayoutGrid size={24} />}
                        {idx === 6 && <Globe size={24} />}
                        {idx === 7 && <WifiOff size={24} />}
                      </div>

                      <span className="text-[10px] font-mono font-bold bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-full border border-slate-300 dark:border-white/10">
                        {feat.tag}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {feat.category}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {feat.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium line-clamp-3">
                      {feat.shortDesc}
                    </p>
                  </div>

                  {/* Click to Watch Demo Button */}
                  <div className="pt-4 mt-4 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                    <span className="flex items-center gap-1.5">
                      <Play size={13} className="fill-current" />
                      <span>Watch Demo / Simulation</span>
                    </span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </TiltCard>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Feature Demo Modal Triggered on Click */}
      <FeatureDemoModal
        feature={selectedFeature}
        onClose={() => setSelectedFeature(null)}
      />
    </section>
  );
};
