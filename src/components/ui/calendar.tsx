import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-5",
        caption: "flex justify-center pt-1 relative items-center h-10",
        caption_label: "text-base font-heading font-semibold tracking-wide capitalize",
        nav: "space-x-2 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 text-muted-foreground hover:text-foreground hover:bg-accent/10 rounded-xl transition-all",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell: "text-muted-foreground/70 rounded-lg w-10 font-medium text-xs uppercase tracking-wider",
        row: "flex w-full mt-1",
        cell: cn(
          "h-10 w-10 text-center text-sm p-0 relative rounded-xl",
          "[&:has([aria-selected].day-range-end)]:rounded-r-xl",
          "[&:has([aria-selected].day-outside)]:bg-accent/20",
          "[&:has([aria-selected])]:bg-accent/10",
          "first:[&:has([aria-selected])]:rounded-l-xl last:[&:has([aria-selected])]:rounded-r-xl",
          "focus-within:relative focus-within:z-20",
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-normal rounded-xl transition-all duration-200",
          "hover:bg-accent/10 hover:text-accent-foreground",
          "aria-selected:opacity-100",
        ),
        day_range_end: "day-range-end",
        day_selected: cn(
          "bg-accent text-accent-foreground font-semibold shadow-sm",
          "hover:bg-accent hover:text-accent-foreground",
          "focus:bg-accent focus:text-accent-foreground",
        ),
        day_today: "bg-muted font-semibold text-foreground",
        day_outside: "day-outside text-muted-foreground/40 aria-selected:bg-accent/20 aria-selected:text-muted-foreground aria-selected:opacity-40",
        day_disabled: "text-muted-foreground/30",
        day_range_middle: "aria-selected:bg-accent/15 aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
