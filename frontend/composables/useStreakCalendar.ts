import { computed, ref } from 'vue';
import { useStreaksStore } from '~/stores/streaks';

export const MONTH_WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const YEAR_WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export interface MonthDayMeta {
  day: number;
  classes: string;
  tooltip: string;
  isToday: boolean;
  isCompleted: boolean;
  indicatorClasses: string;
}

export interface YearDayMeta {
  day: number;
  classes: string;
  tooltip: string;
  isToday: boolean;
  isCompleted: boolean;
}

export interface YearMonthMeta {
  monthIndex: number;
  name: string;
  blankDays: number;
  days: YearDayMeta[];
  isCurrent: boolean;
}

const buildDate = (year: number, month: number, day: number) => {
  const date = new Date(year, month, day);
  date.setHours(0, 0, 0, 0);
  return date;
};

const areSameDay = (a: Date, b: Date) => {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

export const useStreakCalendar = () => {
  const streaksStore = useStreaksStore();
  const currentDate = ref(new Date());
  const isYearView = ref(false);

  const today = computed(() => streaksStore.todayDate);

  const earliestStreakDate = computed(() => {
    if (!streaksStore.streaks.length) {
      return null;
    }
    return streaksStore.streaks
      .map((streak) => {
        const date = new Date(streak.completion_date);
        date.setHours(0, 0, 0, 0);
        return date;
      })
      .sort((a, b) => a.getTime() - b.getTime())[0];
  });

  const monthYear = computed(() =>
    currentDate.value.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    }),
  );

  const headerTitle = computed(() =>
    isYearView.value
      ? currentDate.value.getFullYear().toString()
      : monthYear.value,
  );

  const completedDaysInMonth = computed(() => {
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth();
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);

    return streaksStore.streaks.filter((streak) => {
      const streakDate = new Date(streak.completion_date);
      return streakDate >= startOfMonth && streakDate <= endOfMonth;
    }).length;
  });

  const headerSubtitle = computed(() => {
    if (isYearView.value) {
      const year = currentDate.value.getFullYear();
      const totalDaysInYear = streaksStore.streaks.filter((streak) => {
        const streakDate = new Date(streak.completion_date);
        return streakDate.getFullYear() === year;
      }).length;
      return `${totalDaysInYear} days completed`;
    }
    return `${completedDaysInMonth.value} days completed`;
  });

  const daysInMonth = computed(() => {
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth();
    return new Date(year, month + 1, 0).getDate();
  });

  const blankDays = computed(() => {
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  });

  const isDateCompleted = (date: Date) => {
    return streaksStore.streaks.some((streak) => {
      const streakDate = new Date(streak.completion_date);
      return areSameDay(streakDate, date);
    });
  };

  const isDayCompleted = (day: number) => {
    const date = buildDate(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth(),
      day,
    );
    return isDateCompleted(date);
  };

  const isDayToday = (day: number) => {
    const date = buildDate(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth(),
      day,
    );
    return areSameDay(today.value, date);
  };

  const isPartOfCurrentStreak = (day: number) => {
    if (!isDayCompleted(day) || streaksStore.currentStreak === 0) {
      return false;
    }

    const date = buildDate(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth(),
      day,
    );

    const streakStartDate = new Date(today.value);
    streakStartDate.setDate(
      streakStartDate.getDate() - streaksStore.currentStreak + 1,
    );

    return date >= streakStartDate && date <= today.value;
  };

  const getDayClasses = (day: number) => {
    const classes: string[] = [];
    if (isDayCompleted(day)) {
      classes.push('text-white font-semibold');
      if (isPartOfCurrentStreak(day)) {
        classes.push('hover:scale-105');
      }
    } else {
      classes.push('text-gray-700 hover:bg-gray-100');
      if (isDayToday(day)) {
        classes.push('font-semibold');
      }
    }
    return classes.join(' ');
  };

  const getDayCompletionIndicator = (day: number) => {
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth();
    const date = new Date(year, month, day);

    const dayOfWeek = date.getDay();
    const isMonday = dayOfWeek === 1;
    const isSunday = dayOfWeek === 0;
    const prevCompleted = !isMonday && isDayCompleted(day - 1);
    const nextCompleted = !isSunday && isDayCompleted(day + 1);

    const classes: string[] = ['bg-orange-500', 'top-1', 'bottom-1', 'z-0'];
    classes.push(prevCompleted ? '-left-1' : 'left-0');
    classes.push(nextCompleted ? '-right-1' : 'right-0');

    if (!prevCompleted) classes.push('rounded-l-full');
    if (!nextCompleted) classes.push('rounded-r-full');

    return classes.join(' ');
  };

  const getDayTooltip = (day: number) => {
    const date = buildDate(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth(),
      day,
    );

    const dateStr = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    if (isDayToday(day)) {
      return `Today - ${dateStr}`;
    }
    if (isDayCompleted(day)) {
      if (isPartOfCurrentStreak(day)) {
        return `Streak day - ${dateStr}`;
      }
      return `Completed - ${dateStr}`;
    }
    return dateStr;
  };

  const monthDays = computed<MonthDayMeta[]>(() => {
    return Array.from({ length: daysInMonth.value }, (_, index) => {
      const day = index + 1;
      const completed = isDayCompleted(day);
      return {
        day,
        classes: getDayClasses(day),
        tooltip: getDayTooltip(day),
        isToday: isDayToday(day),
        isCompleted: completed,
        indicatorClasses: completed ? getDayCompletionIndicator(day) : '',
      };
    });
  });

  const onDayClick = (day: number) => {
    if (!isDayToday(day)) {
      return;
    }
    if (isDayCompleted(day)) {
      streaksStore.undoToday();
    } else {
      streaksStore.markToday();
    }
  };

  const canGoToPreviousMonth = computed(() => {
    const previousMonth = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() - 1,
      1,
    );

    if (!earliestStreakDate.value) {
      const twoYearsAgo = new Date(
        today.value.getFullYear() - 2,
        today.value.getMonth(),
        1,
      );
      return previousMonth >= twoYearsAgo;
    }

    const earliestMonth = new Date(
      earliestStreakDate.value.getFullYear(),
      earliestStreakDate.value.getMonth(),
      1,
    );
    return previousMonth >= earliestMonth;
  });

  const canGoToNextMonth = computed(() => {
    const nextMonth = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() + 1,
      1,
    );

    return (
      nextMonth.getFullYear() < today.value.getFullYear() ||
      (nextMonth.getFullYear() === today.value.getFullYear() &&
        nextMonth.getMonth() <= today.value.getMonth())
    );
  });

  const canGoToPreviousYear = computed(() => {
    const previousYear = currentDate.value.getFullYear() - 1;
    if (!earliestStreakDate.value) {
      return previousYear >= today.value.getFullYear() - 5;
    }
    return previousYear >= earliestStreakDate.value.getFullYear();
  });

  const canGoToNextYear = computed(() => {
    return currentDate.value.getFullYear() + 1 <= today.value.getFullYear();
  });

  const getMonthName = (monthIndex: number) => {
    const date = new Date(currentDate.value.getFullYear(), monthIndex, 1);
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  const getDaysInMonthForYear = (monthIndex: number) => {
    const year = currentDate.value.getFullYear();
    return new Date(year, monthIndex + 1, 0).getDate();
  };

  const getBlankDaysForMonth = (monthIndex: number) => {
    const year = currentDate.value.getFullYear();
    const firstDay = new Date(year, monthIndex, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const isYearDayToday = (monthIndex: number, day: number) => {
    const date = buildDate(currentDate.value.getFullYear(), monthIndex, day);
    return areSameDay(today.value, date);
  };

  const isYearDayCompleted = (monthIndex: number, day: number) => {
    const date = buildDate(currentDate.value.getFullYear(), monthIndex, day);
    return isDateCompleted(date);
  };

  const getYearDayClasses = (monthIndex: number, day: number) => {
    const classes: string[] = [];
    if (isYearDayCompleted(monthIndex, day)) {
      classes.push('text-white font-semibold');
    } else {
      classes.push('text-gray-600 hover:bg-gray-100');
      if (isYearDayToday(monthIndex, day)) {
        classes.push('font-semibold');
      }
    }
    return classes.join(' ');
  };

  const getYearDayTooltip = (monthIndex: number, day: number) => {
    const date = buildDate(currentDate.value.getFullYear(), monthIndex, day);
    const dateStr = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    if (isYearDayToday(monthIndex, day)) {
      return `Today - ${dateStr}`;
    }
    if (isYearDayCompleted(monthIndex, day)) {
      return `Completed - ${dateStr}`;
    }
    return dateStr;
  };

  const isCurrentMonth = (monthIndex: number) => {
    return (
      today.value.getFullYear() === currentDate.value.getFullYear() &&
      today.value.getMonth() === monthIndex
    );
  };

  const yearMonths = computed<YearMonthMeta[]>(() => {
    return Array.from({ length: 12 }, (_, index) => {
      const daysInMonthForYear = getDaysInMonthForYear(index);
      const days: YearDayMeta[] = Array.from(
        { length: daysInMonthForYear },
        (_, dayIndex) => {
          const day = dayIndex + 1;
          return {
            day,
            classes: getYearDayClasses(index, day),
            tooltip: getYearDayTooltip(index, day),
            isToday: isYearDayToday(index, day),
            isCompleted: isYearDayCompleted(index, day),
          };
        },
      );

      return {
        monthIndex: index,
        name: getMonthName(index),
        blankDays: getBlankDaysForMonth(index),
        days,
        isCurrent: isCurrentMonth(index),
      };
    });
  });

  const toggleView = () => {
    isYearView.value = !isYearView.value;
  };

  const selectMonth = (monthIndex: number) => {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      monthIndex,
      1,
    );
    isYearView.value = false;
  };

  const previousMonth = () => {
    if (!canGoToPreviousMonth.value) {
      return;
    }
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() - 1,
      1,
    );
  };

  const nextMonth = () => {
    if (!canGoToNextMonth.value) {
      return;
    }
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() + 1,
      1,
    );
  };

  const previousYear = () => {
    if (!canGoToPreviousYear.value) {
      return;
    }
    currentDate.value = new Date(
      currentDate.value.getFullYear() - 1,
      currentDate.value.getMonth(),
      1,
    );
  };

  const nextYear = () => {
    if (!canGoToNextYear.value) {
      return;
    }
    currentDate.value = new Date(
      currentDate.value.getFullYear() + 1,
      currentDate.value.getMonth(),
      1,
    );
  };

  return {
    isYearView,
    headerTitle,
    headerSubtitle,
    monthWeekdays: MONTH_WEEKDAYS,
    monthBlankDays: blankDays,
    monthDays,
    yearWeekdayLabels: YEAR_WEEKDAYS,
    yearMonths,
    canGoToPreviousMonth,
    canGoToNextMonth,
    canGoToPreviousYear,
    canGoToNextYear,
    toggleView,
    selectMonth,
    previousMonth,
    nextMonth,
    previousYear,
    nextYear,
    onDayClick,
  };
};
