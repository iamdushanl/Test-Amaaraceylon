"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { isAuthenticated, logout } from "@/lib/auth-utils";

export default function AuthNav() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const authenticated = isAuthenticated();
    setIsAuth(authenticated);
    setIsLoading(false);
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      setIsAuth(false);
      // Redirect to home after logout
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <nav className="absolute top-6 right-6 z-50 flex items-center gap-3">
      <Link
        href="/menu"
        className="font-jost text-xs uppercase tracking-[0.2em] text-white/70 hover:text-[#c9a84c] transition-colors px-3 py-2"
      >
        Menu
      </Link>
      <div className="h-px w-6 bg-white/20" />
      {!isLoading && !isAuth ? (
        <>
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
        </>
      ) : (
        <>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="font-jost text-xs uppercase tracking-[0.2em] text-white/70 hover:text-[#c9a84c] transition-colors px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : "Logout"}
          </button>
        </>
      )}
    </nav>
  );
}
