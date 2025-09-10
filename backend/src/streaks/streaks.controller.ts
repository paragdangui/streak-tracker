import { Controller, Get, Post } from '@nestjs/common';
import { StreaksService } from './streaks.service';

@Controller('streaks')
export class StreaksController {
  constructor(private readonly streaksService: StreaksService) {}

  @Post()
  create() {
    return this.streaksService.create();
  }

  @Get()
  async getStreaks() {
    const streaks = await this.streaksService.findAll();
    const currentStreak = await this.streaksService.getCurrentStreak();
    return {
      streaks,
      currentStreak,
    };
  }

  @Post('reset')
  reset() {
    return this.streaksService.reset();
  }

  @Post('undo-today')
  undoToday() {
    return this.streaksService.undoToday();
  }
}
