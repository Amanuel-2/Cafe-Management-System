import { create } from 'zustand';

export type DateRangeType = 'today' | 'yesterday' | 'this-week' | 'last-week' | 'this-month' | 'last-month' | 'this-year' | 'custom-single' | 'custom-range';

interface DateRange {
  start: Date;
  end: Date;
  type: DateRangeType;
}

interface AnalyticsStore {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  setCustomSingleDate: (date: Date) => void;
  setCustomRange: (start: Date, end: Date) => void;
}

const getTodayRange = (): DateRange => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end, type: 'today' };
};

const getYesterdayRange = (): DateRange => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const start = new Date(yesterday);
  start.setHours(0, 0, 0, 0);
  const end = new Date(yesterday);
  end.setHours(23, 59, 59, 999);
  return { start, end, type: 'yesterday' };
};

const getThisWeekRange = (): DateRange => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const start = new Date(now.setDate(diff));
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end, type: 'this-week' };
};

const getLastWeekRange = (): DateRange => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const start = new Date(now.setDate(diff - 7));
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end, type: 'last-week' };
};

const getThisMonthRange = (): DateRange => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end, type: 'this-month' };
};

const getLastMonthRange = (): DateRange => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth(), 0);
  end.setHours(23, 59, 59, 999);
  return { start, end, type: 'last-month' };
};

const getThisYearRange = (): DateRange => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now.getFullYear(), 11, 31);
  end.setHours(23, 59, 59, 999);
  return { start, end, type: 'this-year' };
};

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  dateRange: getTodayRange(),
  setDateRange: (range) => set({ dateRange: range }),
  setCustomSingleDate: (date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    set({ dateRange: { start, end, type: 'custom-single' } });
  },
  setCustomRange: (start, end) => {
    const s = new Date(start);
    s.setHours(0, 0, 0, 0);
    const e = new Date(end);
    e.setHours(23, 59, 59, 999);
    set({ dateRange: { start: s, end: e, type: 'custom-range' } });
  },
}));

export {
  getTodayRange,
  getYesterdayRange,
  getThisWeekRange,
  getLastWeekRange,
  getThisMonthRange,
  getLastMonthRange,
  getThisYearRange,
};
