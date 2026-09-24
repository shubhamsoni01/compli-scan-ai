import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Crown, Mail, Phone, GraduationCap, Building2, 
  Award, Sparkles, CheckCircle2, ShieldCheck, UserCheck, ExternalLink
} from 'lucide-react';
import { TiltCard } from '@/components/ui/TiltCard';
import { Card } from '@/components/ui/Card';

interface TeamMember {
  name: string;
  role: 'Team Leader' | 'Team Member';
  gender: 'F' | 'M';
  stream: string;
  year: string;
  email: string;
  phone: string;
  avatarColor: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Nahid Kausar",
    role: "Team Leader",
    gender: "F",
    stream: "CSE",
    year: "3rd Year",
    email: "nahidkhushi560@gmail.com",
    phone: "9263816880",
    avatarColor: "from-amber-500 to-orange-600"
  },
  {
    name: "Nafisa Khatoon",
    role: "Team Member",
    gender: "F",
    stream: "CSE",
    year: "3rd Year",
    email: "nafisakhatoon282@gmail.com",
    phone: "8092827705",
    avatarColor: "from-emerald-500 to-teal-600"
  },
  {
    name: "Ananaya",
    role: "Team Member",
    gender: "F",
    stream: "CSE",
    year: "3rd Year",
    email: "ananaya20may@gmail.com",
    phone: "6204336310",
    avatarColor: "from-cyan-500 to-blue-600"
  },
  {
    name: "Subham Kumar",
    role: "Team Member",
    gender: "M",
    stream: "IT",
    year: "3rd Year",
    email: "kumarshubham3187@gmail.com",
    phone: "8102592130",
    avatarColor: "from-indigo-500 to-violet-600"
  },
  {
    name: "Yashwant",
    role: "Team Member",
    gender: "M",
    stream: "IT",
    year: "3rd Year",
    email: "ryashwant5051@gmail.com",
    phone: "9693744607",
    avatarColor: "from-purple-500 to-pink-600"
  },
  {
    name: "Manisha Kujur",
    role: "Team Member",
    gender: "F",
    stream: "IT",
    year: "3rd Year",
    email: "maniashkujur@gmail.com",
    phone: "8252379675",
    avatarColor: "from-rose-500 to-red-600"
  }
];

export const OurTeamSection: React.FC = () => {
  return (
    <section id="our-team" className="py-24 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white relative overflow-hidden border-t border-slate-800">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-14">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-300 shadow-sm backdrop-blur-md">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>SMART INDIA HACKATHON 2026 • OFFICIAL NOMINATED TEAM</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
            Meet Team <span className="text-transparent bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 bg-clip-text">INNOVISION</span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Officially nominated developers and researchers from <strong>University College of Engineering and Technology (UCET)</strong>, Vinoba Bhave University, Hazaribagh for Problem Statement <span className="font-mono text-amber-400 font-bold">SIH26034</span>.
          </p>

          {/* College Nomination Badge */}
          <div className="inline-flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-slate-300">
            <div className="bg-slate-800/90 px-3.5 py-1.5 rounded-xl border border-slate-700 flex items-center gap-2">
              <Building2 size={14} className="text-cyan-400" />
              <span>UCET, VBU Hazaribag (Jharkhand)</span>
            </div>
            <div className="bg-slate-800/90 px-3.5 py-1.5 rounded-xl border border-slate-700 flex items-center gap-2">
              <Award size={14} className="text-amber-400" />
              <span>Approved by UGC & AICTE</span>
            </div>
            <div className="bg-slate-800/90 px-3.5 py-1.5 rounded-xl border border-slate-700 flex items-center gap-2">
              <GraduationCap size={14} className="text-emerald-400" />
              <span>Director: Dr. A.K. Saha</span>
            </div>
          </div>
        </div>

        {/* 6 Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEAM_MEMBERS.map((member, idx) => {
            const isLeader = member.role === 'Team Leader';

            return (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className="h-full"
              >
                <TiltCard tiltFactor={6} className="h-full">
                  <Card className={`h-full p-6 bg-slate-900/80 rounded-3xl border ${
                    isLeader 
                      ? 'border-amber-500/50 shadow-2xl shadow-amber-500/10 ring-1 ring-amber-500/30' 
                      : 'border-slate-800 hover:border-emerald-500/40'
                  } transition-all duration-300 flex flex-col justify-between group relative overflow-hidden`}>
                    
                    {/* Top Accent Gradient Bar for Leader */}
                    {isLeader && (
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 animate-pulse" />
                    )}

                    <div className="space-y-4">
                      {/* Top Header: Avatar + Role Badge */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.avatarColor} text-white font-black text-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform border border-white/20`}>
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-extrabold text-lg text-white group-hover:text-emerald-300 transition-colors">
                              {member.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-mono font-bold text-slate-400">
                                {member.stream} • {member.year}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Role Pill */}
                        <div>
                          {isLeader ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/40 shadow-sm">
                              <Crown size={12} className="text-amber-400" />
                              <span>Team Leader</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700">
                              <UserCheck size={12} className="text-emerald-400" />
                              <span>Member</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Details Badge Pills */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                        <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">Department</span>
                          <span className="text-xs font-bold text-slate-200">
                            {member.stream === 'CSE' ? 'Computer Science' : 'Information Tech'}
                          </span>
                        </div>
                        <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">Academic Year</span>
                          <span className="text-xs font-bold text-emerald-400">3rd Year (B.Tech)</span>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2 pt-1">
                        <a 
                          href={`mailto:${member.email}`}
                          className="flex items-center gap-2 text-xs text-slate-400 hover:text-emerald-300 transition-colors p-2 rounded-xl bg-slate-950/50 hover:bg-slate-800/80 border border-slate-800/60"
                        >
                          <Mail size={13} className="text-emerald-400 shrink-0" />
                          <span className="font-mono text-[11px] truncate">{member.email}</span>
                        </a>

                        <a 
                          href={`tel:+91${member.phone}`}
                          className="flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-300 transition-colors p-2 rounded-xl bg-slate-950/50 hover:bg-slate-800/80 border border-slate-800/60"
                        >
                          <Phone size={13} className="text-cyan-400 shrink-0" />
                          <span className="font-mono text-[11px]">+91 {member.phone}</span>
                        </a>
                      </div>
                    </div>

                    {/* Bottom Status Tag */}
                    <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 text-emerald-400 font-medium">
                        <CheckCircle2 size={12} />
                        <span>SIH 2026 Nominated</span>
                      </span>
                      <span className="font-mono text-[10px]">UCET VBU</span>
                    </div>

                  </Card>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>

        {/* Institution & Director Endorsement Banner */}
        <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img 
              src="/assets/ucet-hazaribagh.jpg" 
              alt="UCET Campus" 
              className="h-16 sm:h-20 w-16 sm:w-20 rounded-2xl object-cover border border-white/10 shadow-md shrink-0" 
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Institutional Endorsement
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white">
                University College of Engineering and Technology (UCET)
              </h4>
              <p className="text-xs text-slate-400">
                Vinoba Bhave University, Hazaribag – 825319 (Jharkhand) • Approved by UGC & AICTE
              </p>
            </div>
          </div>

          <div className="bg-slate-900/90 px-6 py-3.5 rounded-2xl border border-slate-800 text-center sm:text-right shrink-0">
            <div className="text-xs text-slate-400">Nominated & Forwarded by:</div>
            <div className="text-sm font-bold text-white mt-0.5">Dr. A.K. Saha</div>
            <div className="text-xs text-emerald-400 font-semibold">Director, UCET VBU Hazaribag</div>
          </div>
        </div>

      </div>
    </section>
  );
};
