import { defineStore } from 'pinia';

export const useStreaksStore = defineStore('streaks', {
  state: () => ({
    streaks: [] as { id: number; completion_date: string }[],
    currentStreak: 0,
  }),
  actions: {
    async fetchStreaks() {
      try {
        const response = await fetch('/api/streaks');
        if (!response.ok) {
          throw new Error('Failed to fetch streaks');
        }
        const data = await response.json();
        this.streaks = data.streaks;
        this.currentStreak = data.currentStreak;
      } catch (error) {
        console.error(error);
      }
    },
    async markToday() {
      try {
        const response = await fetch('/api/streaks', { method: 'POST' });
        if (!response.ok) {
          throw new Error('Failed to mark today');
        }
        await this.fetchStreaks();
      } catch (error) {
        console.error(error);
      }
    },
    async resetStreaks() {
      try {
        const response = await fetch('/api/streaks/reset', { method: 'POST' });
        if (!response.ok) {
          throw new Error('Failed to reset streaks');
        }
        await this.fetchStreaks();
      } catch (error) {
        console.error(error);
      }
    },
    async undoToday() {
      try {
        const response = await fetch('/api/streaks/undo-today', { method: 'POST' });
        if (!response.ok) {
          throw new Error('Failed to undo today');
        }
        await this.fetchStreaks();
      } catch (error) {
        console.error(error);
      }
    },
  },
});
