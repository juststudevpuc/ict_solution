import { LoginAdminForm } from "../component/LoginAdminForm";

export default function LoginAdmin() {
  return (
    <div className="flex min-h-screen w-screen flex-col lg:flex-row bg-slate-50 dark:bg-[#050B14] text-slate-900 dark:text-slate-50 font-sans antialiased transition-colors duration-300 overflow-x-hidden no-scrollbar">
      
      {/* 1. Left Sidebar: Asymmetric Branding Panel */}
      <div className="relative flex flex-col justify-between items-center lg:items-start p-8 lg:p-12 lg:w-[360px] xl:w-[400px] bg-white dark:bg-[#0B1528] border-b lg:border-b-0 lg:border-r border-slate-200/60 dark:border-slate-800/60 shrink-0 transition-colors duration-300">
        
        {/* Top Section: Navigation Link */}
        <a 
          href="/" 
          className="group flex items-center gap-3 select-none py-2 px-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-colors duration-200"
        >
          <div className="h-2.5 w-2.5 rounded-full bg-blue-600 dark:bg-blue-500 animate-pulse" />
          <span className="text-sm font-medium tracking-wide text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-200">
            Back to main site
          </span>
        </a>

        {/* Middle Section: Oversized Hero Logo Badge */}
        <div className="my-12 lg:my-0 flex flex-col items-center lg:items-start gap-6 w-full">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] bg-slate-100 dark:bg-slate-100 p-4 shadow-inner border border-slate-200/40 dark:border-slate-800/60 transition-all duration-500 hover:rotate-6 hover:scale-105">
            
            {/* Ambient background glow inside the badge */}
            <div className="absolute inset-2 bg-gradient-to-tr from-blue-600/10 to-transparent rounded-[1.5rem] blur-sm pointer-events-none"></div>
            
            <img
              src="/logo_ict_solu.png"
              alt="ICT Solutions Logo"
              className="relative z-10 h-full w-full object-contain dark:brightness-110"
            />
          </div>
          
          <div className="text-center lg:text-left">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
              ICT Solutions
            </h1>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1.5 uppercase tracking-widest">
              Admin Portal
            </p>
          </div>
        </div>

        {/* Bottom Section: Minimal Footer Note */}
        <p className="hidden lg:block text-xs font-medium text-slate-400 dark:text-slate-600 transition-colors">
          &copy; 2026 ICT Solution Co., Ltd.
        </p>
      </div>

      {/* 2. Right Workspace: Clean Form Area */}
      <div className="flex flex-1 items-center justify-center p-6 md:p-12 lg:p-24 bg-slate-50 dark:bg-[#050B14] transition-colors duration-300">
        <div className="w-full max-w-[380px] transition-transform duration-300 hover:scale-[1.01]">
          <LoginAdminForm />
        </div>
      </div>
      
    </div>
  );
}