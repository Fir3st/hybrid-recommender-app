import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Genre } from './Genre';
import { User } from './User';

export enum TopGenreType {
    MOST_RATED = 'most-rated',
    MOST_VALUED = 'most-valued',
    LEAST_RATED = 'least_rated',
    LEAST_VALUED= 'least_valued'
}

export enum LimitType {
    TOP_THREE = 'top-three',
    TOP_TWELVE = 'top-twelve'
}

@Entity({ name: 'topGenres' })
export class TopGenre {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: TopGenreType,
        default: TopGenreType.MOST_RATED
    })
    genreType: TopGenreType;

    @Column({
        type: 'enum',
        enum: LimitType,
        default: LimitType.TOP_THREE
    })
    limit: LimitType;

    @Column()
    value: number;

    @Column()
    genreId: number;

    @ManyToOne(type => Genre)
    genre: Genre;

    @Column()
    userId: number;

    @ManyToOne(type => User, user => user.topGenres)
    user: User;
}
