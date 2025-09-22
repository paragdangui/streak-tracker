import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { StreaksModule } from './streaks/streaks.module';
import { DevToolsModule } from './dev-tools/dev-tools.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true, // Be cautious with this in production
    }),
    StreaksModule,
    DevToolsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}