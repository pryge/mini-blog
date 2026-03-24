"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="glass sticky top-0 z-50 border-b border-slate-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-black bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tight"
            >
              MiniBlog
            </Link>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            <Link
              href="/"
              className="text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-md font-semibold transition-all"
            >
              Home
            </Link>

            {user ? (
              <>
                <Link
                  href="/admin"
                  className="text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-md font-semibold transition-all"
                >
                  Admin
                </Link>
                <div className="flex items-center space-x-6">
                  <div className="flex flex-col items-end">
                    <span className="text-slate-900 font-bold text-sm leading-none">
                      {user.name || "User"}
                    </span>
                    <span className="text-slate-400 text-[10px] uppercase tracking-widest mt-1 font-black">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-slate-200 active:scale-95"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-md font-semibold transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-xl shadow-indigo-200 active:scale-95"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
