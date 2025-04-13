"use client";
import type React from "react";

import { useState, useEffect } from "react";
import { ThemeToggle } from "./theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogIn, Home, Settings, Bell, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "./ui/skeleton";
import { useSession, signIn, signOut } from "next-auth/react";

export default function DynamicIsland() {
  const { data: session, status } = useSession();
  const user = session?.user;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isExpanded && !target.closest('[data-island="true"]')) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  // Animation variants
  const islandVariants = {
    signedOut: {
      width: isHovered ? "160px" : "140px",
      height: "44px",
      borderRadius: "22px",
    },
    collapsed: {
      width: "140px",
      height: "44px",
      borderRadius: "22px",
    },
    expanded: {
      width: "280px",
      height: "320px",
      borderRadius: "24px",
    },
  };

  const handleToggle = () => {
    if (user) {
      setIsExpanded(!isExpanded);
    } else {
      signIn("github", { redirectTo: "/dashboard" });
    }
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        data-island="true"
        initial={user ? "collapsed" : "signedOut"}
        animate={isExpanded ? "expanded" : user ? "collapsed" : "signedOut"}
        variants={islandVariants}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
          mass: 1,
        }}
        className={cn(
          "bg-black text-white flex flex-col overflow-hidden shadow-lg",
          isExpanded ? "items-stretch" : "items-center justify-center",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Island Header - Always visible */}
        <div
          className={cn(
            "flex items-center justify-between w-full cursor-pointer",
            isExpanded ? "p-4 border-b border-gray-800" : "h-full px-4",
          )}
          onClick={handleToggle}
        >
          {status != "loading" ? (
            user ? (
              <>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.image || ""}
                      alt={user.name || "User"}
                    />
                    <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">
                    {isExpanded ? user.name : ""}
                  </span>
                  <span>{isExpanded ? <ThemeToggle /> : ""}</span>
                </div>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isExpanded ? <X size={18} /> : <Menu size={18} />}
                </motion.div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <div className="bg-gray-800 rounded-full p-1.5">
                    <LogIn size={16} />
                  </div>
                  <span className="font-medium text-sm">Sign In</span>
                </div>
                <motion.div
                  animate={{ x: isHovered ? 3 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <LogIn size={16} />
                </motion.div>
              </>
            )
          ) : (
            <Skeleton className="w-[100px] h-[20px] rounded-full" />
          )}
        </div>

        {/* Expanded Navigation Menu */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col p-2 gap-1"
            >
              <NavItem icon={<Home size={16} />} label="Home" href="/" />
              <NavItem
                icon={<Bell size={16} />}
                label="Notifications"
                href="/notifications"
              />
              <NavItem
                icon={<User size={16} />}
                label="Profile"
                href="/profile"
              />
              <NavItem
                icon={<Settings size={16} />}
                label="Settings"
                href="/settings"
              />

              <div className="mt-auto pt-2 border-t border-gray-800">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800"
                  onClick={() => signOut()}
                >
                  Sign out
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
}

function NavItem({ icon, label, href }: NavItemProps) {
  return (
    <Button
      variant="ghost"
      className="w-full justify-start hover:bg-gray-800"
      asChild
    >
      <a href={href} className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </a>
    </Button>
  );
}
