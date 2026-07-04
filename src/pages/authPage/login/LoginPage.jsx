import { ArrowBigLeft, GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "../components/LoginForm";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="mb-6">
          <Link
            to="/"
            aria-label="Go back"
            className="inline-flex items-center justify-center p-3 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all duration-300 shadow-sm hover:shadow-md group"
          >
            <ArrowBigLeft
              className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300"
              strokeWidth={1.5}
            />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center p-4">
          <div className="w-full max-w-[400px] bg-slate-100 dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-colors duration-300">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block dark:bg-slate-900 ">
        <img
          src="/logo_ict_solu.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.5] dark:bg-white"
        />
      </div>
    </div>
  );
}
