import { Genre } from '../../server/src/entities/Genre';
import { Actor } from '../../server/src/entities/Actor';
import { Language } from '../../server/src/entities/Language';
import { Country } from '../../server/src/entities/Country';

export const getGenres = async (data, connection): Promise<Genre[]> => {
    const received = data.Genre.split(',').map(item => item.trim());
    const genres: Genre[] = [];
    for (const item of received) {
        let genre = await connection.manager.findOne(Genre, { name: item });
        if (genre) {
            genres.push(genre);
        } else {
            genre = new Genre();
            genre.name = item;
            genres.push(genre);
        }
    }

    return genres;
};

export const getActors = async (data, connection): Promise<Actor[]> => {
    const received = data.Actors.split(',').map(item => item.trim());
    const actors: Actor[] = [];
    for (const item of received) {
        let actor = await connection.manager.findOne(Actor, { name: item });
        if (actor) {
            actors.push(actor);
        } else {
            actor = new Actor();
            actor.name = item;
            actors.push(actor);
        }
    }

    return actors;
};

export const getLanguages = async (data, connection): Promise<Language[]> => {
    const received = data.Language.split(',').map(item => item.trim());
    const languages: Language[] = [];
    for (const item of received) {
        let language = await connection.manager.findOne(Language, { name: item });
        if (language) {
            languages.push(language);
        } else {
            language = new Language();
            language.name = item;
            languages.push(language);
        }
    }

    return languages;
};

export const getCountries = async (data, connection): Promise<Country[]> => {
    const received = data.Country.split(',').map(item => item.trim());
    const countries: Country[] = [];
    for (const item of received) {
        let country = await connection.manager.findOne(Country, { name: item });
        if (country) {
            countries.push(country);
        } else {
            country = new Country();
            country.name = item;
            countries.push(country);
        }
    }

    return countries;
};
