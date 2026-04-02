import { Exclude } from 'class-transformer';
import { Tag } from 'src/tags/tag.entity';
import { TradingSession } from 'src/trading-sessions/trading-session.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'text', nullable: true })
  image: string | null;

  @OneToMany(() => TradingSession, (session) => session.user)
  tradingSessions?: TradingSession[];

  @OneToMany(() => Tag, (tag) => tag.user)
  tags?: Tag[];

  @Exclude({ toPlainOnly: true })
  @CreateDateColumn({ type: 'text' })
  createdAt: Date;

  @Exclude({ toPlainOnly: true })
  @UpdateDateColumn({ type: 'text' })
  updatedAt: Date;
}
