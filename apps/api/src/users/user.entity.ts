import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
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

  @CreateDateColumn({ type: 'text' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'text' })
  updatedAt: Date;
}
