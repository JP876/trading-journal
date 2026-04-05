import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Trade } from 'src/trades/trade.entity';
import { TradingSession } from 'src/trading-sessions/trading-session.entity';

@Entity('pairs')
export class Pair {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text', nullable: false })
  pair: string;

  @Column({ type: 'text', nullable: false })
  assetClass: string;

  @Column({ type: 'text', nullable: false })
  baseIso: string;

  @Column({ type: 'text', nullable: false })
  quoteIso: string;

  @Column({ type: 'text', nullable: false })
  baseCountry: string;

  @Column({ type: 'text', nullable: false })
  quoteCountry: string;

  @Column({ type: 'text', nullable: false })
  baseCurrencyName: string;

  @Column({ type: 'text', nullable: false })
  quoteCurrencyName: string;

  @OneToMany(() => Trade, (trade) => trade.pair)
  trades?: Trade[];

  @OneToMany(() => TradingSession, (tradingSession) => tradingSession.defaultPair)
  tradingSessions?: TradingSession[];
}
