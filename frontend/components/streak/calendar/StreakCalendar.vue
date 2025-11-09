<script setup lang="ts">
import CalendarHeader from '~/components/streak/calendar/CalendarHeader.vue';
import CalendarToggle from '~/components/streak/calendar/CalendarToggle.vue';
import CalendarLegend from '~/components/streak/calendar/CalendarLegend.vue';
import MonthView from '~/components/streak/calendar/MonthView.vue';
import YearView from '~/components/streak/calendar/YearView.vue';
import { useStreakCalendar } from '~/composables/useStreakCalendar';

const {
  isYearView,
  headerTitle,
  headerSubtitle,
  monthWeekdays,
  monthBlankDays,
  monthDays,
  yearWeekdayLabels,
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
} = useStreakCalendar();
</script>

<template>
  <div
    class="bg-white text-gray-800 p-6 rounded-xl shadow-lg w-full mx-auto"
    :class="isYearView ? 'max-w-4xl' : 'max-w-md'"
  >
    <CalendarHeader
      :is-year-view="isYearView"
      :title="headerTitle"
      :subtitle="headerSubtitle"
      :can-go-to-previous-month="canGoToPreviousMonth"
      :can-go-to-next-month="canGoToNextMonth"
      :can-go-to-previous-year="canGoToPreviousYear"
      :can-go-to-next-year="canGoToNextYear"
      @previous-month="previousMonth"
      @next-month="nextMonth"
      @previous-year="previousYear"
      @next-year="nextYear"
    />

    <CalendarToggle :is-year-view="isYearView" @toggle="toggleView" />

    <MonthView
      v-if="!isYearView"
      :weekdays="monthWeekdays"
      :blank-days="monthBlankDays"
      :days="monthDays"
      @select-day="onDayClick"
    />

    <YearView
      v-else
      :months="yearMonths"
      :weekday-labels="yearWeekdayLabels"
      @select-month="selectMonth"
    />

    <CalendarLegend />
  </div>
</template>
