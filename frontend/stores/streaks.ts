import { defineStore } from 'pinia';

export const useStreaksStore = defineStore('streaks', {
  state: () => ({
    streaks: [] as { id: number; completion_date: string }[],
    currentStreak: 0,
    currentDate: null as Date | null,
    currentDateFormatted: '',
  }),
  getters: {
    todayDate(): Date {
      const d = this.currentDate ? new Date(this.currentDate) : new Date();
      d.setHours(0, 0, 0, 0);
      return d;
    },
    isTodayMarked(): boolean {
      const t = this.todayDate;
      const toYMD = (d: Date) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      };
      const todayKey = toYMD(t);
      return this.streaks.some((s) => {
        const d = new Date(s.completion_date);
        return toYMD(d) === todayKey;
      });
    },
  },
  actions: {
    async fetchCurrentDate() {
      try {
        const response = await fetch('/api/dev-tools/current-date');
        if (response.ok) {
          const data = await response.json();
          const date = new Date(data.currentDate);
          this.currentDate = date;
          this.currentDateFormatted = date.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        }
      } catch (error) {
        console.error('Error fetching current date:', error);
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        this.currentDate = date;
        this.currentDateFormatted = date.toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      }
    },
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
