import { GalleryVerticalEnd } from "lucide-react";
import { LoginAdminForm } from "../component/LoginAdminForm";

export default function LoginAdmin() {
  const img = {
    src: "logo_ict_solu.png",
  };
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-slate-50 dark:bg-[#0B1528] p-6 md:p-10 transition-colors duration-300">
      {/* Container restricted to 400px for optimal form readability */}
      <div className="flex w-full max-w-[400px] flex-col items-center gap-8">
        {/* Brand / Logo Header */}
        <a href="/" className="flex items-center gap-3 group">
          {/* Elevated App-like Icon Container */}
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white dark:bg-white/10 shadow-[0_4px_20px_rgb(0,0,0,0.05)] dark:shadow-none border border-slate-100 dark:border-white/10 p-2 transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
            <img
              src="/logo_ict_solu.png"
              alt="ICT Solutions Logo"
              className="h-full w-full object-contain flex drop-shadow-sm"
            />
          </div>

          <span className="font-semibold text-2xl tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
            ICT Solutions
          </span>
        </a>

        {/* The Form Component */}
        <div className="w-full">
          <LoginAdminForm />
        </div>
      </div>
    </div>
  );
}
