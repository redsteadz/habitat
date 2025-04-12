"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Github } from "lucide-react";

export default function SignOutGit() {
  return (
    <div>
      <div className="relative group">
        <button
          onClick={() => signOut({ redirectTo: "/" })}
          className="relative inline-block p-px font-semibold leading-6 text-white bg-neutral-900 shadow-2xl cursor-pointer rounded-2xl shadow-emerald-900 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-emerald-600"
        >
          <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-600 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
          <span className="relative z-10 block px-6 py-3 rounded-2xl bg-neutral-950">
            <div className="relative z-10 flex items-center space-x-3">
              <span className="transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-emerald-300"></span>
              <LogOut className="w-7 h-7 transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-emerald-300" />
            </div>
          </span>
        </button>
      </div>
    </div>
  );
}
