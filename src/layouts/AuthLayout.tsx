import React from 'react';
import { Outlet } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-surface-950 transition-colors duration-200">
      {/* Left Branding Panel (Desktop) */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-indigo-600 via-violet-700 to-indigo-900 text-white overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
          <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-white blur-[100px]" />
          <div className="absolute bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-300 blur-[80px]" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-between p-16 h-full w-full max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <ShieldCheck size={32} />
            </div>
            <span className="font-bold text-2xl tracking-tight">CompliScan AI</span>
          </div>
          
          <div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Ensure Product <br/> Compliance <br/> Instantly.
            </h1>
            <p className="text-lg text-indigo-100 max-w-md">
              AI-driven label analysis for FSSAI, FDA, and global regulatory standards. Protect your brand and consumers.
            </p>
          </div>
          
          <div className="text-indigo-200 text-sm">
            © {new Date().getFullYear()} CompliScan AI. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="w-full lg:w-1/2 flex flex-col relative">
        {/* Mobile Brand Strip */}
        <div className="lg:hidden p-6 flex items-center justify-center gap-2 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-surface-900">
          <ShieldCheck className="text-indigo-600 dark:text-violet-400" size={24} />
          <span className="font-bold text-xl text-gray-900 dark:text-white">CompliScan AI</span>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

