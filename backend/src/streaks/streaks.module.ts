import { Module } from '@nestjs/common';
import { StreaksController } from './streaks.controller';
import { StreaksService } from './streaks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Streak } from './streak.entity';
import { DevToolsModule } from '../dev-tools/dev-tools.module'; // Import DevToolsModule

@Module({
  imports: [TypeOrmModule.forFeature([Streak]), DevToolsModule], // Add DevToolsModule
  controllers: [StreaksController],
  providers: [StreaksService]
})
export class StreaksModule {}