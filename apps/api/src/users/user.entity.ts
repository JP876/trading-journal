import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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

  @Exclude({ toPlainOnly: true })
  @CreateDateColumn({ type: 'text' })
  createdAt: Date;

  @Exclude({ toPlainOnly: true })
  @UpdateDateColumn({ type: 'text' })
  updatedAt: Date;
}
