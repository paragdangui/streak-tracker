<script setup lang="ts">
import type { YearMonthMeta } from '~/composables/useStreakCalendar';

const props = defineProps<{
  months: YearMonthMeta[];
  weekdayLabels: string[];
}>();

const emit = defineEmits<{
  (e: 'select-month', monthIndex: number): void;
}>();
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-3 gap-8">
    <div
      v-for="month in props.months"
      :key="month.monthIndex"
      class="text-center p-4 rounded-lg border transition-all duration-200 cursor-pointer"
      :class="
        month.isCurrent
          ? 'bg-blue-50 border-blue-300 hover:shadow-md hover:border-blue-400'
          : 'border-gray-200 hover:shadow-md hover:border-gray-300'
      "
      @click="emit('select-month', month.monthIndex)"
    >
      <h3 class="text-base font-bold text-gray-800 mb-4">
        {{ month.name }}
      </h3>

      <div class="grid grid-cols-7 gap-1 text-sm">
        <div
          v-for="day in props.weekdayLabels"
          :key="day"
          class="text-gray-500 text-center h-6 flex items-center justify-center font-medium"
        >
          {{ day }}
        </div>

        <div
          v-for="blank in month.blankDays"
          :key="'blank-' + blank"
          class="h-8"
        ></div>

        <div
          v-for="day in month.days"
          :key="day.day"
          class="relative h-8 flex items-center justify-center rounded-md text-sm transition-all duration-200"
          :class="day.classes"
          :title="day.tooltip"
        >
          <span class="relative z-10">{{ day.day }}</span>

          <div
            v-if="day.isCompleted"
            class="absolute top-0 bottom-0 left-0 right-0 bg-orange-500 rounded-md z-0"
          ></div>

          <div
            v-if="day.isToday"
            class="absolute top-0 bottom-0 left-0 right-0 rounded-md border-2 border-blue-500 z-20"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
