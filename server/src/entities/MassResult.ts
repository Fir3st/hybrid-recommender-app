import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity({ name: 'massResults' })
export class MassResult {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 100
    })
    type: string;

    @Column('longtext')
    data: string;

    @ManyToOne(type => User, user => user.massResults)
    user: User;
}
