"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  BentoCard,
  BentoCardContent,
  BentoCardHeader,
} from "@/components/bento-card";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Flame,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

export default function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <div className="m-auto container py-12 space-y-12">
      <section className="space-y-4 text-center">
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Build Better Habits with{" "}
          <span className="text-emerald-500 dark:text-emerald-400">
            HobbyStreak
          </span>
        </motion.h1>
        <motion.p
          className="text-xl text-muted-foreground max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Track your daily activities, build consistent habits, and visualize
          your progress over time.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button asChild size="lg" className="mt-4">
            <Link href="/dashboard" className="gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </section>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <BentoCard gradient="green" size="lg">
            <BentoCardHeader className="flex items-center gap-2 text-xl">
              <Flame className="h-5 w-5 text-emerald-500" />
              Build Streaks
            </BentoCardHeader>
            <BentoCardContent className="flex flex-col h-[calc(100%-60px)] justify-between">
              <p className="text-muted-foreground">
                Maintain your motivation by building daily streaks. The longer
                your streak, the more motivated you'll be to keep it going.
              </p>
              <div className="flex gap-2 mt-4">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <div
                    key={day}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      day < 6
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                    }`}
                  >
                    {day < 6 ? <CheckCircle className="h-4 w-4" /> : day}
                  </div>
                ))}
              </div>
            </BentoCardContent>
          </BentoCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <BentoCard gradient="blue">
            <BentoCardHeader className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Daily Tracking
            </BentoCardHeader>
            <BentoCardContent>
              <p className="text-muted-foreground">
                Mark activities as done or skipped each day to maintain a
                complete history of your habits.
              </p>
            </BentoCardContent>
          </BentoCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <BentoCard gradient="purple">
            <BentoCardHeader className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Visual Feedback
            </BentoCardHeader>
            <BentoCardContent>
              <p className="text-muted-foreground">
                Enjoy satisfying animations and visual feedback that make
                tracking habits fun and rewarding.
              </p>
            </BentoCardContent>
          </BentoCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <BentoCard gradient="amber">
            <BentoCardHeader className="flex items-center gap-2">
              <Target className="h-5 w-5 text-amber-500" />
              Set Goals
            </BentoCardHeader>
            <BentoCardContent>
              <p className="text-muted-foreground">
                Define your personal goals and track your progress toward
                achieving them consistently.
              </p>
            </BentoCardContent>
          </BentoCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <BentoCard gradient="pink" size="md">
            <BentoCardHeader className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-pink-500" />
              Track Progress
            </BentoCardHeader>
            <BentoCardContent className="flex flex-col h-[calc(100%-60px)] justify-between">
              <p className="text-muted-foreground">
                See your progress over time with beautiful visualizations and
                statistics that help you stay motivated.
              </p>
              <div className="flex items-end gap-1 mt-4 h-20">
                {[30, 45, 60, 40, 80, 65, 90].map((height, i) => (
                  <div
                    key={i}
                    className="bg-pink-500/60 dark:bg-pink-500/40 rounded-t w-full"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </BentoCardContent>
          </BentoCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <BentoCard gradient="slate">
            <BentoCardHeader className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-slate-500" />
              Quick & Easy
            </BentoCardHeader>
            <BentoCardContent>
              <p className="text-muted-foreground">
                Update your habits in seconds with a simple, intuitive interface
                designed for daily use.
              </p>
            </BentoCardContent>
          </BentoCard>
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-3">
          <BentoCard
            gradient="green"
            hoverEffect={false}
            className="flex flex-col md:flex-row items-center justify-center p-6"
          >
            <div className="mb-4 md:mb-0 flex items-center flex-col">
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-emerald-500" />
                Ready to start tracking?
              </h3>
              <p className="text-muted-foreground max-w-2xl text-center">
                Join thousands of users who have improved their habits and
                achieved their goals with HobbyStreak.
              </p>
            </div>
            <Button asChild size="lg" className="flex justify-center">
              <Link
                href="/dashboard"
                className="gap-2 min-w-[150px] justify-center"
              >
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </BentoCard>
        </motion.div>
      </motion.div>
    </div>
  );
}
