"use client";

import type React from "react";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  DateDictionary,
  HobbyStatus,
  HabitWithCompletions,
} from "./hobby-tracker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export function DatePicker({
  DateDict,
  setTodayStatusAction,
}: {
  DateDict: DateDictionary;
  setTodayStatusAction: (status: HobbyStatus) => void;
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dates, setDates] = useState<Date[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Generate dates (14 days before and after today)
  useEffect(() => {
    const datesArray: Date[] = [];
    const today = new Date();

    for (let i = -14; i <= 2; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      datesArray.push(date);
    }

    setDates(datesArray);
  }, []);
  const setTodaysDate = (index: number) => {
    const date_str = format(dates[index], "yyyy-MM-dd");
    console.log(date_str);
    console.log(DateDict[date_str]);
    if (DateDict[date_str] === true) {
      setTodayStatusAction("done");
    } else {
      setTodayStatusAction("skipped");
    }
    setSelectedDate(dates[index]);
  };
  // Scroll to center on initial load
  useEffect(() => {
    if (scrollContainerRef.current && dates.length > 0) {
      // Find the middle element
      const middleIndex = Math.floor(dates.length / 2);
      const dateElements =
        scrollContainerRef.current.querySelectorAll(".date-item");

      if (dateElements[middleIndex]) {
        const containerWidth = scrollContainerRef.current.offsetWidth;
        const elementWidth = dateElements[middleIndex].clientWidth;

        // Calculate the scroll position to center the element
        const scrollPosition =
          dateElements[middleIndex].getBoundingClientRect().left +
          scrollContainerRef.current.scrollLeft -
          containerWidth / 2 +
          elementWidth / 2;

        scrollContainerRef.current.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }
    }
  }, [dates]);

  // Handle scroll to update selected date
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const containerCenter = container.offsetWidth / 2;
    const dateElements = container.querySelectorAll(".date-item");

    let closestElement = null;
    let minDistance = Number.POSITIVE_INFINITY;

    dateElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const elementCenter = rect.left + rect.width / 2;
      const containerRect = container.getBoundingClientRect();
      const distance = Math.abs(
        containerRect.left + containerCenter - elementCenter,
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestElement = element;
      }
    });

    if (closestElement) {
      const index = Number.parseInt(
        closestElement.getAttribute("data-index") || "0",
      );
      setTodaysDate(index);
    }
  };

  // Mouse/touch event handlers for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current!.offsetLeft);
    setScrollLeft(scrollContainerRef.current!.scrollLeft);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current!.offsetLeft);
    setScrollLeft(scrollContainerRef.current!.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current!.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    scrollContainerRef.current!.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollContainerRef.current!.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    scrollContainerRef.current!.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    handleScroll();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      handleScroll();
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const scrollToDate = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const currentIndex = dates.findIndex(
      (date) =>
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear(),
    );

    const index =
      direction === "left"
        ? Math.max(0, currentIndex - 1)
        : Math.min(dates.length - 1, currentIndex + 1);

    const dateElements =
      scrollContainerRef.current.querySelectorAll(".date-item");

    if (dateElements[index]) {
      const containerWidth = scrollContainerRef.current.offsetWidth;
      const elementWidth = dateElements[index].clientWidth;

      const scrollPosition =
        dateElements[index].getBoundingClientRect().left +
        scrollContainerRef.current.scrollLeft -
        containerWidth / 2 +
        elementWidth / 2;

      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setTodaysDate(index);
    }
  };

  // Add a click handler function for date selection
  const handleDateClick = (index: number) => {
    if (!scrollContainerRef.current) return;

    const dateElements =
      scrollContainerRef.current.querySelectorAll(".date-item");

    if (dateElements[index]) {
      const containerWidth = scrollContainerRef.current.offsetWidth;
      const elementWidth = dateElements[index].clientWidth;

      const scrollPosition =
        dateElements[index].getBoundingClientRect().left +
        scrollContainerRef.current.scrollLeft -
        containerWidth / 2 +
        elementWidth / 2;

      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setTodaysDate(index);
    }
  };

  // Update the return JSX to make text non-selectable and dates clickable
  return (
    <div className="w-full select-none">
      <div className="flex items-center justify-between mb-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scrollToDate("left")}
          className="h-6 w-6 p-0"
        >
          <ChevronLeft className="h-3 w-3" />
          <span className="sr-only">Previous day</span>
        </Button>
        <div className="text-center">
          <div className="text-xs font-medium text-muted-foreground">
            {selectedDate.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </div>
          <div className="text-sm font-medium">
            {selectedDate.toLocaleDateString("en-US", { weekday: "short" })}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scrollToDate("right")}
          className="h-6 w-6 p-0"
        >
          <ChevronRight className="h-3 w-3" />
          <span className="sr-only">Next day</span>
        </Button>
      </div>

      <div
        className="relative overflow-hidden"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchEnd={handleMouseUp}
      >
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/10 z-10" />

        <div
          ref={scrollContainerRef}
          className={cn(
            "flex overflow-x-auto scrollbar-hide py-2 px-2 snap-x snap-mandatory",
            isDragging ? "cursor-grabbing" : "cursor-grab",
          )}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {dates.map((date, index) => {
            const isSelected =
              selectedDate.getDate() === date.getDate() &&
              selectedDate.getMonth() === date.getMonth() &&
              selectedDate.getFullYear() === date.getFullYear();

            return (
              <div
                key={index}
                data-index={index}
                onClick={() => !isDragging && handleDateClick(index)}
                className={cn(
                  "date-item flex-shrink-0 mx-1 w-8 h-8 flex flex-col items-center justify-center rounded-full snap-center transition-all duration-200 ease-out",
                  isSelected
                    ? "bg-primary/10 text-primary font-medium scale-105"
                    : "hover:bg-muted/80",
                  isToday(date) && !isSelected && "text-primary font-medium",
                  "cursor-pointer select-none",
                )}
              >
                <div className="text-sm">{date.getDate()}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
