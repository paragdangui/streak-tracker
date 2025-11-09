<script setup lang="ts">
const props = defineProps<{
  date?: string;
}>();
</script>

<template>
  <p v-if="props.date" class="text-xl opacity-90">
    {{ props.date }}
  </p>
</template>
