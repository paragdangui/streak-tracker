import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Streak } from './streak.entity';

@Injectable()
export class StreaksService {
  constructor(
    @InjectRepository(Streak)
    private streaksRepository: Repository<Streak>,
  ) {}

  async create(): Promise<Streak> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingStreak = await this.streaksRepository.findOne({
      where: { completion_date: today },
    });

    if (existingStreak) {
      return existingStreak;
    }

    const newStreak = this.streaksRepository.create({ completion_date: today });
    return this.streaksRepository.save(newStreak);
  }

  async findAll(): Promise<Streak[]> {
    return this.streaksRepository.find({ order: { completion_date: 'ASC' } });
  }

  async getCurrentStreak(): Promise<number> {
    const allStreaks = await this.findAll();
    if (allStreaks.length === 0) {
      return 0;
    }

    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if today is a completed day
    const todayIndex = allStreaks.findIndex(
      (streak) => new Date(streak.completion_date).getTime() === today.getTime(),
    );

    if (todayIndex === -1) {
        // if today is not completed, check if yesterday was
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayIndex = allStreaks.findIndex(
            (streak) => new Date(streak.completion_date).getTime() === yesterday.getTime(),
        );
        if (yesterdayIndex === -1) {
            return 0;
        }
        currentStreak = 1;
        let currentDate = yesterday;
        for (let i = yesterdayIndex - 1; i >= 0; i--) {
            const previousDay = new Date(currentDate);
            previousDay.setDate(previousDay.getDate() - 1);
            if (new Date(allStreaks[i].completion_date).getTime() === previousDay.getTime()) {
                currentStreak++;
                currentDate = previousDay;
            } else {
                break;
            }
        }
        return currentStreak;

    }


    currentStreak = 1;
    let currentDate = today;

    for (let i = todayIndex - 1; i >= 0; i--) {
      const previousDay = new Date(currentDate);
      previousDay.setDate(previousDay.getDate() - 1);

      if (new Date(allStreaks[i].completion_date).getTime() === previousDay.getTime()) {
        currentStreak++;
        currentDate = previousDay;
      } else {
        break;
      }
    }

    return currentStreak;
  }
}