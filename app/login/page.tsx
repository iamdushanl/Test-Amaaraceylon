"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert(`Login attempt: ${email}`);
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white/90 flex items-center justify-center px-6 py-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <Link href="/" className="inline-block mb-6">
            <p className="font-cormorant text-4xl font-semibold tracking-[0.28em] text-[#c9a84c] hover:text-[#d9b85c] transition-colors">
              AMAARA
            </p>
          </Link>
          <h1 className="font-cormorant text-3xl font-semibold text-white/90 mb-2">
            Welcome Back
          </h1>
          <p className="font-jost text-sm text-white/60">
            Sign in to access your reservations and account
          </p>
        </motion.div>

        {/* Form Container */}
        <motion.form
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Email Input */}
          <motion.div variants={itemVariants}>
            <label className="block font-jost text-xs uppercase tracking-[0.2em] text-white/70 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full bg-[#111111] border border-[#c9a84c]/30 rounded-none px-4 py-3 font-jost text-sm text-white/90 placeholder:text-white/40 focus:outline-none focus:border-[#c9a84c]/70 focus:bg-[#1a1a1a] transition-all duration-300"
            />
          </motion.div>

          {/* Password Input */}
          <motion.div variants={itemVariants}>
            <label className="block font-jost text-xs uppercase tracking-[0.2em] text-white/70 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-[#111111] border border-[#c9a84c]/30 rounded-none px-4 py-3 font-jost text-sm text-white/90 placeholder:text-white/40 focus:outline-none focus:border-[#c9a84c]/70 focus:bg-[#1a1a1a] transition-all duration-300"
            />
          </motion.div>

          {/* Remember Me & Forgot Password */}
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 bg-[#111111] border border-[#c9a84c]/30 rounded-sm cursor-pointer accent-[#c9a84c]"
              />
              <span className="font-jost text-sm text-white/60 hover:text-white/80 transition-colors">
                Remember me
              </span>
            </label>
            <Link href="/forgot-password" className="font-jost text-sm text-[#c9a84c] hover:text-[#d9b85c] transition-colors">
              Forgot password?
            </Link>
          </motion.div>

          {/* Sign In Button */}
          <motion.button
            variants={itemVariants}
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#c9a84c] px-6 py-3 font-jost text-sm font-semibold uppercase tracking-[0.22em] text-[#050505] transition-all duration-300 hover:shadow-lg hover:shadow-[#c9a84c]/20 disabled:opacity-70 disabled:cursor-not-allowed mt-8"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="inline-block"
                >
                  ⟳
                </motion.span>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </motion.button>
        </motion.form>

        {/* Divider */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-[#c9a84c]/20" />
          <span className="font-jost text-xs uppercase tracking-[0.2em] text-white/50">
            Or
          </span>
          <div className="flex-1 h-px bg-[#c9a84c]/20" />
        </motion.div>

        {/* Social Login */}
        <motion.div variants={itemVariants} className="space-y-3">
          <button className="w-full border border-[#c9a84c]/30 rounded-none px-6 py-3 font-jost text-sm uppercase tracking-[0.2em] text-white/70 hover:border-[#c9a84c]/70 hover:text-[#c9a84c] transition-all duration-300">
            Continue with Google
          </button>
          <button className="w-full border border-[#c9a84c]/30 rounded-none px-6 py-3 font-jost text-sm uppercase tracking-[0.2em] text-white/70 hover:border-[#c9a84c]/70 hover:text-[#c9a84c] transition-all duration-300">
            Continue with Apple
          </button>
        </motion.div>

        {/* Sign Up Link */}
        <motion.div variants={itemVariants} className="text-center mt-8">
          <p className="font-jost text-sm text-white/60">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#c9a84c] hover:text-[#d9b85c] transition-colors font-medium">
              Create one
            </Link>
          </p>
        </motion.div>

        {/* Back to Home */}
        <motion.div variants={itemVariants} className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-jost text-xs uppercase tracking-[0.2em] text-white/50 hover:text-white/70 transition-colors"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
