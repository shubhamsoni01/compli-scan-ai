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
import { TiltCard } from '@/components/ui/TiltCard';

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
        className="relative overflow-hidden flex items-center pt-4 pb-12 md:pt-6 md:pb-16"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/70 to-white dark:from-[#0a0e1a] dark:to-[#111827] -z-10 pointer-events-none" />
        {/* Subtle glowing ambient lighting orbs */}
        <div className="absolute top-10 left-1/3 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-32 right-10 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-600/10 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-6 max-w-2xl"
            >
              <motion.div variants={itemVariants} className="mb-6 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/30 ring-1 ring-inset ring-indigo-500/20">
                AI-Powered Product Compliance
              </motion.div>
              <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 font-heading">
                Scan. Verify. Comply.
              </motion.h1>
              <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8">
                Instantly analyze packaged product labels against applicable Indian compliance requirements. Ensure your products meet regulatory standards before hitting the shelves.
              </motion.p>
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                <Link to="/scan">
                  <Button size="lg" className="w-full sm:w-auto">
                    Scan a Product
                    <Scan className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/rules">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Explore Compliance Rules
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
              className="lg:col-span-6 relative w-full flex items-center justify-center py-2 lg:py-0 lg:-translate-y-12"
            >
              <div className="relative w-full max-w-[480px] lg:max-w-[460px] xl:max-w-[500px] h-[340px] sm:h-[400px] md:h-[440px] lg:h-[450px] xl:h-[480px] rounded-2xl md:rounded-3xl overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 -z-10 rounded-2xl md:rounded-3xl bg-gradient-to-tr from-indigo-500/10 via-violet-500/5 to-cyan-500/10 dark:from-indigo-950/40 dark:via-slate-900/40 dark:to-cyan-950/30 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xl shadow-indigo-500/5" />
                <Suspense fallback={<div className="flex items-center justify-center h-full text-indigo-500"><Scan className="h-10 w-10 animate-spin" /></div>}>
                  <ProductScanner size="md" />
                </Suspense>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-[#111827]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-heading mb-4">How It Works</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Get compliance results in seconds with our streamlined 4-step process.</p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative"
          >
            <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-indigo-100 dark:bg-indigo-900/50 z-0" />
            
            {[
              { icon: FileText, title: "Upload Image", desc: "Upload a clear image of your product label." },
              { icon: Scan, title: "OCR Extraction", desc: "We extract all text and symbols automatically." },
              { icon: Cpu, title: "AI Analysis", desc: "Our engine checks against compliance rules." },
              { icon: CheckCircle, title: "Compliance Report", desc: "Get a detailed, exportable compliance score." }
            ].map((step, i) => (
              <motion.div key={i} variants={itemVariants} className="relative z-10">
                <TiltCard tiltFactor={6} className="h-full">
                  <Card className="h-full text-center p-6 bg-white dark:bg-slate-800 transition-all duration-300 border-slate-100 dark:border-slate-700">
                    <div className="mx-auto w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-6 shadow-sm border border-indigo-100 dark:border-indigo-800 group-hover:scale-110 transition-transform">
                      <step.icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 mb-4">
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

      {/* Supported Categories */}
      <section className="py-20 bg-slate-50 dark:bg-[#0a0e1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-heading mb-4">Supported Categories</h2>
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
                className="bg-white dark:bg-[#111827] p-6 rounded-2xl shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <cat.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="font-medium">{cat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-white dark:bg-[#111827]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-heading mb-4">Key Features</h2>
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
                  <Card className="h-full p-6 bg-slate-50 dark:bg-slate-800/50 border border-transparent dark:border-slate-800/60 shadow-sm hover:shadow-xl transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <feature.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
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
      <section className="py-20 bg-indigo-600 dark:bg-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold font-heading mb-12">Trusted by Compliance Teams</h2>
          
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
                className="p-6 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/15 hover:border-white/30 shadow-lg transition-all cursor-default group"
              >
                <div className="text-4xl font-bold mb-2 tracking-tight group-hover:scale-105 transition-transform">{stat.val}</div>
                <div className="text-indigo-100 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Smart India Hackathon & UCET Hazaribagh Showcase Section */}
      <HackathonShowcaseSection />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-2 text-white font-bold text-xl mb-2 font-heading">
              <Scan className="h-6 w-6 text-indigo-400" />
              <span>CompliScan AI</span>
            </div>
            <p className="text-sm text-slate-400">Scan. Verify. Comply.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/features" className="hover:text-white transition-colors">Features</Link>
            <Link to="/rules" className="hover:text-white transition-colors">Rules</Link>
            <Link to="/development" className="text-indigo-400 hover:text-white transition-colors font-medium">Development</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
          
          <div className="flex flex-col items-center md:items-end text-sm text-slate-400">
            <p className="mb-1">Built for Smart India Hackathon 2026</p>
            <p>&copy; 2026 CompliScan AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
