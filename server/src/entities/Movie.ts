import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Genre } from './Genre';
import { Actor } from './Actor';
import { Language } from './Language';
import { Country } from './Country';
import { Rating } from './Rating';
import { UserRating } from './UserRating';

enum movieTypes {
    movie,
    series,
    episode
}

@Entity({ name: 'movies' })
export class Movie {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 20 })
    imdbId: string;

    @Column({ length: 100 })
    title: string;

    @Column({ width: 4 })
    year: number;

    @Column({ length: 20 })
    rating: string;

    @Column('date')
    releaseDate: string;

    @ManyToMany(type => Genre, {
        cascade: true
    })
    @JoinTable({
        name: 'movies_genres',
        joinColumns: [
            {
                name: 'moviesId',
                referencedColumnName: 'id'
            }
        ],
        inverseJoinColumns: [
            {
                name: 'genresId',
                referencedColumnName: 'id'
            }
        ]
    })
    genres: Genre[];

    @Column({ length: 100 })
    director: string;

    @ManyToMany(type => Actor, {
        cascade: true
    })
    @JoinTable({
        name: 'movies_actors',
        joinColumns: [
            {
                name: 'moviesId',
                referencedColumnName: 'id'
            }
        ],
        inverseJoinColumns: [
            {
                name: 'actorsId',
                referencedColumnName: 'id'
            }
        ]
    })
    actors: Actor[];

    @Column('text')
    plot: string;

    @ManyToMany(type => Language, {
        cascade: true
    })
    @JoinTable({
        name: 'movies_languages',
        joinColumns: [
            {
                name: 'moviesId',
                referencedColumnName: 'id'
            }
        ],
        inverseJoinColumns: [
            {
                name: 'languagesId',
                referencedColumnName: 'id'
            }
        ]
    })
    languages: Language[];

    @ManyToMany(type => Country, {
        cascade: true
    })
    @JoinTable({
        name: 'movies_countries',
        joinColumns: [
            {
                name: 'moviesId',
                referencedColumnName: 'id'
            }
        ],
        inverseJoinColumns: [
            {
                name: 'countriesId',
                referencedColumnName: 'id'
            }
        ]
    })
    countries: Country[];

    @Column({ length: 255 })
    poster: string;

    @Column({ length: 255 })
    image: string;

    @Column('enum', { enum: movieTypes })
    type: string;

    @Column({ length: 100 })
    production: string;

    @OneToMany(type => Rating, rating => rating.movie, {
        cascade: true
    })
    ratings: Rating[];

    @OneToMany(type => UserRating, rating => rating.movie, {
        cascade: true
    })
    usersRatings: UserRating[];
}
