import React from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Award, 
  Building2, 
  Cpu, 
  Scan, 
  FileText, 
  ShieldCheck, 
  Camera, 
  FileJson, 
  CheckCircle2, 
  ArrowRight, 
  User, 
  Sparkles, 
  Terminal, 
  BadgeCheck 
} from 'lucide-react';
import { TiltCard } from '@/components/ui/TiltCard';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TEAM_MEMBERS, PIPELINE_STEPS, type TeamMember } from '@/data/teamData';
import { HACKATHON_PROJECT_CONFIG } from '@/components/sections/HackathonShowcaseSection';

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

export default function DevelopmentPage() {
  const config = HACKATHON_PROJECT_CONFIG;

  const renderPipelineIcon = (iconName: string) => {
    const props = { className: "w-5 h-5 text-indigo-600 dark:text-cyan-400" };
    switch (iconName) {
      case 'Camera': return <Camera {...props} />;
      case 'Scan': return <Scan {...props} />;
      case 'Cpu': return <Cpu {...props} />;
      case 'FileJson': return <FileJson {...props} />;
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      case 'CheckCircle2': return <CheckCircle2 {...props} />;
      case 'FileText': return <FileText {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-[#0a0e1a] text-slate-900 dark:text-slate-100 font-sans min-h-screen">
      
      {/* ===================================================
          1. FULL-WIDTH UCET HAZARIBAGH HERO / BANNER BACKGROUND
         =================================================== */}
      <section className="relative w-full overflow-hidden border-b border-indigo-950/60 pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-36 lg:pb-28 min-h-[480px] sm:min-h-[540px] lg:min-h-[580px] flex items-center justify-center bg-slate-950">
        {/* Full-Width UCET Hazaribagh College Image as Direct Banner Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          <img
            src="/assets/ucet-hero-banner.jpg"
            alt="University College of Engineering and Technology (UCET), Hazaribagh"
            className="w-full h-full object-cover object-[center_35%] filter brightness-90 contrast-105"
          />
          {/* Transparent Dark Navy/Indigo Overlay allowing the college building to show through vividly */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/65 via-slate-950/45 to-slate-950/85" />
          <div className="absolute inset-0 bg-indigo-950/25 mix-blend-multiply" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4 sm:space-y-6"
          >
            {/* 1. SMART INDIA HACKATHON 2026 */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-indigo-500/40 text-cyan-300 text-xs sm:text-sm font-semibold tracking-wider uppercase shadow-lg shadow-indigo-950/50">
                <Award className="w-4 h-4 text-cyan-400" />
                <span>Smart India Hackathon 2026</span>
              </div>
            </motion.div>

            {/* 2. COMPLISCAN AI */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-heading tracking-tight text-white drop-shadow-md"
            >
              COMPLISCAN AI
            </motion.h1>

            {/* 3. DEVELOPMENT TEAM */}
            <motion.div 
              variants={itemVariants}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-widest text-transparent bg-gradient-to-r from-indigo-300 via-sky-300 to-cyan-200 bg-clip-text font-heading"
            >
              DEVELOPMENT TEAM
            </motion.div>

            {/* Built at UCET Hazaribagh Attribution */}
            <motion.p variants={itemVariants} className="text-sm sm:text-base text-slate-300 font-medium">
              Built at <span className="text-white font-semibold">{config.collegeName}</span> ({config.collegeShortName}), {config.collegeLocation}
            </motion.p>

            {/* 4. SIH26034 Problem Statement Badge */}
            <motion.div variants={itemVariants} className="pt-2">
              <span className="inline-block px-4 py-1.5 rounded-xl bg-indigo-950/80 backdrop-blur-md border border-indigo-400/30 text-indigo-200 text-xs sm:text-sm font-mono font-bold tracking-wide shadow-md">
                Problem Statement: <span className="text-cyan-300 font-extrabold">{config.problemStatementNumber}</span>
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* ===================================================
          2. TEAM MEMBERS SECTION (EXACTLY 6 SLOTS)
         =================================================== */}
      <section className="py-20 bg-white dark:bg-[#0c1222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-slate-900 dark:text-white">
              Meet the Development Team
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400">
              The team behind CompliScan AI
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {TEAM_MEMBERS.map((member: TeamMember) => {
              if (member.isPlaceholder) {
                // Placeholder Card (Members 2 to 6)
                return (
                  <motion.div key={member.id} variants={itemVariants}>
                    <TiltCard tiltFactor={5} className="h-full">
                      <Card className="h-full p-6 sm:p-7 flex flex-col justify-between border-dashed border-2 border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-sm rounded-3xl transition-all duration-300 group">
                        
                        <div>
                          {/* Placeholder Avatar */}
                          <div className="w-28 h-28 mx-auto mb-5 rounded-2xl bg-slate-200 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700/60 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 group-hover:scale-105 transition-transform duration-300 shadow-inner">
                            <User className="w-10 h-10 mb-1 opacity-60" />
                            <span className="text-[10px] font-medium tracking-wide uppercase">Slot {member.id}</span>
                          </div>

                          {/* Member Title */}
                          <div className="text-center">
                            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 font-heading">
                              {member.name}
                            </h3>
                            <div className="inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              Details to be updated
                            </div>
                          </div>

                          <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-800 space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
                            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
                              <span className="font-medium text-slate-400">Education:</span>
                              <span className="italic">To be updated</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
                              <span className="font-medium text-slate-400">Session:</span>
                              <span>2024–27</span>
                            </div>
                            <div className="flex justify-between py-1">
                              <span className="font-medium text-slate-400">Status:</span>
                              <span className="text-amber-600 dark:text-amber-400 font-medium">Photo to be added</span>
                            </div>
                          </div>
                        </div>

                        {/* Subtle placeholder footer badge */}
                        <div className="mt-6 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/40 text-[11px] text-center text-slate-400">
                          Profile information will be updated upon final team roster confirmation.
                        </div>

                      </Card>
                    </TiltCard>
                  </motion.div>
                );
              }

              // Member #1 — Shubham Kumar
              return (
                <motion.div key={member.id} variants={itemVariants}>
                  <TiltCard tiltFactor={8} className="h-full">
                    <Card className="h-full p-6 sm:p-7 flex flex-col justify-between border-slate-200 dark:border-indigo-950/80 bg-white dark:bg-[#10172c] backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-950/40 transition-all duration-300 group">
                      
                      <div>
                        {/* Member Photo with centered portrait & subtle border glow */}
                        <div className="relative w-36 h-36 mx-auto mb-5 rounded-2xl overflow-hidden shadow-lg border-2 border-indigo-500/40 group-hover:border-indigo-400 group-hover:scale-105 transition-all duration-500">
                          <img
                            src={member.photo || ''}
                            alt={member.name}
                            className="w-full h-full object-cover object-[center_top] transform transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {/* Name & Role */}
                        <div className="text-center">
                          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-cyan-400 mb-1">
                            <BadgeCheck className="w-4 h-4 text-indigo-500 dark:text-cyan-400" />
                            <span>Team Lead</span>
                          </div>
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
                            {member.name}
                          </h3>
                          <p className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                            {member.role}
                          </p>
                        </div>

                        {/* Education & Academic Metadata */}
                        <div className="mt-5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Education:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">{member.education}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Session:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{member.session}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Admission:</span>
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{member.admission}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Roll No.:</span>
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{member.rollNo}</span>
                          </div>
                        </div>

                        {/* Core Contributions */}
                        <div className="mt-5 space-y-2">
                          <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
                            <Terminal className="w-3.5 h-3.5 text-indigo-500 dark:text-cyan-400" />
                            <span>Core Engineering Contributions:</span>
                          </div>
                          <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                            {member.contributions.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-1.5 leading-snug">
                                <span className="text-indigo-500 dark:text-cyan-400 font-bold">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Card Footer Tag */}
                      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                        <span>UCET Hazaribagh</span>
                        <span className="text-indigo-600 dark:text-cyan-400 font-medium">Full-Stack & AI</span>
                      </div>

                    </Card>
                  </TiltCard>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </section>


      {/* ===================================================
          3. HOW WE BUILT COMPLISCAN AI PIPELINE
         =================================================== */}
      <section className="py-20 bg-slate-50 dark:bg-[#0a0e1a] border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 mb-3">
              <Cpu className="w-3.5 h-3.5" />
              <span>Architectural Workflow</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-slate-900 dark:text-white">
              How We Built CompliScan AI
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
              End-to-end technical pipeline powering automated packaged commodity verification
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 relative">
            {PIPELINE_STEPS.map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="relative"
              >
                <div className="h-full p-4.5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    {renderPipelineIcon(step.icon)}
                  </div>
                  <div className="text-[10px] font-mono font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wide">
                    Step {step.step}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-tight">
                    {step.desc}
                  </p>
                </div>

                {/* Arrow Connector on desktop between columns */}
                {idx < PIPELINE_STEPS.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-2.5 -translate-y-1/2 z-10 text-slate-300 dark:text-slate-700 pointer-events-none">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

        </div>
      </section>


      {/* ===================================================
          4. COLLEGE / SIH FOOTER BRANDING SECTION
         =================================================== */}
      <section className="relative py-16 bg-slate-950 text-white overflow-hidden border-t border-indigo-900/40">
        {/* Subtle backdrop with the uncropped college image */}
        <div className="absolute inset-0 -z-10 overflow-hidden opacity-20">
          <img
            src={config.collegeImage}
            alt="UCET Campus"
            className="w-full h-full object-cover object-center filter blur-[1px]"
          />
          <div className="absolute inset-0 bg-slate-950/85" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Academic Institution</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
            {config.collegeName}
          </h3>
          <p className="text-sm text-slate-300">
            ({config.collegeShortName}), {config.collegeLocation}
          </p>

          <div className="pt-2 text-xs text-slate-400 flex flex-wrap justify-center items-center gap-4">
            <span className="font-semibold text-slate-200">Smart India Hackathon {config.hackathonYear}</span>
            <span>•</span>
            <span className="font-mono text-indigo-400 font-bold">Problem Statement: {config.problemStatementNumber}</span>
          </div>
        </div>
      </section>

    </div>
  );
}
