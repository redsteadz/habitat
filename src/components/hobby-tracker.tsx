"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Check, Calendar, Sparkles, CloudRain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { addDays, format, subDays } from "date-fns";
import { AnimatedButton } from "./animated-button";
import { CardBackground } from "./card-background";
import axios from "axios";
import {
  Completion,
  completionsTable,
  Habit,
  habitsTable,
} from "@/server/db/schema";
import { useSession } from "next-auth/react";

// Mock data - Actual hobbies with tracking for the last 7 days
const initialHobbies = [
  {
    id: 1,
    name: "Morning Yoga",
    category: "Wellness",
    streak: 3,
    history: [
      { date: subDays(new Date(), 1), status: "done" },
      { date: subDays(new Date(), 2), status: "done" },
      { date: subDays(new Date(), 3), status: "done" },
      { date: subDays(new Date(), 4), status: "skipped" },
      { date: subDays(new Date(), 5), status: "done" },
      { date: subDays(new Date(), 6), status: "skipped" },
      { date: subDays(new Date(), 7), status: "done" },
    ],
    todayStatus: null,
  },
  {
    id: 2,
    name: "Read 30 Pages",
    category: "Learning",
    streak: 0,
    history: [
      { date: subDays(new Date(), 1), status: "skipped" },
      { date: subDays(new Date(), 2), status: "skipped" },
      { date: subDays(new Date(), 3), status: "done" },
      { date: subDays(new Date(), 4), status: "done" },
      { date: subDays(new Date(), 5), status: "skipped" },
      { date: subDays(new Date(), 6), status: "done" },
      { date: subDays(new Date(), 7), status: "done" },
    ],
    todayStatus: null,
  },
  {
    id: 3,
    name: "Practice Guitar",
    category: "Music",
    streak: 5,
    history: [
      { date: subDays(new Date(), 1), status: "done" },
      { date: subDays(new Date(), 2), status: "done" },
      { date: subDays(new Date(), 3), status: "done" },
      { date: subDays(new Date(), 4), status: "done" },
      { date: subDays(new Date(), 5), status: "done" },
      { date: subDays(new Date(), 6), status: "skipped" },
      { date: subDays(new Date(), 7), status: "skipped" },
    ],
    todayStatus: null,
  },
];

type HobbyStatus = "done" | "skipped" | null;

type HabitWithCompletions = Habit & {
  completions: Completion[];
  todayStatus?: "done" | "skipped" | null;
};

export default function HobbyTracker({
  habits,
}: {
  habits: HabitWithCompletions[];
}) {
  const session = useSession();
  const [hobbies, setHobbies] = useState<HabitWithCompletions[]>(habits);
  const [newHobby, setNewHobby] = useState("");
  const [newCategory, setNewCategory] = useState("General");
  const [showAddForm, setShowAddForm] = useState(false);
  const today = new Date();
  const [clickOrigins, setClickOrigins] = useState<
    Record<number, { x: number; y: number }>
  >({});

  const setCompletions = () => {
    setHobbies((prev) => {
      return prev.map((hobby) => {
        let newCompletions: Completion[] = [];
        // for each hobby, return the completion of the last 7 days
        // from last saturday to next friday
        const lastSat = subDays(today, today.getDay() % 7);
        // set todayStatus to the completion of today
        const todayCompletion = hobby.completions.find((c) =>
          format(new Date(c.date), "yyyy-MM-dd").includes(
            format(today, "yyyy-MM-dd"),
          ),
        );
        if (todayCompletion) {
          console.log("todayCompletion: ", todayCompletion);
          hobby.todayStatus = todayCompletion.completed ? "done" : "skipped";
        } else {
          hobby.todayStatus = null;
        }

        for (let i = 0; i < 7; i++) {
          const date = addDays(lastSat, i);
          const completion = hobby.completions.find((c) =>
            format(new Date(c.date), "yyyy-MM-dd").includes(
              format(date, "yyyy-MM-dd"),
            ),
          );
          newCompletions.push({
            id: completion ? completion.id : 0,
            habitId: hobby.id,
            date: date.toISOString(),
            completed: completion ? true : false,
          });
        }
        return {
          ...hobby,
          completions: newCompletions,
        };
      });
    });
  };

  useEffect(() => {
    setCompletions();
  }, []);

  const markHobbyStatus = (
    id: number,
    status: HobbyStatus,
    event: React.MouseEvent,
  ) => {
    // Calculate the relative position within the card
    const buttonRect = event.currentTarget.getBoundingClientRect();
    const originX =
      (buttonRect.left + buttonRect.width / 2) / window.innerWidth;
    const originY =
      (buttonRect.top + buttonRect.height / 2) / window.innerHeight;

    // Store the click origin for this hobby
    setClickOrigins((prev) => ({
      ...prev,
      [id]: { x: originX, y: originY },
    }));

    const makeUpdateCompletionRequest = async () => {
      const res = await axios.post("/api/completion/update", {
        habitId: id,
        userMail: session.data?.user?.email,
        status: status === "done" ? true : false,
      });
      if (res.status === 200) {
        toast.success("Habit status updated successfully!");
      } else {
        toast.error("Error updating habit status.");
      }
    };
    setHobbies((prev) =>
      prev.map((hobby) => {
        if (hobby.id === id) {
          // If clicking the same status again, toggle it off
          if (hobby.todayStatus === status) {
            // hobby.completions[today.getDay()].completed = false;
            return hobby;
          }

          // Calculate new streak
          let newStreak = hobby.streak;
          if (status === "done") {
            newStreak = hobby.streak + 1;
            hobby.completions[today.getDay()].completed = true;
            toast.success("Hobby marked as done! 🎉");
          } else if (status === "skipped") {
            hobby.completions[today.getDay()].completed = false;
            newStreak = 0;
          }

          return {
            ...hobby,
            todayStatus: status,
            streak: newStreak,
          };
        }
        return hobby;
      }),
    );
    makeUpdateCompletionRequest();
  };

  const addHobby = () => {
    if (!newHobby.trim()) return;

    try {
      const userMail = session.data?.user?.email;
      const makeRequest = async () => {
        // Create empty history for the last 7 days
        const res = await axios.post("/api/habit/create", {
          name: newHobby,
          frequency: "daily",
          userMail,
        });
        const newHobbyItem: HabitWithCompletions = res.data.habit;
        const lastSat = subDays(today, today.getDay() % 7);
        newHobbyItem.completions = Array.from({ length: 7 }, (_, i) => ({
          id: i,
          habitId: newHobbyItem.id,
          date: subDays(lastSat, i).toISOString(),
          completed: false,
        }));
        setHobbies((prev) => [...prev, newHobbyItem]);
        setNewHobby("");
        setNewCategory("General");
        setShowAddForm(false);
      };
      makeRequest();
    } catch (error) {
      console.log("Error adding hobby:", error);
    }

    toast.success("Hobby added! 🎉");
  };

  const deleteHobby = (id: number) => {
    const userMail = session.data?.user?.email;
    const makeRequest = async () => {
      const resp = await axios.post("/api/habit/remove", {
        habitId: id,
        userMail,
      });
      if (resp.status === 200) {
        toast.success("Hobby removed successfully!");
      } else {
        toast.error("Error removing hobby.");
      }
    };
    makeRequest();

    const hobby = hobbies.find((h) => h.id === id);
    setHobbies((prev) => prev.filter((hobby) => hobby.id !== id));

    if (hobby) {
      toast.error(`"${hobby.name}" has been removed.`);
    }
  };

  // Confetti animation for "Done" status
  const confettiVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const confettiItemVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  // Rain animation for "Skipped" status
  const rainVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const rainDropVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 0.7,
      y: 20,
      transition: {
        repeat: 3,
        repeatType: "loop" as const,
        duration: 1.5,
      },
    },
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Habits</h1>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          variant="outline"
          className="gap-2"
        >
          {showAddForm ? (
            <X className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {showAddForm ? "Cancel" : "Add Hobby"}
        </Button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-8"
          >
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="hobby-name"
                      className="text-sm font-medium block mb-1"
                    >
                      Hobby Name
                    </label>
                    <Input
                      id="hobby-name"
                      placeholder="e.g., Morning Yoga"
                      value={newHobby}
                      onChange={(e) => setNewHobby(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="hobby-category"
                      className="text-sm font-medium block mb-1"
                    >
                      Category
                    </label>
                    <Input
                      id="hobby-category"
                      placeholder="e.g., Wellness"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    />
                  </div>
                  <Button onClick={addHobby} className="w-full">
                    Add Hobby
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {hobbies.map((hobby) => (
            <motion.div
              key={hobby.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden h-full relative transition-all duration-700">
                {/* Animated background */}
                <AnimatePresence mode="wait">
                  <CardBackground
                    key={`bg-${hobby.id}-${hobby.todayStatus}`}
                    status={hobby.todayStatus!}
                    hobbyId={hobby.id}
                    originX={clickOrigins[hobby.id]?.x || 0.5}
                    originY={clickOrigins[hobby.id]?.y || 0.5}
                  />
                </AnimatePresence>

                {/* Radiating animation overlay */}
                <AnimatePresence>
                  {hobby.todayStatus === "done" && (
                    <motion.div
                      key={`radiate-done-${hobby.id}`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 0.7, 0.5, 0.3],
                        scale: [0, 1.5, 2.5, 4],
                      }}
                      exit={{
                        opacity: 0,
                        scale: 4,
                        transition: { duration: 0.5 },
                      }}
                      transition={{
                        duration: 1.2,
                        ease: [0.22, 1, 0.36, 1],
                        times: [0, 0.3, 0.6, 1],
                      }}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-emerald-400/20 dark:bg-emerald-500/30 pointer-events-none z-0 backdrop-blur-sm"
                      style={{
                        originX: 0.5,
                        originY: 0.5,
                        left: `${(clickOrigins[hobby.id]?.x || 0.5) * 100}%`,
                        top: `${(clickOrigins[hobby.id]?.y || 0.5) * 100}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  )}
                  {hobby.todayStatus === "skipped" && (
                    <motion.div
                      key={`radiate-skip-${hobby.id}`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 0.7, 0.5, 0.3],
                        scale: [0, 1.5, 2.5, 4],
                      }}
                      exit={{
                        opacity: 0,
                        scale: 4,
                        transition: { duration: 0.5 },
                      }}
                      transition={{
                        duration: 1.2,
                        ease: [0.22, 1, 0.36, 1],
                        times: [0, 0.3, 0.6, 1],
                      }}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-300/30 dark:bg-slate-600/30 pointer-events-none z-0 backdrop-blur-sm"
                      style={{
                        originX: 0.5,
                        originY: 0.5,
                        left: `${(clickOrigins[hobby.id]?.x || 0.5) * 100}%`,
                        top: `${(clickOrigins[hobby.id]?.y || 0.5) * 100}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  )}
                </AnimatePresence>

                <div
                  className={cn(
                    "h-2 transition-all duration-700",
                    hobby.todayStatus === "done"
                      ? "bg-gradient-to-r from-green-400 to-emerald-500"
                      : hobby.todayStatus === "skipped"
                        ? "bg-gradient-to-r from-slate-400 to-slate-500"
                        : "bg-gradient-to-r from-amber-300 to-amber-400",
                  )}
                />
                <CardHeader className="pb-2 relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle
                        className={cn(
                          "text-xl transition-colors duration-500",
                          hobby.todayStatus === "done"
                            ? "text-emerald-900 dark:text-emerald-300"
                            : hobby.todayStatus === "skipped"
                              ? "text-slate-700 dark:text-slate-300"
                              : "",
                        )}
                      >
                        {hobby.name}
                      </CardTitle>
                      <p
                        className={cn(
                          "text-sm transition-colors duration-500",
                          hobby.todayStatus === "done"
                            ? "text-emerald-700/70 dark:text-emerald-400/70"
                            : hobby.todayStatus === "skipped"
                              ? "text-slate-600/70 dark:text-slate-400/70"
                              : "text-muted-foreground",
                        )}
                      >
                        {"Category"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8 transition-colors duration-500",
                        hobby.todayStatus === "done"
                          ? "text-emerald-700 hover:text-emerald-900 hover:bg-emerald-200/50 dark:text-emerald-400 dark:hover:bg-emerald-800/30"
                          : hobby.todayStatus === "skipped"
                            ? "text-slate-600 hover:text-slate-800 hover:bg-slate-300/50 dark:text-slate-400 dark:hover:bg-slate-700/30"
                            : "text-muted-foreground",
                      )}
                      onClick={() => deleteHobby(hobby.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pb-2 relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar
                      className={cn(
                        "h-4 w-4 transition-colors duration-500",
                        hobby.todayStatus === "done"
                          ? "text-emerald-700/70 dark:text-emerald-400/70"
                          : hobby.todayStatus === "skipped"
                            ? "text-slate-600/70 dark:text-slate-400/70"
                            : "text-muted-foreground",
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm transition-colors duration-500",
                        hobby.todayStatus === "done"
                          ? "text-emerald-700/70 dark:text-emerald-400/70"
                          : hobby.todayStatus === "skipped"
                            ? "text-slate-600/70 dark:text-slate-400/70"
                            : "text-muted-foreground",
                      )}
                    >
                      {format(new Date(hobby.createdAt!), "EEEE, MMMM d")}
                    </span>
                  </div>

                  <div className="relative">
                    {/* Status animation container */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <AnimatePresence>
                        {hobby.todayStatus === "done" && (
                          <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={confettiVariants}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            {Array.from({ length: 20 }).map((_, i) => (
                              <motion.div
                                key={i}
                                variants={confettiItemVariants}
                                className="absolute"
                                style={{
                                  top: `${Math.random() * 100}%`,
                                  left: `${Math.random() * 100}%`,
                                  width: `${Math.random() * 8 + 4}px`,
                                  height: `${Math.random() * 8 + 4}px`,
                                  backgroundColor: [
                                    "#10B981",
                                    "#3B82F6",
                                    "#EC4899",
                                    "#F59E0B",
                                    "#8B5CF6",
                                  ][Math.floor(Math.random() * 5)],
                                  borderRadius: "50%",
                                }}
                              />
                            ))}
                          </motion.div>
                        )}

                        {hobby.todayStatus === "skipped" && (
                          <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={rainVariants}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            {Array.from({ length: 15 }).map((_, i) => (
                              <motion.div
                                key={i}
                                variants={rainDropVariants}
                                className="absolute bg-slate-400 dark:bg-slate-600 rounded-full w-1 h-3"
                                style={{
                                  top: `${Math.random() * 100}%`,
                                  left: `${Math.random() * 100}%`,
                                }}
                              />
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="flex gap-3 justify-center">
                      <AnimatedButton
                        variant="done"
                        active={hobby.todayStatus === "done"}
                        onClick={(e) => markHobbyStatus(hobby.id, "done", e)}
                      >
                        <Sparkles
                          className={cn(
                            "h-4 w-4",
                            hobby.todayStatus === "done"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-slate-500 dark:text-slate-400",
                          )}
                        />
                        <span>Done</span>
                      </AnimatedButton>

                      <AnimatedButton
                        variant="skip"
                        active={hobby.todayStatus === "skipped"}
                        onClick={(e) => markHobbyStatus(hobby.id, "skipped", e)}
                      >
                        <CloudRain
                          className={cn(
                            "h-4 w-4",
                            hobby.todayStatus === "skipped"
                              ? "text-slate-600 dark:text-slate-400"
                              : "text-slate-400 dark:text-slate-500",
                          )}
                        />
                        <span>Skip</span>
                      </AnimatedButton>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col items-start pt-2 relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={cn(
                        "text-sm font-medium transition-colors duration-500",
                        hobby.todayStatus === "done"
                          ? "text-emerald-800 dark:text-emerald-300"
                          : hobby.todayStatus === "skipped"
                            ? "text-slate-700 dark:text-slate-300"
                            : "",
                      )}
                    >
                      Current streak:
                    </div>
                    <div
                      className={cn(
                        "px-2 py-0.5 rounded text-sm font-medium",
                        hobby.streak > 0
                          ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400",
                      )}
                    >
                      {hobby.streak} {hobby.streak === 1 ? "day" : "days"}
                    </div>
                  </div>

                  <div className="w-full">
                    <div
                      className={cn(
                        "text-sm font-medium mb-2 transition-colors duration-500",
                        hobby.todayStatus === "done"
                          ? "text-emerald-800 dark:text-emerald-300"
                          : hobby.todayStatus === "skipped"
                            ? "text-slate-700 dark:text-slate-300"
                            : "",
                      )}
                    >
                      Last 7 days:
                    </div>
                    <div className="flex justify-between w-full">
                      {hobby.completions.slice(0, 7).map((day, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center mb-1",
                              day.completed
                                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500",
                            )}
                          >
                            {day.completed ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </div>
                          <span
                            className={cn(
                              "text-xs transition-colors duration-500",
                              hobby.todayStatus === "done"
                                ? "text-emerald-700 dark:text-emerald-400"
                                : hobby.todayStatus === "skipped"
                                  ? "text-slate-600 dark:text-slate-400"
                                  : "text-slate-500 dark:text-slate-400",
                            )}
                          >
                            {format(day.date, "E").charAt(0)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {hobbies.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 text-slate-400 dark:text-slate-500"
        >
          <div className="mb-4">
            <Calendar className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="text-xl font-medium mb-2">No hobbies added yet</h3>
          <p>
            Click the "Add Hobby" button to start tracking your daily
            activities.
          </p>
        </motion.div>
      )}
    </div>
  );
}
