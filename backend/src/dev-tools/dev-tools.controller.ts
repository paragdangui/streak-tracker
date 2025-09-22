import { Controller, Post, Body, Get } from '@nestjs/common';
import { DevToolsService } from './dev-tools.service';

@Controller('dev-tools')
export class DevToolsController {
  constructor(private readonly devToolsService: DevToolsService) {}

  @Post('set-date')
  setSimulatedDate(@Body('date') dateString: string) {
    const date = new Date(dateString);
    this.devToolsService.setSimulatedDate(date);
    return { message: `Simulated date set to ${date.toISOString()}` };
  }

  @Post('reset-date')
  resetSimulatedDate() {
    this.devToolsService.resetSimulatedDate();
    return { message: 'Simulated date reset' };
  }

  @Get('current-date')
  getCurrentDate() {
    return { 
      currentDate: this.devToolsService.getSimulatedDate().toISOString(),
      isSimulated: this.devToolsService.isSimulationActive()
    };
  }
}
