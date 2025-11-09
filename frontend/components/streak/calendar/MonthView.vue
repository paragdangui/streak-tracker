<script setup lang="ts">
import type { MonthDayMeta } from '~/composables/useStreakCalendar';

const props = defineProps<{
  weekdays: string[];
  blankDays: number;
  days: MonthDayMeta[];
}>();

const emit = defineEmits<{
  (e: 'select-day', day: number): void;
}>();
</script>

<template>
  <div>
    <div class="grid grid-cols-7 gap-1 mb-2">
      <div
        v-for="day in props.weekdays"
        :key="day"
        class="text-center text-sm font-semibold text-gray-600 py-2"
      >
        {{ day }}
      </div>
    </div>

    <div class="grid grid-cols-7 gap-1">
      <div v-for="blank in props.blankDays" :key="'blank-' + blank" class="h-10">
        <!-- Placeholder for offset days -->
      </div>

      <div
        v-for="day in props.days"
        :key="day.day"
        class="relative h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 cursor-pointer"
        :class="[day.classes, { 'animate-pulse': day.isToday }]"
        @click="emit('select-day', day.day)"
        :title="day.tooltip"
      >
        <span class="relative rounded-md z-10">{{ day.day }}</span>

        <div
          v-if="day.isCompleted"
          class="absolute"
          :class="day.indicatorClasses"
        ></div>

        <div
          v-if="day.isToday"
          class="absolute top-1 bottom-1 left-0 right-0 rounded-full border-4 z-20"
          :class="day.isCompleted ? 'border-blue-300' : 'border-blue-500'"
        ></div>
      </div>
    </div>
  </div>
</template>
