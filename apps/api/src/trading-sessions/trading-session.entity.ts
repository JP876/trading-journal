import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Trade } from 'src/trades/trade.entity';
import { User } from 'src/users/user.entity';

@Entity('trading-sessions')
export class TradingSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'int', nullable: true, default: 0 })
  isMain: number;

  @ManyToOne(() => User, (user) => user.tradingSessions, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Trade, (trade) => trade.tradingSession)
  trades?: Trade[];
}
