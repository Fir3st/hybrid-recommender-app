import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Movie } from './Movie';

@Entity({ name: 'ratings' })
export class Rating {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 100
    })
    source: string;

    @Column({
        length: 10
    })
    value: string;

    @ManyToOne(type => Movie, movie => movie.ratings)
    movie: Movie;
}
