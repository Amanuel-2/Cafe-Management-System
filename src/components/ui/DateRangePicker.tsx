import { useState, useEffect, useCallback } from 'react';
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
  { label: 'Last Month', getRange: getLastMonthRange },
  { label: 'This Year', getRange: getThisYearRange },
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

const isSameDay = (d1: Date, d2: Date) => {
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
};

export function DateRangePicker() {
  const { dateRange, setDateRange, setCustomSingleDate } = useAnalyticsStore();
  const [isOpen, setIsOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date(dateRange.start));
  const today = new Date();

  const days = getDaysInMonth(calendarMonth);

  const isDateInRange = (date: Date) => {
    return date >= dateRange.start && date <= dateRange.end;
  };

  const isDateSelected = (date: Date) => {
    return (
      isSameDay(date, dateRange.start) ||
      isSameDay(date, dateRange.end)
    );
  };

  const isToday = (date: Date) => isSameDay(date, today);

  const prevMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1));
  };

  const handleClose = useCallback(() => setIsOpen(false), []);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent background scroll
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleClose]);

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
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={handleClose}
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <Card className="pointer-events-auto w-full max-w-3xl overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-800">
                  <h2 className="text-xl font-bold text-stone-900 dark:text-white">Select Date Range</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Modal Body */}
                <div className="flex flex-col md:flex-row">
                  {/* Shortcuts */}
                  <div className="p-4 border-b md:border-b-0 md:border-r border-stone-200 dark:border-stone-800 md:w-64">
                    <h3 className="text-sm font-semibold text-stone-500 dark:text-stone-400 mb-3">Quick Select</h3>
                    <div className="space-y-1">
                      {SHORTCUTS.map((shortcut) => (
                        <Button
                          key={shortcut.label}
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDateRange(shortcut.getRange());
                            setCalendarMonth(shortcut.getRange().start);
                            handleClose();
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
                    <div className="flex items-center justify-between mb-6">
                      <Button variant="ghost" size="icon" onClick={prevMonth}>
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                      <h3 className="text-lg font-semibold text-stone-900 dark:text-white">
                        {calendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </h3>
                      <Button variant="ghost" size="icon" onClick={nextMonth}>
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-7 gap-2 mb-4">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                        <div
                          key={d}
                          className="text-center text-xs font-semibold text-stone-500 dark:text-stone-400 py-2"
                        >
                          {d}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                      {days.map(({ date, isCurrentMonth }, index) => (
                        <button
                          key={index}
                          className={`
                            h-10 w-10 rounded-full text-sm font-medium flex items-center justify-center transition-all relative
                            ${!isCurrentMonth ? 'text-stone-300 dark:text-stone-600' : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'}
                            ${isDateInRange(date) ? 'bg-stone-100 dark:bg-stone-800' : ''}
                            ${isDateSelected(date) ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900' : ''}
                          `}
                          onClick={() => {
                            setCustomSingleDate(date);
                            handleClose();
                          }}
                        >
                          {date.getDate()}
                          {isToday(date) && (
                            <div className={`
                              absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full
                              ${isDateSelected(date) ? 'bg-white dark:bg-stone-900' : 'bg-amber-500'}
                            `} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
