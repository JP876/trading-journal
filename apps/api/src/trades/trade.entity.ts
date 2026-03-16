import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Trade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: true })
  openDate?: Date;

  @Column({ type: 'date', nullable: true })
  closeDate?: Date;

  @Column({ type: 'real', nullable: false })
  stopLoss: number;

  @Column({ type: 'real', nullable: false })
  takeProfit: number;
}
