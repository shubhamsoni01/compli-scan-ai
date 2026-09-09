import React, { lazy, Suspense, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Scan, FileText, CheckCircle, ShieldCheck, Cpu, 
  History, LayoutGrid, Clock, Apple, Droplet, Sparkles, 
  Home, HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils/cn';
import { fetchRealStats } from '@/services/api';

const ProductScanner = lazy(() => import('@/components/3d/ProductScanner'));
import { HackathonShowcaseSection } from '@/components/sections/HackathonShowcaseSection';
import { LiveCompliancePreviewSection } from '@/components/sections/LiveCompliancePreviewSection';
import { FakeVsRealComparisonSection } from '@/components/sections/FakeVsRealComparisonSection';
import { NationalMetricsBar } from '@/components/sections/NationalMetricsBar';
import { AppleBentoShowcase } from '@/components/sections/AppleBentoShowcase';
import { TiltCard } from '@/components/ui/TiltCard';
import { SIHVectorAura } from '@/components/3d/SIHVectorAura';
import { KidScanningStoryAnimation } from '@/components/hero/KidScanningStoryAnimation';
import { CyberGridBackground } from '@/components/ui/CyberGridBackground';
import { MinistryLogo } from '@/components/ui/MinistryLogo';
import { SIHLogo } from '@/components/ui/SIHLogo';

// Framer motion variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export default function LandingPage() {
  const [stats, setStats] = useState({
    totalScans: 0,
    totalVisits: 0,
  });

  useEffect(() => {
    fetchRealStats().then(data => {
      setStats({
        totalScans: data.totalScans || 0,
        totalVisits: data.totalVisits || 0,
      });
    });
  }, []);

  return (
    <div className="w-full bg-slate-50 dark:bg-[#0a0e1a] text-slate-900 dark:text-slate-100 font-sans">
      {/* Hero Section */}
      <section 
        className="relative overflow-hidden flex items-center pt-6 pb-16 md:pt-10 md:pb-20"
      >
        <CyberGridBackground />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5 dark:from-[#070b12] dark:via-[#0b1320] dark:to-[#070b12] -z-10 pointer-events-none" />
        {/* Subtle glowing ambient lighting orbs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-500/15 dark:bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-28 right-10 w-[420px] h-[420px] bg-cyan-500/15 dark:bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-6 max-w-2xl relative"
            >
              {/* Pure Vector SIH Innovation Aura in Background */}
              <SIHVectorAura />

              <motion.div variants={itemVariants} className="mb-6 inline-flex flex-wrap items-center gap-2 rounded-full px-4 py-1.5 text-xs md:text-sm font-semibold text-emerald-800 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/70 ring-1 ring-inset ring-emerald-500/30 shadow-sm backdrop-blur-md">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>🇮🇳 SIH 2026 • Problem ID: SIH26034</span>
                <span className="hidden sm:inline text-slate-400">•</span>
                <span className="hidden sm:inline text-amber-400">Ministry of Consumer Affairs</span>
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 font-heading leading-tight">
                Scan. Verify.{' '}
                <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-300 bg-clip-text text-transparent">
                  Comply.
                </span>
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                Instantly analyze packaged product labels against Indian regulatory frameworks (FSSAI, Legal Metrology, CDSCO). Ensure 100% label compliance before hitting retail shelves.
              </motion.p>
              
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/scan">
                  <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30">
                    Scan a Product
                    <Scan className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/rules">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-300 dark:border-white/15 hover:border-emerald-500/50">
                    Explore Compliance Rules
                  </Button>
                </Link>
              </motion.div>

              {/* Trust & capability micro-pills */}
              <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-white/10">
                <span className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-md border border-slate-200/60 dark:border-white/5">
                  <span className="text-emerald-500 font-bold">✓</span> 22+ Mandatory Rules
                </span>
                <span className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-md border border-slate-200/60 dark:border-white/5">
                  <span className="text-teal-500 font-bold">✓</span> Dual-Engine OCR (Gemini + Tesseract)
                </span>
                <span className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-md border border-slate-200/60 dark:border-white/5">
                  <span className="text-cyan-500 font-bold">✓</span> Instant PDF Export
                </span>
              </motion.div>
            </motion.div>

            {/* Right side: Kid Scanning Product + Instant Result Story Animation */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
              className="lg:col-span-6 relative w-full flex items-center justify-center py-4 lg:py-0"
            >
              <KidScanningStoryAnimation />
            </motion.div>
          </div>
        </div>
      </section>

      {/* National Compliance Impact Metrics Bar */}
      <NationalMetricsBar />

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-[#070b12] border-t border-slate-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-3">
              Automated Pipeline
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-4 text-slate-900 dark:text-white">How It Works</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Get compliance results in seconds with our streamlined 4-step process.</p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative"
          >
            <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-cyan-500/30 z-0" />
            
            {[
              { icon: FileText, title: "Upload Image", desc: "Upload a clear image of your product label." },
              { icon: Scan, title: "OCR Extraction", desc: "We extract all text and symbols automatically." },
              { icon: Cpu, title: "AI Analysis", desc: "Our engine checks against compliance rules." },
              { icon: CheckCircle, title: "Compliance Report", desc: "Get a detailed, exportable compliance score." }
            ].map((step, i) => (
              <motion.div key={i} variants={itemVariants} className="relative z-10">
                <TiltCard tiltFactor={6} className="h-full">
                  <Card className="h-full text-center p-6 bg-white dark:bg-slate-900/60 transition-all duration-300 border-slate-200/80 dark:border-white/10 hover:border-emerald-500/40 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5">
                    <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mb-6 shadow-sm border border-emerald-100 dark:border-emerald-800/60 group-hover:scale-110 transition-transform">
                      <step.icon className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 mb-4 border border-emerald-500/20">
                      Step {i + 1}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{step.desc}</p>
                  </Card>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Live Interactive Compliance Audit Simulator */}
      <LiveCompliancePreviewSection />

      {/* Interactive Fake vs Genuine Label X-Ray Split-Inspection Lens */}
      <FakeVsRealComparisonSection />

      {/* Apple-Inspired Bento Architecture Showcase */}
      <AppleBentoShowcase />

      {/* Supported Categories */}
      <section className="py-20 bg-slate-50 dark:bg-[#04080e] border-t border-slate-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-4 text-slate-900 dark:text-white">Supported Categories</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">We support a wide range of product categories for compliance verification.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { icon: Apple, label: "Food" },
              { icon: Droplet, label: "Edible Oil" },
              { icon: Sparkles, label: "Cosmetics" },
              { icon: Home, label: "Household" },
              { icon: HelpCircle, label: "Other" }
            ].map((cat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-slate-900/60 p-6 rounded-2xl shadow-sm hover:shadow-xl border border-slate-200/80 dark:border-white/10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <cat.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="font-medium text-slate-900 dark:text-slate-100">{cat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-white dark:bg-[#070b12] border-t border-slate-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-4 text-slate-900 dark:text-white">Key Features</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Everything you need to ensure product compliance in one powerful platform.</p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              { icon: Scan, title: "AI-Powered OCR", desc: "Advanced text and symbol extraction from label images." },
              { icon: ShieldCheck, title: "Smart Rule Engine", desc: "Automated compliance checks against latest FSSAI & standard rules." },
              { icon: FileText, title: "Detailed Reports", desc: "Downloadable PDF reports highlighting compliant and non-compliant areas." },
              { icon: History, title: "Scan History", desc: "Securely track and review all your previous compliance scans." },
              { icon: LayoutGrid, title: "Multi-Category Support", desc: "Analyzes food, cosmetics, household items and more." },
              { icon: Clock, title: "Real-time Analysis", desc: "Get comprehensive results within seconds, not days." }
            ].map((feature, i) => (
              <motion.div key={i} variants={itemVariants}>
                <TiltCard tiltFactor={7} className="h-full">
                  <Card className="h-full p-6 bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-emerald-100 dark:border-emerald-800/40">
                      <feature.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                  </Card>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why CompliScan AI */}
      <section className="py-20 bg-gradient-to-br from-emerald-950 via-slate-950 to-teal-950 text-white border-t border-emerald-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-12">Trusted by Compliance Teams</h2>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              { val: stats.totalScans, label: "Scans Processed" },
              { val: "37", label: "Official Rules Configured" },
              { val: "4", label: "Active Categories" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.03 }}
                transition={{ duration: 0.25 }}
                className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-emerald-500/20 hover:border-emerald-400/40 shadow-xl shadow-emerald-950/40 transition-all cursor-default group"
              >
                <div className="text-4xl font-extrabold mb-2 tracking-tight text-transparent bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text group-hover:scale-105 transition-transform">{stat.val}</div>
                <div className="text-emerald-200/80 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Smart India Hackathon & UCET Hazaribagh Showcase Section */}
      <HackathonShowcaseSection />

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-300 py-14 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-slate-800/80 pb-8">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-2 text-white font-bold text-xl mb-1 font-heading">
                <Scan className="h-6 w-6 text-emerald-400" />
                <span>CompliScan <span className="text-emerald-400">AI</span></span>
              </div>
              <p className="text-xs text-slate-400">AI-Powered Statutory Product Labelling Compliance Platform</p>
            </div>
            
            <div className="flex items-center gap-3">
              <MinistryLogo size="sm" showText={true} />
              <SIHLogo size="sm" showText={false} />
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link to="/#features" className="hover:text-emerald-400 transition-colors">Features</Link>
              <Link to="/rules" className="hover:text-emerald-400 transition-colors">Rules & Gazette</Link>
              <Link to="/development" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">SIH 2026 Dev</Link>
              <Link to="/history" className="hover:text-emerald-400 transition-colors">Scan History</Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p className="text-center sm:text-left">
              Engineered for <span className="text-slate-300 font-semibold">Smart India Hackathon 2026</span> • Problem Statement: <span className="font-mono text-amber-400 font-bold">SIH26034</span> under the aegis of <span className="text-slate-300 font-medium">Ministry of Consumer Affairs, Food & Public Distribution</span> by UCET Hazaribagh.
            </p>
            <p className="whitespace-nowrap">&copy; 2026 CompliScan AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
