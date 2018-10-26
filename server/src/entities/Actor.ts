import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Movie } from './Movie';

@Entity({ name: 'actors' })
export class Actor {
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
        name: 'movies_actors',
        joinColumns: [
            {
                name: 'actorsId',
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
