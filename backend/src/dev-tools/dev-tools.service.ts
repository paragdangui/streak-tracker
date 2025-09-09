import { Injectable } from '@nestjs/common';

@Injectable()
export class DevToolsService {
  private simulatedDate: Date | null = null;

  setSimulatedDate(date: Date) {
    this.simulatedDate = date;
  }

  getSimulatedDate(): Date {
    return this.simulatedDate || new Date();
  }

  resetSimulatedDate() {
    this.simulatedDate = null;
  }
}
