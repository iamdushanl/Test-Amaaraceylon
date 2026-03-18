"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!agreedToTerms) {
      alert("Please agree to the Terms & Conditions");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert(`Registration successful: ${formData.email}`);
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
        <motion.div variants={itemVariants} className="text-center mb-10">
          <Link href="/" className="inline-block mb-6">
            <p className="font-cormorant text-4xl font-semibold tracking-[0.28em] text-[#c9a84c] hover:text-[#d9b85c] transition-colors">
              AMAARA
            </p>
          </Link>
          <h1 className="font-cormorant text-3xl font-semibold text-white/90 mb-2">
            Create Account
          </h1>
          <p className="font-jost text-sm text-white/60">
            Join us for an unforgettable dining experience
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
          {/* Name Input */}
          <motion.div variants={itemVariants}>
            <label className="block font-jost text-xs uppercase tracking-[0.2em] text-white/70 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="w-full bg-[#111111] border border-[#c9a84c]/30 rounded-none px-4 py-3 font-jost text-sm text-white/90 placeholder:text-white/40 focus:outline-none focus:border-[#c9a84c]/70 focus:bg-[#1a1a1a] transition-all duration-300"
            />
          </motion.div>

          {/* Email Input */}
          <motion.div variants={itemVariants}>
            <label className="block font-jost text-xs uppercase tracking-[0.2em] text-white/70 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full bg-[#111111] border border-[#c9a84c]/30 rounded-none px-4 py-3 font-jost text-sm text-white/90 placeholder:text-white/40 focus:outline-none focus:border-[#c9a84c]/70 focus:bg-[#1a1a1a] transition-all duration-300"
            />
          </motion.div>

          {/* Confirm Password Input */}
          <motion.div variants={itemVariants}>
            <label className="block font-jost text-xs uppercase tracking-[0.2em] text-white/70 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full bg-[#111111] border border-[#c9a84c]/30 rounded-none px-4 py-3 font-jost text-sm text-white/90 placeholder:text-white/40 focus:outline-none focus:border-[#c9a84c]/70 focus:bg-[#1a1a1a] transition-all duration-300"
            />
          </motion.div>

          {/* Terms Checkbox */}
          <motion.div variants={itemVariants}>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 bg-[#111111] border border-[#c9a84c]/30 rounded-sm cursor-pointer accent-[#c9a84c] mt-1"
              />
              <span className="font-jost text-sm text-white/60 leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" className="text-[#c9a84c] hover:text-[#d9b85c] transition-colors">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#c9a84c] hover:text-[#d9b85c] transition-colors">
                  Privacy Policy
                </Link>
              </span>
            </label>
          </motion.div>

          {/* Sign Up Button */}
          <motion.button
            variants={itemVariants}
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#c9a84c] px-6 py-3 font-jost text-sm font-semibold uppercase tracking-[0.22em] text-[#050505] transition-all duration-300 hover:shadow-lg hover:shadow-[#c9a84c]/20 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
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
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </motion.button>
        </motion.form>

        {/* Sign In Link */}
        <motion.div variants={itemVariants} className="text-center mt-8">
          <p className="font-jost text-sm text-white/60">
            Already have an account?{" "}
            <Link href="/login" className="text-[#c9a84c] hover:text-[#d9b85c] transition-colors font-medium">
              Sign in
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
