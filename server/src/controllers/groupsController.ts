// @ts-nocheck
import * as _ from 'lodash';
import { Request, Router } from 'express';
import { getRepository } from 'typeorm';
import winston from '../utils/winston';
import { authenticate, authorize } from '../middleware/auth';
import { LimitType, TopGenre, TopGenreType } from '../entities/TopGenre';
import { Genre } from '../entities/Genre';
import { User } from '../entities/User';

const router = Router();

Array.prototype.contains = function (array, min) {
    const filteredArray = this.filter(value => array.includes(value));
    return filteredArray.length >= min;
};

function k_combinations(set, k) {
    // tslint:disable-next-line:one-variable-per-declaration
    let i, j, combs, head, tailcombs;
    if (k > set.length || k <= 0) {
        return [];
    }

    if (k === set.length) {
        return [set];
    }

    if (k === 1) {
        combs = [];
        for (i = 0; i < set.length; i += 1) {
            combs.push([set[i]]);
        }
        return combs;
    }

    combs = [];
    for (i = 0; i < set.length - k + 1; i += 1) {
        head = set.slice(i, i + 1);
        tailcombs = k_combinations(set.slice(i + 1), k - 1);
        for (j = 0; j < tailcombs.length; j += 1) {
            combs.push(head.concat(tailcombs[j]));
        }
    }
    return combs;
}

router.get('/', [authenticate, authorize], async (req: Request, res: any) => {
    const repository = getRepository(TopGenre);
    const genresRepository = getRepository(Genre);
    const usersRepository = getRepository(User);

    try {
        const query = repository
            .createQueryBuilder('topGenres')
            .where('topGenres.genreType IN (:type)', { type: [TopGenreType.MOST_RATED, TopGenreType.LEAST_RATED] })
            .andWhere('topGenres.genreLimit = :limit', { limit: LimitType.TOP_THREE });

        const topGenres = await query.getMany();
        if (topGenres && topGenres.length > 0) {
            const genres = await genresRepository.find();
            const mappedGenres: any = {};
            for (const genre of genres) {
                mappedGenres[genre.id] = genre;
            }
            const users = await usersRepository.find();
            const mappedUsers: any = {};
            for (const user of users) {
                mappedUsers[user.id] = user;
            }
            const usersGenres: any = {};

            for (const topGenre of topGenres) {
                if (!(topGenre.userId in usersGenres)) {
                    usersGenres[topGenre.userId] = {
                        most: [],
                        least: []
                    };
                }

                if (topGenre.genreType === TopGenreType.MOST_RATED) {
                    usersGenres[topGenre.userId]['most'].push(topGenre.genreId);
                } else {
                    usersGenres[topGenre.userId]['least'].push(topGenre.genreId);
                }
            }

            const sortedByMostGenres: any = {};

            for (const userId of Object.keys(usersGenres)) {
                const user = usersGenres[userId];
                const mostGenresKey = user.most.sort((a, b) => a - b).join(',');
                if (!(mostGenresKey in sortedByMostGenres)) {
                    sortedByMostGenres[mostGenresKey] = { [userId]: user };
                } else {
                    sortedByMostGenres[mostGenresKey][userId] = user;
                }
            }

            const sortedByMostAndLeastGenres: any = {};

            for (const groupId of Object.keys(sortedByMostGenres)) {
                let allLeastGenres = new Set();
                for (const userId of Object.keys(sortedByMostGenres[groupId])) {
                    allLeastGenres = new Set([...allLeastGenres, ...sortedByMostGenres[groupId][userId].least]);
                }
                allLeastGenres = [...allLeastGenres];
                const leastGroups = k_combinations([...allLeastGenres], 3);
                for (const leastGroup of leastGroups) {
                    const groupKey = leastGroup.sort((a, b) => a - b).join(',');
                    for (const userId of Object.keys(sortedByMostGenres[groupId])) {
                        const userLeast = sortedByMostGenres[groupId][userId].least;
                        const containsAll = userLeast.contains(leastGroup, 2);
                        if (containsAll) {
                            if (!(groupId in sortedByMostAndLeastGenres)) sortedByMostAndLeastGenres[groupId] = {};
                            if (!(groupKey in sortedByMostAndLeastGenres[groupId])) sortedByMostAndLeastGenres[groupId][groupKey] = {};
                            sortedByMostAndLeastGenres[groupId][groupKey][userId] = sortedByMostGenres[groupId][userId];
                        }
                    }
                }
            }

            const result: any = {
                users: {},
                genres: mappedGenres,
                groups: {}
            };
            for (const user of Object.values(mappedUsers)) {
                result.users[user.id] = _.pick(user, ['id', 'name', 'surname']);
            }
            for (const mostGroupId of Object.keys(sortedByMostAndLeastGenres)) {
                for (const leastGroupId of Object.keys(sortedByMostAndLeastGenres[mostGroupId])) {
                    for (const userId of Object.keys(sortedByMostAndLeastGenres[mostGroupId][leastGroupId])) {
                        const commonKey = `${mostGroupId}-${leastGroupId}`;
                        if (!(commonKey in result.groups)) {
                            result.groups[commonKey] = {
                                users: [],
                                most: mostGroupId.split(','),
                                least: leastGroupId.split(','),
                                countMovieLens: 0,
                                countOthers: 0
                            };
                        }
                        result.groups[commonKey].users.push(parseInt(userId, 10));
                        result.groups[commonKey].countMovieLens = result.groups[commonKey].users.reduce((curr, item) => {
                            return curr + ((item < 1500) ? 1 : 0);
                        }, 0);
                        result.groups[commonKey].countOthers = result.groups
                        [commonKey].users.reduce((curr, item) => {
                            return curr + ((item >= 1500) ? 1 : 0);
                        }, 0);
                    }
                }
            }

            return res.send(result);
        }

        return res.boom.badRequest('No top genres found.');
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

export default router;
