import type { Metadata } from "next";
import LoginForm from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to manage your portfolio",
};

// ─── Decorative SVG Background Grid ───────────────────────────────────────────
const BackgroundGrid = () => (
  <div
    className="pointer-events-none absolute inset-0 overflow-hidden"
    aria-hidden="true"
  >
    {/* Grid pattern */}
    <svg
      className="absolute inset-0 h-full w-full opacity-[0.03]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="grid"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>

    {/* Radial linear blobs */}
    <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
    <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
    <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />
  </div>
);

// ─── Brand Logo / Mark ─────────────────────────────────────────────────────────
const BrandMark = () => (
  <div className="flex flex-col items-center gap-3">
    {/* Logo icon */}
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 ring-1 ring-white/10">
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    </div>

    {/* App name */}
    <div className="text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
        Portfolio
      </p>
      <h1 className="text-2xl font-bold tracking-tight text-white">
        Admin Panel
      </h1>
    </div>
  </div>
);

// ─── Login Card ────────────────────────────────────────────────────────────────
const LoginCard = () => (
  <div className="w-full rounded-2xl border border-white/8 bg-white/4 shadow-2xl shadow-black/40 backdrop-blur-xl">
    {/* Card header */}
    <div className="border-b border-white/6 px-8 py-6">
      <h2 className="text-lg font-semibold text-white">Welcome back</h2>
      <p className="mt-1 text-sm text-slate-400">
        Sign in to access your admin dashboard
      </p>
    </div>

    {/* Card body — Login Form */}
    <div className="px-8 py-7">
      <LoginForm />
    </div>

    {/* Card footer */}
    <div className="rounded-b-2xl border-t border-white/6 bg-white/2 px-8 py-4">
      <p className="text-center text-xs text-slate-500">
        Protected area. Unauthorized access is strictly prohibited.
      </p>
    </div>
  </div>
);

// ─── Security Badges ───────────────────────────────────────────────────────────
const SecurityBadges = () => (
  <div className="flex items-center justify-center gap-6">
    {[
      {
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        ),
        label: "SSL Secured",
      },
      {
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
          />
        ),
        label: "Encrypted",
      },
      {
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
          />
        ),
        label: "Auth Protected",
      },
    ].map(({ icon, label }) => (
      <div key={label} className="flex items-center gap-1.5 text-slate-500">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          aria-hidden="true"
        >
          {icon}
        </svg>
        <span className="text-xs">{label}</span>
      </div>
    ))}
  </div>
);

// ─── Page Component ────────────────────────────────────────────────────────────
export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center px-4 py-12">
      {/* Decorative background */}
      <BackgroundGrid />

      {/* Main content */}
      <div className="relative z-10 flex w-full max-w-md flex-col gap-8">
        {/* Brand */}
        <BrandMark />

        {/* Login card with form */}
        <LoginCard />

        {/* Security badges */}
        <SecurityBadges />
      </div>
    </div>
  );
}