import { Calendar as CalendarIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./Button";
import { Input } from "./Input";

function getDaysInMonth(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const days = [];
  
  // Add previous month days
  const prevMonth = new Date(year, month, 0);
  const daysInPrevMonth = prevMonth.getDate();
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      isCurrentMonth: false,
    });
  }
  
  // Add current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    });
  }
  
  // Add next month days
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
    });
  }
  
  return days;
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-ET', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

export function DatePicker({ 
  selected, 
  onChange 
}: { 
  selected?: Date;
  onChange: (date: Date) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(selected || new Date());
  const daysInMonth = getDaysInMonth(currentMonth);

  const toggle = () => setIsOpen(!isOpen);
  
  const handleDayClick = (date: Date) => {
    onChange(date);
    setIsOpen(false);
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };
  
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  return (
    <div className="relative">
      <Button 
        variant="outline" 
        className="w-full justify-start text-left" 
        onClick={toggle}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {selected ? formatDate(selected) : 'Pick a date'}
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 mt-2 w-80 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="icon" onClick={prevMonth}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </Button>
              <h3 className="text-lg font-semibold">
                {currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}
              </h3>
              <Button variant="ghost" size="icon" onClick={nextMonth}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </Button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                <div key={d} className="text-center text-xs font-semibold text-stone-500 dark:text-stone-400 py-2">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {daysInMonth.map(({ date, isCurrentMonth }, index) => (
                <button
                  key={index}
                  className={`h-9 w-9 rounded-full text-sm flex items-center justify-center transition-colors
                    ${!isCurrentMonth ? 'text-stone-300 dark:text-stone-600' : 'hover:bg-stone-100 dark:hover:bg-stone-800'}
                    ${selected && isSameDay(date, selected) ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900' : ''}
                  `}
                  onClick={() => handleDayClick(date)}
                >
                  {date.getDate()}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
