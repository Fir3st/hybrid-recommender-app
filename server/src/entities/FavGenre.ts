import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { Genre } from './Genre';

@Entity({ name: 'fav_genres' })
export class FavGenre {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: number;

    @ManyToOne(type => User, user => user.favouriteGenres)
    user: User;

    @ManyToOne(type => Genre)
    genre: Genre;
}
