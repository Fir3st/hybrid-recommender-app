import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserRating } from './UserRating';
import { FavGenre } from './FavGenre';
import { Result } from './Result';
import { TopGenre } from './TopGenre';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 100
    })
    name: string;

    @Column({
        length: 100
    })
    surname: string;

    @Column({
        length: 100
    })
    email: string;

    @Column()
    password: string;

    @Column({ default: false })
    admin: boolean;

    @OneToMany(type => UserRating, rating => rating.user, {
        cascade: true
    })
    ratings: UserRating[];

    @OneToMany(type => FavGenre, genre => genre.user, {
        cascade: true
    })
    favouriteGenres: FavGenre[];

    @OneToMany(type => TopGenre, genre => genre.user, {
        cascade: true
    })
    topGenres: TopGenre[];

    @OneToMany(type => Result, result => result.user, {
        cascade: true
    })
    results: Result[];
}
