import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'settings' })
export class Setting {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 100
    })
    type: string;

    @Column({
        length: 100
    })
    name: string;

    @Column({
        length: 255,
        nullable: true
    })
    value: string;
}
