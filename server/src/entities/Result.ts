import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity({ name: 'results' })
export class Result {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('datetime')
    createdAt: string;

    @Column()
    userId: number;

    @ManyToOne(type => User, user => user.results)
    user: User;

    @Column('longtext')
    data: string;

    @Column({ default: 0 })
    resultType: number;
}
