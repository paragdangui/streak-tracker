<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStreaksStore } from '~/stores/streaks';

const streaksStore = useStreaksStore();
const devMode = ref(false);

onMounted(() => {
  devMode.value = import.meta.env.DEV;
});

const dropdownOpen = ref(false);
const selectedDate = ref(''); // YYYY-MM-DD format
const isSimulated = ref(false);

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const fetchCurrentDate = async () => {
  try {
    const response = await fetch('/api/dev-tools/current-date');
    if (response.ok) {
      const data = await response.json();
      // Convert the date to YYYY-MM-DD format for the date input
      const date = new Date(data.currentDate);
      selectedDate.value = date.toISOString().split('T')[0] || '';
      isSimulated.value = data.isSimulated || false;
    }
  } catch (error) {
    console.error('Error fetching current date:', error);
    // Fallback to today's date if API call fails
    const today = new Date();
    selectedDate.value = today.toISOString().split('T')[0] || '';
    isSimulated.value = false;
  }
};

onMounted(() => {
  fetchCurrentDate();
});

const resetData = async () => {
  if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
    await streaksStore.resetStreaks();
    alert('All data has been reset.');
    dropdownOpen.value = false;
  }
};

const setSimulatedDate = async () => {
  if (!selectedDate.value) {
    alert('Please select a date.');
    return;
  }
  try {
    const response = await fetch('/api/dev-tools/set-date', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: selectedDate.value }),
    });
    if (!response.ok) {
      throw new Error('Failed to set simulated date');
    }
    await response.json();
    isSimulated.value = true;
    await streaksStore.fetchCurrentDate(); // Refresh current date
    await streaksStore.fetchStreaks(); // Refresh data after setting simulated date
    dropdownOpen.value = false;
  } catch (error) {
    console.error(error);
    alert('Error setting simulated date.');
  }
};

const resetSimulatedDate = async () => {
  try {
    const response = await fetch('/api/dev-tools/reset-date', {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to reset simulated date');
    }
    await response.json();
    isSimulated.value = false;
    await streaksStore.fetchCurrentDate(); // Refresh current date in store
    await fetchCurrentDate(); // Refresh to show the current date in this component
    await streaksStore.fetchStreaks(); // Refresh data after resetting simulated date
    dropdownOpen.value = false;
  } catch (error) {
    console.error(error);
    alert('Error resetting simulated date.');
  }
};
</script>

<template>
  <div v-if="devMode" class="fixed bottom-4 right-4 z-50">
    <div class="relative">
      <button @click="toggleDropdown" class="bg-blue-500 text-white p-3 rounded-full shadow-lg focus:outline-none">
        Dev Tools
      </button>
      <div v-if="dropdownOpen" class="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-lg shadow-xl p-4 space-y-3">
        <h3 class="text-lg font-bold text-gray-800">Development Tools</h3>

        <button @click="resetData" class="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-md shadow-lg hover:bg-red-700 transition duration-300">
          Reset All Data
        </button>

        <div class="space-y-2">
          <label for="simulatedDate" class="block text-sm font-medium text-gray-700">Set Simulated Date:</label>
          <input type="date" id="simulatedDate" v-model="selectedDate" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-gray-800">
          <button @click="setSimulatedDate" class="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-md shadow-lg hover:bg-green-700 transition duration-300">
            Apply Simulated Date
          </button>
          <button @click="resetSimulatedDate" :disabled="!isSimulated" class="w-full font-bold py-2 px-4 rounded-md shadow-lg transition duration-300" :class="isSimulated ? 'bg-yellow-500 text-white hover:bg-yellow-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'">
            Reset Simulated Date
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
