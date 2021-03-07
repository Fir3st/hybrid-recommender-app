import * as config from 'config';
import axios from 'axios';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import { createConnection, getRepository } from 'typeorm';
import { ConfigInterface } from 'redis-smq/types/config';
import { ConsumerConstructorOptionsInterface } from 'redis-smq/types/consumer';
import { User } from './entities/User';
import { Setting } from './entities/Setting';
const redisSmq = require('redis-smq');

class QueueConsumer extends redisSmq.Consumer {
    static queueName: string = 'retrain_queue';
    userId: number = 12345;
    token: string = '';

    constructor(queueConfig: ConfigInterface, options?: ConsumerConstructorOptionsInterface) {
        super(queueConfig, options);
        createConnection()
            .then(() => {
                console.log('Database connected');
            })
            .catch(error => console.log(error));
    }

    cleanResponse(data: any) {
        return data && data.length ? data.map(item => (
            _.omit(item, ['poster', 'plot', 'year', 'production', 'type', 'image', 'director', 'releaseDate', 'imdbId'])
        )) : [];
    }

    async consume(message: any, cb: any) {
        const usersRepository = getRepository(User);
        const settingsRepository = getRepository(Setting);
        const serverUrl = config.get('baseUrl');

        try {
            if (message.action && message.action === 'prepare') {
                // Cleaning
                await usersRepository.createQueryBuilder()
                    .update(User)
                    .set({ massResult: '' })
                    .execute();

                const dbUser = await usersRepository.findOne(this.userId);

                if (!dbUser) {
                    const user = new User;
                    user.id = this.userId;
                    user.name = config.get('queueUser');
                    user.surname = config.get('queueUser');
                    user.email = config.get('queueMail');
                    user.password = await bcrypt.hash(config.get('queuePassword'), 10);
                    user.admin = true;
                    user.massResult = '';

                    await usersRepository.save(user);
                }

                const response = await axios.post(`${serverUrl}/auth/login`, {
                    email: config.get('queueMail'),
                    password: config.get('queuePassword')
                });

                if (response.data && response.data.token) {
                    this.token = response.data.token;
                }

                const massGenerateSetting = await settingsRepository.findOne({ name: 'mass_generate' });
                if (massGenerateSetting) {
                    massGenerateSetting.value = '1';
                    await settingsRepository.save(massGenerateSetting);
                }
            } else if (message.id) {
                const numOfRatings = 25;
                const results: any = {
                    cbf: { movies: [] },
                    cb: { selected: null, movies: [] }
                };
                const config = {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                };
                const user = await usersRepository.findOne(message.id);
                let url = `${serverUrl}/playground/users/${message.id}?take=${numOfRatings}&rec_type=svd&sim_source=tf-idf&order_by=rating`;

                /* CBF */
                const cbfResponse = await axios.get(url, config);
                results.cbf.movies = this.cleanResponse(cbfResponse.data);

                /* CB */
                const userStats = await axios.get(`${serverUrl}/users/${message.id}`, config);
                const cbMovies = userStats.data.ratings.map((item) => {
                    return {
                        ...item.movie,
                        rating: item.rating
                    };
                });
                const highestRatedItems = cbMovies.filter(item => item.rating === Math.max(...cbMovies.map(movie => movie.rating)));
                if (highestRatedItems.length === 1) {
                    results.cb.selected = _.pick(highestRatedItems[0], ['id', 'title']);
                } else {
                    const index = _.random(0, highestRatedItems.length - 1);
                    results.cb.selected = _.pick(highestRatedItems[index], ['id', 'title']);
                }
                url = `${serverUrl}/playground/movies/${results.cb.selected.id}?take=${numOfRatings}&type=tf-idf&order_by=similarity`;
                const cbResponse = await axios.get(url, config);
                results.cb.movies = this.cleanResponse(cbResponse.data);

                user.massResult = JSON.stringify(results);
                await usersRepository.save(user);
            } else {
                await usersRepository.delete(this.userId);
                this.token = '';

                const massGenerateSetting = await settingsRepository.findOne({ name: 'mass_generate' });
                if (massGenerateSetting) {
                    massGenerateSetting.value = '0';
                    await settingsRepository.save(massGenerateSetting);
                }
            }
        } catch (e) {
            console.log(e);
        }
    }
}

const consumer = new QueueConsumer(config.get('redisQueue'), { messageConsumeTimeout: 2000 });
consumer.run();
