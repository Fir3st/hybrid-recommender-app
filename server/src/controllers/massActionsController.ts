import { authenticate, authorize } from '../middleware/auth';
import { Request, Router } from 'express';
import { getRepository } from 'typeorm';
import * as config from 'config';
import * as _ from 'lodash';
import { User } from '../entities/User';
import { Setting } from '../entities/Setting';
import winston from '../utils/winston';
const router = Router();
import * as Queue from 'bull';
import axios from "axios";
import * as bcrypt from 'bcrypt';

const retrainQueue = new Queue('audio transcoding', { redis: config.get('redis') });
let token: string = '';

const cleanResponse = (data: any) => {
    return data && data.length ? data.map(item => (
        _.omit(item, ['poster', 'plot', 'year', 'production', 'type', 'image', 'director', 'releaseDate', 'imdbId'])
    )) : [];
};

retrainQueue.process(async (job, done) => {
    const usersRepository = getRepository(User);
    const settingsRepository = getRepository(Setting);
    const serverUrl = config.get('baseUrl');
    const userId: number = 12345;

    try {
        if (job.data.action && job.data.action === 'prepare') {
            winston.info('Preparing');
            await usersRepository.createQueryBuilder()
                .update(User)
                .set({ massResult: '' })
                .execute();

            const dbUser = await usersRepository.findOne(userId);

            if (!dbUser) {
                const user = new User;
                user.id = userId;
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
                token = response.data.token;
            }

            const massGenerateSetting = await settingsRepository.findOne({ name: 'mass_generate' });
            if (massGenerateSetting) {
                massGenerateSetting.value = '1';
                await settingsRepository.save(massGenerateSetting);
            }
            done();
        } else if (job.data.id) {
            const userId = job.data.id;
            winston.info(`User ${userId}`);
            const numOfRatings = 25;
            const results: any = {
                analyze: {},
                cbf: { movies: [] },
                cb: { selected: null, movies: [] },
                hybrid: { selected: null, movies: [] },
                expert: { movies: [] },
                new: { movies: [] },
                newBoosting: { movies: [] }
            };
            const config = {
                timeout: 60 * 40 * 1000,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const user = await usersRepository.findOne(userId);
            let url = `${serverUrl}/playground/users/${userId}?take=${numOfRatings}&rec_type=svd&sim_source=tf-idf&order_by=rating`;

            /* Analyze */
            const analyzeResponse = await axios.get(`${serverUrl}/users/${userId}/analyze`, config);
            results.analyze = analyzeResponse.data;

            /* CBF */
            const cbfResponse = await axios.get(url, config);
            results.cbf.movies = cleanResponse(cbfResponse.data);

            /* CB */
            const userStats = await axios.get(`${serverUrl}/users/${userId}`, config);
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
            results.cb.movies = cleanResponse(cbResponse.data);

            /* Hybrid */
            if (highestRatedItems.length === 1) {
                results.hybrid.selected = _.pick(highestRatedItems[0], ['id', 'title']);
            } else {
                const index = _.random(0, highestRatedItems.length - 1);
                results.hybrid.selected = _.pick(highestRatedItems[index], ['id', 'title']);
            }
            url = `${serverUrl}/playground/hybrid/${userId}/${results.hybrid.selected.id}?take=${numOfRatings}&hybrid_type=weighted&rec_type=svd&order_by=similarity,rating`;
            const hybridResponse = await axios.get(url, config);
            results.hybrid.movies = cleanResponse(hybridResponse.data);

            /* Expert */
            const expertGenres = await axios.get(`${serverUrl}/playground/users/${userId}/genres`, config);
            url = `${serverUrl}/playground/users/${userId}?take=${numOfRatings}&rec_type=svd&sim_source=tf-idf&order_by=augmented_rating`;

            if (expertGenres.data.topPositiveGenres && expertGenres.data.topPositiveGenres.length) {
                url = `${url}&fav_genres=${expertGenres.data.topPositiveGenres.join(',')}`;
            }

            if (expertGenres.data.topNegativeGenres && expertGenres.data.topNegativeGenres.length) {
                url = `${url}&not_fav_genres=${expertGenres.data.topNegativeGenres.join(',')}`;
            }

            const expertResponse = await axios.get(url, config);
            results.expert.movies = cleanResponse(expertResponse.data);

            /* New */
            url = `${serverUrl}/playground/users/${userId}/new?take=${numOfRatings}`;

            const newResponse = await axios.get(url, config);
            results.new.movies = cleanResponse(newResponse.data);

            url = `${url}&boostRatings=true`;

            const newBoostingResponse = await axios.get(url, config);
            results.newBoosting.movies = cleanResponse(newBoostingResponse.data);

            user.massResult = JSON.stringify(results);
            await usersRepository.save(user);
            done();
        } else if (job.data.action && job.data.action === 'clean') {
            winston.info('Cleaning');
            await usersRepository.delete(userId);

            const massGenerateSetting = await settingsRepository.findOne({ name: 'mass_generate' });
            if (massGenerateSetting) {
                massGenerateSetting.value = '0';
                await settingsRepository.save(massGenerateSetting);
            }
            done();
        }
    } catch (e) {
        winston.error(e.message);
        done();
    }
});

router.get('/status', [authenticate, authorize], async (req: Request, res: any) => {
    const settingsRepository = getRepository(Setting);

    try {
        const massGenerateSetting = await settingsRepository.findOne({ name: 'mass_generate' });
        if (massGenerateSetting) {
            return res.send({ status: massGenerateSetting.value });
        }

        return res.send({ status: 'OK' });
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

router.get('/data', [authenticate, authorize], async (req: Request, res: any) => {
    const usersRepository = getRepository(User);

    try {
        const data = await usersRepository
            .createQueryBuilder()
            .where('massResult <> :massResult', { massResult: '' })
            .getMany();
        if (data && data.length) {
            return res.send({
                data: data
                    .map(item => _.pick(item, ['id', 'name', 'surname', 'massResult']))
                    .map(item => ({ ...item, massResult: JSON.parse(item.massResult) }))
            });
        }

        return res.send({ status: 'OK' });
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

router.post('/run', [authenticate, authorize], async (req: Request, res: any) => {
    const usersRepository = getRepository(User);

    try {
        const users = await usersRepository.find();

        retrainQueue.add({ action: 'prepare' });

        for (const user of users) {
            retrainQueue.add({ id: user.id });
        }

        retrainQueue.add({ action: 'clean' });

        return res.send({ status: 'OK' });
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

export default router;
