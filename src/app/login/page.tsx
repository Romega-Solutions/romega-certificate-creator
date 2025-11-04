"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Simple authentication check (replace with actual API call)
    if (username === "romega_admin" && password === "RomegaCert2024!") {
      localStorage.setItem("isAuthenticated", "true");
      if (remember) {
        localStorage.setItem("rememberMe", "true");
      }
      router.push("/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--rs-primary-50)] via-white to-[var(--rs-accent-50)]">
        <div className="text-center">
          <p className="text-[var(--rs-neutral-600)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--rs-primary-50)] via-white to-[var(--rs-accent-50)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-[var(--rs-neutral-200)]">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[var(--rs-primary-500)] to-[var(--rs-primary-600)] shadow-lg">
                <Award className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1
              className="font-bold text-2xl text-[var(--rs-primary-700)] mb-2"
              style={{ fontFamily: "Merriweather, serif" }}
            >
              Certificate Generator
            </h1>
            <p className="text-sm text-[var(--rs-neutral-600)]">
              Romega Solutions - Authorized Access Only
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-700">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-[var(--rs-neutral-700)] mb-2"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-[var(--rs-neutral-400)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 border border-[var(--rs-neutral-300)] rounded-lg focus:ring-2 focus:ring-[var(--rs-primary-500)] focus:border-transparent transition-all"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[var(--rs-neutral-700)] mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-[var(--rs-neutral-400)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-4 py-3 border border-[var(--rs-neutral-300)] rounded-lg focus:ring-2 focus:ring-[var(--rs-primary-500)] focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 text-[var(--rs-primary-500)] focus:ring-[var(--rs-primary-500)] border-[var(--rs-neutral-300)] rounded"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-[var(--rs-neutral-700)]"
              >
                Keep me logged in for 7 days
              </label>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full font-semibold py-3 px-4 rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              style={{
                backgroundColor: "var(--rs-primary-500)",
                color: "white",
              }}
            >
              Sign In
            </Button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-6 border-t border-[var(--rs-neutral-200)]">
            <div className="flex items-start gap-2 text-xs text-[var(--rs-neutral-500)]">
              <svg
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <p>
                This application is for authorized Romega Solutions team members
                only. Unauthorized access is prohibited. Contact IT if you need
                access credentials.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-[var(--rs-neutral-600)]">
            Need help? Contact{" "}
            <a
              href="mailto:it@romega-solutions.com"
              className="text-[var(--rs-primary-600)] hover:text-[var(--rs-primary-700)] font-medium"
            >
              IT Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
