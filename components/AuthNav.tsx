import Link from "next/link";

export default function AuthNav() {
  return (
    <nav className="absolute top-6 right-6 z-50 flex items-center gap-3">
      <Link
        href="/login"
        className="font-jost text-xs uppercase tracking-[0.2em] text-white/70 hover:text-[#c9a84c] transition-colors px-3 py-2"
      >
        Sign In
      </Link>
      <div className="h-px w-6 bg-white/20" />
      <Link
        href="/register"
        className="font-jost text-xs uppercase tracking-[0.2em] text-white/70 hover:text-[#c9a84c] transition-colors px-3 py-2 border border-[#c9a84c]/30 hover:border-[#c9a84c] transition-colors"
      >
        Register
      </Link>
    </nav>
  );
}
