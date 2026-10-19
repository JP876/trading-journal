import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Trade } from 'src/trades/trade.entity';
import { User } from 'src/users/user.entity';
import { Pair } from 'src/pairs/pair.entitiy';
import { CurrencyOptions } from './enums';

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

  @Column({ type: 'real', nullable: false })
  accountSize: number;

  @Column({ type: 'string', nullable: false, default: CurrencyOptions.EUR })
  currency: string;

  @OneToMany(() => Trade, (trade) => trade.tradingSession)
  trades?: Trade[];

  @ManyToOne(() => Pair, (pair) => pair.tradingSessions)
  defaultPair?: Pair;

  @Column({ type: 'real', nullable: true })
  defaultStopLoss: number | null;

  @Column({ type: 'real', nullable: true })
  defaultTakeProfit: number | null;

  @Column({ type: 'datetime', nullable: true })
  defaultOpenDate: Date | null;

  /* 
  trades service -> findAll -> allways return empty trades array
  @CreateDateColumn({ type: 'datetime', nullable: true })
  createdAt: Date;
  @UpdateDateColumn({ type: 'datetime', nullable: true })
  updatedAt: Date; */

  @Column({ type: 'datetime' })
  createdAt: Date;

  @Column({ type: 'datetime' })
  updatedAt: Date;

  @BeforeInsert()
  updateDates() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  updateDate() {
    this.updatedAt = new Date();
  }
}
