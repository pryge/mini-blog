"use client";

import React, { useState } from "react";
import api from "@/lib/api";
import { isAxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/register", { name, email, password });
      router.push("/login");
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        if (err.response?.data?.details) {
          setError(err.response.data.details[0].message);
        } else {
          setError(err.response?.data?.error || "Error during registration");
        }
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-20 bg-linear-to-b from-transparent to-slate-50">
      <div className="max-w-md w-full space-y-10 bg-white/70 backdrop-blur-2xl p-10 rounded-3xl border border-white shadow-2xl shadow-slate-200/50">
        <div>
          <h2 className="text-center text-4xl font-black text-slate-900 tracking-tight">
            Join Us
          </h2>
          <p className="mt-4 text-center text-sm text-slate-500 font-medium">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors underline decoration-2 underline-offset-4"
            >
              Sign in here
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-2xl text-sm font-bold animate-shake">
              {error}
            </div>
          )}
          <div className="space-y-5">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-5 py-3.5 text-slate-900 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none placeholder:text-slate-300"
                placeholder="John Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-5 py-3.5 text-slate-900 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none placeholder:text-slate-300"
                placeholder="hello@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-5 py-3.5 text-slate-900 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none placeholder:text-slate-300"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-indigo-200 text-sm font-black text-white bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all active:scale-95"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
