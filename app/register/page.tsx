"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { validateEmail, validatePassword } from "@/lib/auth-utils";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field on change
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0] || "Password is too weak";
      }
    }

    // Validate password match
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Validate terms
    if (!agreedToTerms) {
      newErrors.terms = "Please agree to the Terms & Conditions";
    }

    setErrors(newErrors);

    // Only proceed if no errors
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage("");
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage(`Account created successfully! Redirecting...`);
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
        setAgreedToTerms(false);
        setSuccessMessage("");
      }, 2000);
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

        {/* Error Alert */}
        {Object.keys(errors).length > 0 && (
          <motion.div
            variants={itemVariants}
            className="bg-red-900/20 border border-red-500/50 rounded px-4 py-3 mb-6"
          >
            <p className="font-jost text-sm text-red-400">
              Please fix the following errors:
            </p>
            <ul className="font-jost text-sm text-red-400 mt-2 ml-4 list-disc">
              {errors.name && <li>{errors.name}</li>}
              {errors.email && <li>{errors.email}</li>}
              {errors.password && <li>{errors.password}</li>}
              {errors.confirmPassword && <li>{errors.confirmPassword}</li>}
              {errors.terms && <li>{errors.terms}</li>}
            </ul>
          </motion.div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <motion.div
            variants={itemVariants}
            className="bg-green-900/20 border border-green-500/50 rounded px-4 py-3 mb-6"
          >
            <p className="font-jost text-sm text-green-400">{successMessage}</p>
          </motion.div>
        )}

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
            <label htmlFor="name" className="block font-jost text-xs uppercase tracking-[0.2em] text-white/70 mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              aria-label="Full name"
              aria-describedby={errors.name ? "name-error" : undefined}
              className={`w-full bg-[#111111] border rounded-none px-4 py-3 font-jost text-sm text-white/90 placeholder:text-white/40 focus:outline-none focus:bg-[#1a1a1a] transition-all duration-300 ${
                errors.name
                  ? "border-red-500/70 focus:border-red-500"
                  : "border-[#c9a84c]/30 focus:border-[#c9a84c]/70"
              }`}
            />
            {errors.name && (
              <p id="name-error" className="font-jost text-sm text-red-400 mt-1">
                {errors.name}
              </p>
            )}
          </motion.div>

          {/* Email Input */}
          <motion.div variants={itemVariants}>
            <label htmlFor="email" className="block font-jost text-xs uppercase tracking-[0.2em] text-white/70 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              aria-label="Email address"
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`w-full bg-[#111111] border rounded-none px-4 py-3 font-jost text-sm text-white/90 placeholder:text-white/40 focus:outline-none focus:bg-[#1a1a1a] transition-all duration-300 ${
                errors.email
                  ? "border-red-500/70 focus:border-red-500"
                  : "border-[#c9a84c]/30 focus:border-[#c9a84c]/70"
              }`}
            />
            {errors.email && (
              <p id="email-error" className="font-jost text-sm text-red-400 mt-1">
                {errors.email}
              </p>
            )}
          </motion.div>

          {/* Password Input */}
          <motion.div variants={itemVariants}>
            <label htmlFor="password" className="block font-jost text-xs uppercase tracking-[0.2em] text-white/70 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              aria-label="Password"
              aria-describedby={errors.password ? "password-error" : "password-help"}
              className={`w-full bg-[#111111] border rounded-none px-4 py-3 font-jost text-sm text-white/90 placeholder:text-white/40 focus:outline-none focus:bg-[#1a1a1a] transition-all duration-300 ${
                errors.password
                  ? "border-red-500/70 focus:border-red-500"
                  : "border-[#c9a84c]/30 focus:border-[#c9a84c]/70"
              }`}
            />
            {errors.password ? (
              <p id="password-error" className="font-jost text-sm text-red-400 mt-1">
                {errors.password}
              </p>
            ) : (
              <p id="password-help" className="font-jost text-xs text-white/50 mt-1">
                At least 8 characters with uppercase, lowercase, number, and special character
              </p>
            )}
          </motion.div>

          {/* Confirm Password Input */}
          <motion.div variants={itemVariants}>
            <label htmlFor="confirmPassword" className="block font-jost text-xs uppercase tracking-[0.2em] text-white/70 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              aria-label="Confirm password"
              aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
              className={`w-full bg-[#111111] border rounded-none px-4 py-3 font-jost text-sm text-white/90 placeholder:text-white/40 focus:outline-none focus:bg-[#1a1a1a] transition-all duration-300 ${
                errors.confirmPassword
                  ? "border-red-500/70 focus:border-red-500"
                  : formData.password && formData.confirmPassword === formData.password
                  ? "border-green-500/70 focus:border-green-500"
                  : "border-[#c9a84c]/30 focus:border-[#c9a84c]/70"
              }`}
            />
            {errors.confirmPassword && (
              <p id="confirm-password-error" className="font-jost text-sm text-red-400 mt-1">
                {errors.confirmPassword}
              </p>
            )}
            {!errors.confirmPassword && formData.password && formData.confirmPassword === formData.password && (
              <p className="font-jost text-sm text-green-400 mt-1">✓ Passwords match</p>
            )}
          </motion.div>

          {/* Terms Checkbox */}
          <motion.div variants={itemVariants}>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                id="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  if (errors.terms) setErrors({ ...errors, terms: undefined });
                }}
                aria-label="Agree to terms and conditions"
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
            {errors.terms && (
              <p className="font-jost text-sm text-red-400 mt-2">{errors.terms}</p>
            )}
          </motion.div>

          {/* Sign Up Button */}
          <motion.button
            variants={itemVariants}
            type="submit"
            disabled={isLoading || Object.keys(errors).length > 0}
            aria-label="Create new account"
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
