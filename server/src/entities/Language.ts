import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Movie } from './Movie';

@Entity({ name: 'languages' })
export class Language {
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
        name: 'movies_languages',
        joinColumns: [
            {
                name: 'languagesId',
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
