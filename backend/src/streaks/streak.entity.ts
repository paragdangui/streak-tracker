import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('streaks')
export class Streak {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  completion_date: Date;
}
