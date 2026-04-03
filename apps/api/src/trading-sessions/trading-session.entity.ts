import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Trade } from 'src/trades/trade.entity';
import { User } from 'src/users/user.entity';
import { Pair } from 'src/pairs/pair.entitiy';

@Entity('trading-sessions')
export class TradingSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'int', nullable: true, default: 0 })
  isMain: number | null;

  @ManyToOne(() => User, (user) => user.tradingSessions, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Trade, (trade) => trade.tradingSession)
  trades?: Trade[];

  @ManyToOne(() => Pair, (pair) => pair.tradingSessions, { eager: true })
  defaultPair?: Pair;

  @Column({ type: 'real', nullable: true })
  defaultStopLoss: number | null;

  @Column({ type: 'real', nullable: true })
  defaultTakeProfit: number | null;

  @Column({ type: 'datetime', nullable: true })
  defaultOpenDate: Date | null;

  /* 
  trades.service -> findAll -> returns empty trades array

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
  */

  @Column({ type: 'datetime', nullable: true })
  createdAt: Date | null;

  @Column({ type: 'datetime', nullable: true })
  updatedAt: Date | null;
}
