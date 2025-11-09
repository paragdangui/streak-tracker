<script setup lang="ts">
const props = defineProps<{
  isYearView: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle'): void;
}>();
</script>

<template>
  <div class="flex justify-center mb-4">
    <button
      @click="emit('toggle')"
      class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
    >
      {{ props.isYearView ? 'Month View' : 'Year View' }}
    </button>
  </div>
</template>
