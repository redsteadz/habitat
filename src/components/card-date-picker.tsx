"use client";

import type React from "react";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function DatePicker() {
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

    for (let i = -14; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      datesArray.push(date);
    }

    setDates(datesArray);
  }, []);

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
      const dateIndex = Number.parseInt(
        closestElement.getAttribute("data-index") || "0",
      );
      setSelectedDate(dates[dateIndex]);
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(date);
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

    const newIndex =
      direction === "left"
        ? Math.max(0, currentIndex - 1)
        : Math.min(dates.length - 1, currentIndex + 1);

    const dateElements =
      scrollContainerRef.current.querySelectorAll(".date-item");

    if (dateElements[newIndex]) {
      const containerWidth = scrollContainerRef.current.offsetWidth;
      const elementWidth = dateElements[newIndex].clientWidth;

      const scrollPosition =
        dateElements[newIndex].getBoundingClientRect().left +
        scrollContainerRef.current.scrollLeft -
        containerWidth / 2 +
        elementWidth / 2;

      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });

      setSelectedDate(dates[newIndex]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scrollToDate("left")}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-center font-medium">
          {selectedDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scrollToDate("right")}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div
        className="relative overflow-hidden"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchEnd={handleMouseUp}
      >
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/20 z-10" />

        <div
          ref={scrollContainerRef}
          className={cn(
            "flex overflow-x-auto scrollbar-hide py-4 px-4 snap-x snap-mandatory",
            isDragging ? "cursor-grabbing" : "cursor-grab",
          )}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {dates.map((date, index) => (
            <div
              key={index}
              data-index={index}
              className={cn(
                "date-item flex-shrink-0 mx-2 w-16 h-20 flex flex-col items-center justify-center rounded-lg snap-center transition-all duration-200 ease-out",
                selectedDate.getDate() === date.getDate() &&
                  selectedDate.getMonth() === date.getMonth() &&
                  selectedDate.getFullYear() === date.getFullYear()
                  ? "bg-primary text-primary-foreground scale-110 shadow-md"
                  : "bg-muted hover:bg-muted/80",
              )}
            >
              <div className="text-xs font-medium">
                {date.toLocaleDateString("en-US", { weekday: "short" })}
              </div>
              <div
                className={cn(
                  "text-2xl font-bold",
                  isToday(date) &&
                    selectedDate.getDate() !== date.getDate() &&
                    "text-primary",
                )}
              >
                {date.getDate()}
              </div>
              <div className="text-xs">
                {date.toLocaleDateString("en-US", { month: "short" })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
