import React from 'react';
import { 
  FileText, 
  ExternalLink, 
  Landmark, 
  Scale, 
  ShieldCheck, 
  BookOpen, 
  ArrowUpRight 
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { officialGazetteDocuments, type OfficialGazetteDoc } from '@/data/complianceRules';

interface OfficialGazetteDocsCardProps {
  category?: string;
}

export const OfficialGazetteDocsCard: React.FC<OfficialGazetteDocsCardProps> = () => {
  return (
    <Card className="p-0 overflow-hidden border-slate-200 dark:border-slate-800 shadow-md bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Landmark size={22} />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Official Government Gazettes & Acts Library</span>
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                Direct PDF Sources
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified legal references and authentic gazette notifications from Government of India portals
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
          <Scale size={14} className="text-indigo-500" />
          <span>FSSAI • Legal Metrology • ICMR</span>
        </div>
      </div>

      {/* Grid of Official Documents */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {officialGazetteDocuments.map((doc: OfficialGazetteDoc) => (
          <div
            key={doc.id}
            className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50/40 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800/80 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <Badge variant={doc.category === 'FSSAI' ? 'success' : doc.category === 'Legal Metrology' ? 'primary' : 'warning'}>
                  {doc.category}
                </Badge>
                <span className="text-[11px] font-mono text-slate-400">
                  {doc.notificationDate}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {doc.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {doc.description}
                </p>
              </div>

              {/* Key Sections */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {doc.keySections.map((sec, sIdx) => (
                  <span
                    key={sIdx}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300"
                  >
                    {sec}
                  </span>
                ))}
              </div>
            </div>

            {/* Direct Official PDF Button */}
            <div className="pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 truncate max-w-[180px]">
                {doc.authority}
              </span>
              <a
                href={doc.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition-all border border-indigo-200/60 dark:border-indigo-800/60 shadow-xs"
              >
                <span>Official PDF</span>
                <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
