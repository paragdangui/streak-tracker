<script setup lang="ts">
import { storeToRefs } from 'pinia';
import StreakActions from '~/components/streak/dashboard/StreakActions.vue';
import StreakCurrentDate from '~/components/streak/dashboard/StreakCurrentDate.vue';
import StreakSimulationBanner from '~/components/streak/dashboard/StreakSimulationBanner.vue';
import StreakValue from '~/components/streak/dashboard/StreakValue.vue';
import StreakCalendar from '~/components/streak/calendar/StreakCalendar.vue';
import { useStreaksStore } from '~/stores/streaks';

const streaksStore = useStreaksStore();
const { currentStreak, currentDateFormatted, isSimulated, isTodayMarked } =
  storeToRefs(streaksStore);

const handleMarkToday = () => streaksStore.markToday();
const handleUndoToday = () => streaksStore.undoToday();
</script>

<template>
  <div
    class="animated-gradient min-h-screen flex flex-col items-center justify-center text-white font-sans px-4 py-10"
  >
    <div class="text-center w-full max-w-2xl">
      <ClientOnly>
        <StreakSimulationBanner v-if="isSimulated" />
        <StreakCurrentDate :date="currentDateFormatted" />
      </ClientOnly>

      <StreakValue :streak="currentStreak" class="mt-6" />

      <ClientOnly>
        <StreakActions
          :is-today-marked="isTodayMarked"
          class="mt-8"
          @mark-today="handleMarkToday"
          @undo-today="handleUndoToday"
        />
      </ClientOnly>
    </div>

    <section class="w-full max-w-4xl my-16">
      <ClientOnly>
        <StreakCalendar />
      </ClientOnly>
    </section>
  </div>
</template>
