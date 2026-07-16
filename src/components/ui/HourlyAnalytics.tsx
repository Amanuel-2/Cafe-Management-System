import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useAnalyticsStore, type TimePeriodType } from '../../store/analyticsStore';
import { getOrdersByHour, getActivityLevel } from '../../utils/analytics';
import { useOrderStore } from '../../store/orderStore';

const periodLabels: Record<TimePeriodType, string> = {
  'full-day': 'Full Day',
  'morning': 'Morning (06:00-11:59)',
  'lunch': 'Lunch (12:00-14:59)',
  'afternoon': 'Afternoon (15:00-17:59)',
  'evening': 'Evening (18:00-22:00)',
};

const periodButtons: { value: TimePeriodType; label: string }[] = [
  { value: 'full-day', label: 'Full Day' },
  { value: 'morning', label: 'Morning' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
];

export const HourlyAnalytics = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const orders = useOrderStore((state) => state.orders);
  const { dateRange, selectedHour, selectedPeriod, setSelectedHour, setSelectedPeriod } = useAnalyticsStore();
  const ordersInDateRange = getOrdersByHour(orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= dateRange.start && orderDate <= dateRange.end;
  }));

  return (
    <div className="space-y-4">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 transition-all"
      >
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        <span className="text-sm font-semibold">Hourly Analytics</span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Period Buttons */}
            <div className="flex flex-wrap gap-2">
              {periodButtons.map((period) => (
                <button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedPeriod === period.value && selectedHour === null
                      ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900'
                      : 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>

            {/* Hourly Timeline */}
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-2 min-w-max">
                {ordersInDateRange.map((hourData) => {
                  const activity = getActivityLevel(hourData.count);
                  const isSelected = selectedHour === hourData.hour;

                  return (
                    <motion.button
                      key={hourData.hour}
                      onClick={() => setSelectedHour(hourData.hour)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        flex flex-col items-center justify-center min-w-[72px] p-3 rounded-lg border-2 transition-all
                        ${isSelected ? 'border-stone-900 dark:border-white' : 'border-transparent'}
                        ${activity.bgColor}
                        ${activity.color}
                      `}
                    >
                      <span className="text-sm font-semibold">{hourData.hour.toString().padStart(2, '0')}:00</span>
                      <span className="text-xs font-medium">{hourData.count}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
