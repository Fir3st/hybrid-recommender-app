import * as csv from 'csvtojson';
import * as faker from 'faker';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import * as cliProgress from 'cli-progress';
import { createConnection } from 'typeorm';
import { UserRating } from '../server/src/entities/UserRating';
import { User } from '../server/src/entities/User';
import { Movie } from '../server/src/entities/Movie';

const progressBar = new cliProgress.Bar({});

createConnection()
    .then(async (connection) => {
        csv()
            .fromFile('data/filtered/ratings.csv')
            .then(async (data) => {

                progressBar.start(data.length, 0);
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
                            user.email = faker.internet.email(user.name, user.surname);
                            user.admin = false;
                            user.password = await bcrypt.hash('secret', 10);
                            await connection.manager.save(user);
                        }
                        userRating.user = user;
                        await connection.manager.save(userRating);
                        progressBar.increment(1);
                    } catch (error) {
                        console.log(error.message);
                    }
                }
            })
            .then(async () => {
                progressBar.stop();
                await connection.close();
                console.log('Ratings populated');
            });
    })
    .catch(error => console.log(error));
