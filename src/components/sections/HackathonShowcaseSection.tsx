import React from 'react';
import { motion } from 'framer-motion';
import { Award, GraduationCap, Building2, Users, FileCheck2, Sparkles, ChevronRight } from 'lucide-react';

/**
 * Single source of truth configuration for Hackathon / University Presentation.
 * Easily editable by developers and reviewers.
 */
export const HACKATHON_PROJECT_CONFIG = {
  collegeName: 'University College of Engineering and Technology',
  collegeShortName: 'UCET',
  collegeLocation: 'Hazaribagh, Jharkhand',
  collegeImage: '/assets/ucet-hazaribagh.jpg',
  hackathonName: 'Smart India Hackathon',
  hackathonYear: '2026',
  problemStatementNumber: 'SIH26034',
  problemCategory: 'Smart Automation / AI & Computer Vision',
  problemTitle: 'AI-Powered Packaged Product Labelling & Compliance Screening',
  problemDescription:
    'Automating the verification of packaged commodity labelling against mandatory Indian regulatory standards (Legal Metrology, FSSAI, CDSCO). Leverages Computer Vision, OCR extraction, and deterministic legal rule verification to screen for regulatory non-compliance in real-time.',
  teamName: 'To be updated',
  teamMembers: [] as string[], // Will be populated once finalized: ['Member 1', 'Member 2', ...]
};

export const HackathonShowcaseSection: React.FC = () => {
  const config = HACKATHON_PROJECT_CONFIG;

  return (
    <section className="relative overflow-hidden bg-slate-950 text-slate-100 py-20 border-t border-indigo-900/40">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 mb-4 shadow-sm">
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            <span>National Hackathon Innovation Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white tracking-tight">
            Smart India Hackathon <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-cyan-300 bg-clip-text text-transparent">{config.hackathonYear}</span>
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-400">
            A technological solution engineered at {config.collegeShortName}, Hazaribagh for automated regulatory intelligence and consumer safety.
          </p>
        </div>

        {/* Main Split Grid Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl shadow-2xl shadow-indigo-950/20 overflow-hidden">
          
          {/* Left Column: Campus Imagery displaying the 100% COMPLETE original image without cropping */}
          <div className="lg:col-span-6 relative w-full flex flex-col justify-between overflow-hidden bg-slate-950/80 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-slate-800/80">
            {/* Blurred ambient background clone for smooth fill without letterbox voids */}
            <div 
              className="absolute inset-0 bg-cover bg-center blur-2xl opacity-30 scale-110 -z-10 pointer-events-none"
              style={{ backgroundImage: `url(${config.collegeImage})` }}
            />
            <div className="absolute inset-0 bg-slate-950/60 -z-10" />

            {/* Institution Origin Tag at Top */}
            <div className="flex items-center justify-between z-10 mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs text-indigo-300 font-medium">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Institutional Origin</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Campus View</span>
            </div>

            {/* Complete Full Uncropped Image */}
            <div className="relative w-full flex items-center justify-center my-auto py-2 group/img cursor-default">
              <img
                src={config.collegeImage}
                alt={`${config.collegeName} (${config.collegeShortName}), ${config.collegeLocation}`}
                className="w-full h-auto max-h-[340px] sm:max-h-[380px] lg:max-h-[420px] object-contain rounded-xl sm:rounded-2xl shadow-2xl border border-white/10 group-hover/img:scale-[1.015] group-hover/img:border-indigo-400/30 transition-all duration-500 ease-out"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            {/* Institution Details at Bottom */}
            <div className="z-10 mt-3 pt-3 border-t border-slate-800/60">
              <h3 className="text-lg sm:text-xl font-bold text-white font-heading leading-snug">
                {config.collegeName}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>({config.collegeShortName}), {config.collegeLocation}</span>
              </p>
            </div>
          </div>

          {/* Right Column: Problem Statement & Hackathon Details */}
          <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
            
            {/* SIH Header & PS ID */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-800/80">
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Hackathon Initiative</span>
                  <div className="text-xl font-bold text-white tracking-tight flex items-center gap-2 mt-0.5">
                    <span>{config.hackathonName}</span>
                    <span className="px-2 py-0.5 text-xs font-semibold rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {config.hackathonYear}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold block">Problem Statement</span>
                  <span className="text-2xl font-extrabold font-mono text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text">
                    {config.problemStatementNumber}
                  </span>
                </div>
              </div>

              {/* Problem Brief */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                  <FileCheck2 className="w-4 h-4 text-cyan-400" />
                  <span>{config.problemTitle}</span>
                </div>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                  {config.problemDescription}
                </p>
              </div>
            </div>

            {/* Key Architectural Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              {[
                { title: 'Vision Model', value: 'OCR.Space + Groq' },
                { title: 'Legal Metrology', value: 'Rule Engine (PCR 2011)' },
                { title: 'Enterprise Security', value: 'JWT + Atlas Isolated' }
              ].map((pillar, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="p-3.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-800 hover:border-indigo-500/30 transition-all cursor-default shadow-sm"
                >
                  <div className="text-xs text-slate-400 font-medium">{pillar.title}</div>
                  <div className="text-sm font-semibold text-slate-200 mt-0.5">{pillar.value}</div>
                </motion.div>
              ))}
            </div>

            {/* Team Details & Institutional Credits */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-medium block">Developed By</span>
                <span className="text-sm font-semibold text-slate-200">
                  {config.collegeShortName}, Hazaribagh
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-2 text-xs text-slate-300">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-slate-400 font-medium">Team Details:</span>
                  <span className="font-semibold text-slate-200">{config.teamName}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default HackathonShowcaseSection;
