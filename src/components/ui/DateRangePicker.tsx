import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { useAnalyticsStore, getTodayRange, getYesterdayRange, getThisWeekRange, getLastWeekRange, getThisMonthRange, getLastMonthRange, getThisYearRange } from '../../store/analyticsStore';

const SHORTCUTS = [
  { label: 'Today', getRange: getTodayRange },
  { label: 'Yesterday', getRange: getYesterdayRange },
  { label: 'This Week', getRange: getThisWeekRange },
  { label: 'Last Week', getRange: getLastWeekRange },
  { label: 'This Month', getRange: getThisMonthRange },
  { label: 'Last Month', getLastMonthRange },
  { label: 'This Year', getThisYearRange },
];

const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];

  // Previous month days
  const prevMonth = new Date(year, month, 0);
  const daysInPrevMonth = prevMonth.getDate();
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    });
  }

  // Next month days
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
    });
  }

  return days;
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export function DateRangePicker() {
  const { dateRange, setDateRange, setCustomSingleDate } = useAnalyticsStore();
  const [isOpen, setIsOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date(dateRange.start));

  const days = getDaysInMonth(calendarMonth);

  const isDateInRange = (date: Date) => {
    return date >= dateRange.start && date <= dateRange.end;
  };

  const isDateSelected = (date: Date) => {
    return (
      date.toDateString() === dateRange.start.toDateString() ||
      date.toDateString() === dateRange.end.toDateString()
    );
  };

  const prevMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1));
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="w-full md:w-auto justify-between text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>
            {dateRange.type === 'custom-single'
              ? formatDate(dateRange.start)
              : `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`}
          </span>
        </div>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute z-50 mt-2 w-[340px] md:w-[680px] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xl"
            >
              <div className="flex flex-col md:flex-row">
                {/* Shortcuts */}
                <div className="p-4 border-b md:border-b-0 md:border-r border-stone-200 dark:border-stone-800">
                  <h3 className="text-sm font-semibold text-stone-500 dark:text-stone-400 mb-2">Quick Select</h3>
                  <div className="flex flex-wrap gap-2 md:flex-col">
                    {SHORTCUTS.map((shortcut) => (
                      <Button
                        key={shortcut.label}
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDateRange(shortcut.getRange());
                          setIsOpen(false);
                        }}
                        className="w-full justify-start"
                      >
                        {shortcut.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Calendar */}
                <div className="p-4 flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <Button variant="ghost" size="icon" onClick={prevMonth}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <h3 className="text-lg font-semibold text-stone-900 dark:text-white">
                      {calendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h3>
                    <Button variant="ghost" size="icon" onClick={nextMonth}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                      <div
                        key={d}
                        className="text-center text-xs font-semibold text-stone-500 dark:text-stone-400 py-1"
                      >
                        {d}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {days.map(({ date, isCurrentMonth }, index) => (
                      <button
                        key={index}
                        className={`h-9 w-9 rounded-full text-sm flex items-center justify-center transition-all
                          ${!isCurrentMonth ? 'text-stone-300 dark:text-stone-600' : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'}
                          ${isDateInRange(date) ? 'bg-stone-100 dark:bg-stone-800' : ''}
                          ${isDateSelected(date) ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900' : ''}
                        `}
                        onClick={() => {
                          setCustomSingleDate(date);
                          setIsOpen(false);
                        }}
                      >
                        {date.getDate()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
