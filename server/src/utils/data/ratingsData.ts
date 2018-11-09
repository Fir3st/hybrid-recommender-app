import * as csv from 'csvtojson';
import * as faker from 'faker';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { createConnection } from 'typeorm';
import { UserRating } from './../../entities/UserRating';
import { User } from './../../entities/User';
import { Movie } from './../../entities/Movie';

createConnection().then(async (connection) => {
    csv()
        .fromFile('server/src/utils/data/ratings.csv')
        .then(async (data) => {
            for (const rating of data) {
                try {
                    const userRating = new UserRating();
                    userRating.rating = rating.rating;
                    userRating.createdAt = moment.unix(rating.timestamp).format('YYYY-MM-DD HH:mm:ss');
                    const movie = await connection.manager.findOne(Movie, rating.movieId);
                    if (movie) {
                        userRating.movie = movie;
                    }
                    let user = await connection.manager.findOne(User, rating.userId);
                    if (!user) {
                        user = new User();
                        user.id = rating.userId;
                        user.name = faker.name.firstName();
                        user.surname = faker.name.lastName();
                        user.email = faker.internet.email();
                        user.admin = false;
                        user.password = await bcrypt.hash('secret', 10);
                        await connection.manager.save(user);
                    }
                    userRating.user = user;
                    await connection.manager.save(userRating);
                } catch (error) {
                    console.log(error.message);
                }
            }
        });
});
