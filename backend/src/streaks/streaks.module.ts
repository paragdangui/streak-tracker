import { Module } from '@nestjs/common';
import { StreaksController } from './streaks.controller';
import { StreaksService } from './streaks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Streak } from './streak.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Streak])],
  controllers: [StreaksController],
  providers: [StreaksService]
})
export class StreaksModule {}