"use client";

import type React from "react";

import { useEffect, useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Check, Calendar, Sparkles, CloudRain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "./card-date-picker";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast, Toaster } from "sonner";
import { addDays, format, formatISO, subDays } from "date-fns";
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

export type HobbyStatus = "done" | "skipped" | null;

export type HabitWithCompletions = Habit & {
  completions: Completion[];
  todayStatus?: "done" | "skipped" | null;
};

export interface DateDictionary {
  [date: string]: boolean;
}

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

const HobbyDashCard = memo(function HobbyDashCard({
  hobbyData,
  deleteHobby,
  markHobbyStatus,
}: {
  hobbyData: HabitWithCompletions;
  deleteHobby: (id: number) => void;
  markHobbyStatus: (id: number, status: HobbyStatus) => void;
}) {
  const [dateDictionary, setDateDictionary] = useState<DateDictionary>({});
  const [hobby, setHobby] = useState<HabitWithCompletions>(hobbyData);
  const setHobbyStatus = (status: HobbyStatus) => {
    setHobby((prev) => {
      return { ...prev, todayStatus: status };
    });
    markHobbyStatus(hobby.id, status);
  };
  const setTodayStatus = (status: HobbyStatus) => {
    setHobby((prev) => {
      return { ...prev, todayStatus: status };
    });
  };

  const today = new Date();

  useEffect(() => {
    setHobby((prev) => {
      const todayCompletion = prev.completions.find(
        (c) =>
          format(new Date(c.date), "yyyy-MM-dd") ===
          format(today, "yyyy-MM-dd"),
      );
      if (!todayCompletion?.completed) {
        return {
          ...prev,
          todayStatus: "skipped",
        };
      }

      return { ...prev, todayStatus: "done" };
    });
  }, []);

  console.log(hobby.name, hobby.todayStatus);

  useEffect(() => {
    let newDateDict: DateDictionary = {};
    hobby.completions.forEach((c) => {
      const date = format(new Date(c.date), "yyyy-MM-dd");
      const state = c.completed;
      newDateDict[date] = state;
    });
    setDateDictionary(newDateDict);
  }, []);
  return (
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
          />
        </AnimatePresence>

        {/* Radiating animation overlay */}

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
                onClick={(e) => setHobbyStatus("done")}
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
                onClick={(e) => setHobbyStatus("skipped")}
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
              <DatePicker
                DateDict={dateDictionary}
                setTodayStatusAction={setTodayStatus}
              />
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
});

export default function HobbyTracker({
  habits,
  today,
}: {
  habits: HabitWithCompletions[];
  today: string;
}) {
  const todayD = new Date(today);
  const session = useSession();
  const [hobbies, setHobbies] = useState<HabitWithCompletions[]>(habits);
  const [newHobby, setNewHobby] = useState("");
  const [newCategory, setNewCategory] = useState("General");
  const [showAddForm, setShowAddForm] = useState(false);

  const markHobbyStatus = (id: number, status: HobbyStatus) => {
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
    let chng = false;
    let yesterday = formatISO(subDays(new Date(today), 1), {
      representation: "date",
    });

    // TODO: Update Streak properly !
    let newHobbies = hobbies.map((hobby) => {
      if (hobby.id === id) {
        // If clicking the same status again, toggle it off
        if (hobby.todayStatus === status) {
          // hobby.completions[today.getDay()].completed = false;
          return hobby;
        }
        console.log(yesterday);
        let isPrevCompleted = hobby.completions.filter(
          (e) => formatISO(e.date, { representation: "date" }) == yesterday,
        );

        console.log(hobby.completions);

        chng = true;
        let newStreak = 0;
        if (isPrevCompleted.length > 0 && isPrevCompleted[0].completed)
          newStreak = hobby.streak;
        console.log("Previous Day", isPrevCompleted);
        // Calculate new streak
        if (status === "done") {
          hobby.completions[todayD.getDay()].completed = true;
          newStreak++;
          // toast.success("Hobby marked as done! 🎉");
        } else if (status === "skipped") {
          hobby.completions[todayD.getDay()].completed = false;
          newStreak = 0;
        }

        return {
          ...hobby,
          todayStatus: status,
          streak: newStreak,
        };
      }
      return hobby;
    });
    if (chng) {
      makeUpdateCompletionRequest();
      setHobbies(newHobbies);
    }
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
        const lastSat = subDays(today, todayD.getDay() % 7);
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
        // toast.success("Hobby removed successfully!");
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
            <HobbyDashCard
              key={hobby.id}
              hobbyData={hobby}
              deleteHobby={deleteHobby}
              markHobbyStatus={markHobbyStatus}
            />
          ))}
          <Toaster />
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
