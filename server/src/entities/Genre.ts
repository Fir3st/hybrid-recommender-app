import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Movie } from './Movie';

@Entity({ name: 'genres' })
export class Genre {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 100
    })
    name: string;

    @ManyToMany(type => Movie, {
        cascade: true
    })
    @JoinTable({
        name: 'movies_genres',
        joinColumns: [
            {
                name: 'genresId',
                referencedColumnName: 'id'
            }
        ],
        inverseJoinColumns: [
            {
                name: 'moviesId',
                referencedColumnName: 'id'
            }
        ]
    })
    movies: Movie[];
}
