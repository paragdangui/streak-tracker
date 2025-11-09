<script setup lang="ts">
const props = defineProps<{
  isYearView: boolean;
  title: string;
  subtitle: string;
  canGoToPreviousMonth: boolean;
  canGoToNextMonth: boolean;
  canGoToPreviousYear: boolean;
  canGoToNextYear: boolean;
}>();

const emit = defineEmits<{
  (e: 'previous-month'): void;
  (e: 'next-month'): void;
  (e: 'previous-year'): void;
  (e: 'next-year'): void;
}>();
</script>

<template>
  <div class="flex justify-between items-center mb-6">
    <button
      v-if="!props.isYearView"
      @click="emit('previous-month')"
      class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
      :class="{
        'text-gray-400 cursor-not-allowed': !props.canGoToPreviousMonth,
      }"
      :disabled="!props.canGoToPreviousMonth"
    >
      ‹
    </button>

    <button
      v-else
      @click="emit('previous-year')"
      class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
      :class="{
        'text-gray-400 cursor-not-allowed': !props.canGoToPreviousYear,
      }"
      :disabled="!props.canGoToPreviousYear"
    >
      ‹
    </button>

    <div class="text-center">
      <h2 class="text-xl font-bold text-gray-800">{{ props.title }}</h2>
      <p class="text-sm text-gray-600 mt-1">{{ props.subtitle }}</p>
    </div>

    <button
      v-if="!props.isYearView"
      @click="emit('next-month')"
      class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
      :class="{
        'text-gray-400 cursor-not-allowed': !props.canGoToNextMonth,
      }"
      :disabled="!props.canGoToNextMonth"
    >
      ›
    </button>

    <button
      v-else
      @click="emit('next-year')"
      class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
      :class="{
        'text-gray-400 cursor-not-allowed': !props.canGoToNextYear,
      }"
      :disabled="!props.canGoToNextYear"
    >
      ›
    </button>
  </div>
</template>
