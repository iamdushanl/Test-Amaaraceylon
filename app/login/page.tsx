"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { validateEmail } from "@/lib/auth-utils";
import { AUTH_ENDPOINTS } from "@/lib/auth-config";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; api?: string }>({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string; api?: string } = {};

    // Validate email
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Validate password
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);

    // Only proceed if no errors
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage("");
    
    try {
      // Make actual API call
      const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          rememberMe,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({
          api: data.error || "Login failed. Please try again.",
        });
        return;
      }

      // Store token and user data
      if (data.accessToken) {
        import("@/lib/auth-utils").then(({ setAuthToken, setUserId, setRefreshToken }) => {
          setAuthToken(data.accessToken);
          if (data.refreshToken) {
            setRefreshToken(data.refreshToken);
          }
          if (data.user?.id) {
            setUserId(data.user.id);
          }
        });
      }

      setSuccessMessage(`Welcome back, ${data.user?.name || "User"}! Redirecting...`);
      
      // Reset form and redirect after 2 seconds
      setTimeout(() => {
        setEmail("");
        setPassword("");
        setRememberMe(false);
        setSuccessMessage("");
        // Redirect to dashboard or home
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      setErrors({
        api: "Network error. Please check your connection and try again.",
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
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
              {errors.email && <li>{errors.email}</li>}
              {errors.password && <li>{errors.password}</li>}
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
          {/* Email Input */}
          <motion.div variants={itemVariants}>
            <label htmlFor="email" className="block font-jost text-xs uppercase tracking-[0.2em] text-white/70 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
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
              value={password}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              aria-label="Password"
              aria-describedby={errors.password ? "password-error" : undefined}
              className={`w-full bg-[#111111] border rounded-none px-4 py-3 font-jost text-sm text-white/90 placeholder:text-white/40 focus:outline-none focus:bg-[#1a1a1a] transition-all duration-300 ${
                errors.password
                  ? "border-red-500/70 focus:border-red-500"
                  : "border-[#c9a84c]/30 focus:border-[#c9a84c]/70"
              }`}
            />
            {errors.password && (
              <p id="password-error" className="font-jost text-sm text-red-400 mt-1">
                {errors.password}
              </p>
            )}
          </motion.div>

          {/* Remember Me & Forgot Password */}
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                aria-label="Remember me on this device"
                className="w-4 h-4 bg-[#111111] border border-[#c9a84c]/30 rounded-sm cursor-pointer accent-[#c9a84c]"
              />
              <span className="font-jost text-sm text-white/60 hover:text-white/80 transition-colors">
                Remember me
              </span>
            </label>
            <Link href="/forgot-password" className="font-jost text-sm text-[#c9a84c] hover:text-[#d9b85c] transition-colors" aria-label="Forgot password">
              Forgot password?
            </Link>
          </motion.div>

          {/* Sign In Button */}
          <motion.button
            variants={itemVariants}
            type="submit"
            disabled={isLoading || Object.keys(errors).length > 0}
            aria-label="Sign in to your account"
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
          <button
            type="button"
            aria-label="Continue with Google"
            className="w-full border border-[#c9a84c]/30 rounded-none px-6 py-3 font-jost text-sm uppercase tracking-[0.2em] text-white/70 hover:border-[#c9a84c]/70 hover:text-[#c9a84c] transition-all duration-300"
          >
            Continue with Google
          </button>
          <button
            type="button"
            aria-label="Continue with Apple"
            className="w-full border border-[#c9a84c]/30 rounded-none px-6 py-3 font-jost text-sm uppercase tracking-[0.2em] text-white/70 hover:border-[#c9a84c]/70 hover:text-[#c9a84c] transition-all duration-300"
          >
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
