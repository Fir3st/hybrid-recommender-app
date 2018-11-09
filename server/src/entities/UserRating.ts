import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { Movie } from './Movie';

@Entity({ name: 'users_ratings' })
export class UserRating {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    movieId: number;

    @Column('float')
    rating: number;

    @Column('datetime')
    createdAt: string;

    @ManyToOne(type => User, user => user.ratings)
    user: User;

    @ManyToOne(type => Movie, movie => movie.ratings)
    movie: Movie;
}
