import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Trade } from 'src/trades/trade.entity';

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
  baseName: string;

  @Column({ type: 'text', nullable: false })
  baseCountry: string;

  @Column({ type: 'text', nullable: false })
  quoteIso: string;

  @Column({ type: 'text', nullable: false })
  quoteName: string;

  @Column({ type: 'text', nullable: false })
  quoteCountry: string;

  @OneToMany(() => Trade, (trade) => trade.id)
  trade: Trade[];
}
