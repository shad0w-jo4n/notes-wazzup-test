import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/user.entity';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne(() => User)
  public user!: User;

  @Column('char', { length: 32, unique: true })
  public value!: string;

  @Column()
  public isRevoked!: boolean;

  @Column()
  public dueAt!: Date;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
