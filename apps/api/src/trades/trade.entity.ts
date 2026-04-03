import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Pair } from 'src/pairs/pair.entitiy';
import { TradingSession } from 'src/trading-sessions/trading-session.entity';
import { ClosedBy, DirectionOptions, OrderType, ResultOptions } from './enums';
import { Tag } from 'src/tags/tag.entity';

@Entity('trades')
export class Trade {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Pair, (pair) => pair.trades, { eager: true })
  pair: Pair;

  @ManyToOne(() => TradingSession, (session) => session.trades, { onDelete: 'CASCADE' })
  tradingSession: TradingSession;

  @ManyToMany(() => Tag, (tag) => tag.trades, { eager: true })
  @JoinTable()
  tags?: Tag[];

  @Column({ type: 'text', nullable: false })
  result: ResultOptions;

  @Column({ type: 'text', nullable: false })
  direction: DirectionOptions;

  @Column({ type: 'real', nullable: true })
  stopLoss: number;

  @Column({ type: 'real', nullable: true })
  takeProfit: number;

  @Column({ type: 'datetime', nullable: true })
  openDate: Date | null;

  @Column({ type: 'datetime', nullable: true })
  closeDate: Date | null;

  @Column({ type: 'text', nullable: true, default: ClosedBy.TP_SL })
  closedBy: ClosedBy;

  @Column({ type: 'real', nullable: true })
  closedAt: number | null;

  @Column({ type: 'text', nullable: true, default: OrderType.MARKET })
  orderType: OrderType;

  @Column({ type: 'text', nullable: true })
  comment: string | null;

  @Column({ type: 'real', nullable: true })
  entryPrice: number | null;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
