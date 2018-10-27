import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Movie } from './Movie';

@Entity({ name: 'countries' })
export class Country {
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
        name: 'movies_countries',
        joinColumns: [
            {
                name: 'countriesId',
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
