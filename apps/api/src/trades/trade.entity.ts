import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Pair } from 'src/pairs/pair.entitiy';
import { TradingSession } from 'src/trading-sessions/trading-session.entity';
import { DirectionOptions, ResultOptions } from './enums';

@Entity('trades')
export class Trade {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Pair, (pair) => pair.id, { eager: true })
  pair: Pair;

  @Column({ type: 'date', nullable: true })
  openDate?: Date;

  @Column({ type: 'date', nullable: true })
  closeDate?: Date;

  @Column({ type: 'real', nullable: false })
  stopLoss: number;

  @Column({ type: 'real', nullable: false })
  takeProfit: number;

  @ManyToOne(() => TradingSession, (session) => session.id, { onDelete: 'CASCADE', eager: true })
  tradingSession: TradingSession;

  @Column({ type: 'text', nullable: false })
  result: ResultOptions;

  @Column({ type: 'text', nullable: false })
  direction: DirectionOptions;
}
