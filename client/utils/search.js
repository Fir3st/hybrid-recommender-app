export const containedGenres = (genres, searchQuery) => {
    genres = genres.map(genre => genre.name.toLowerCase()).join('|');

    return searchQuery.match(new RegExp(genres, 'g'));
};

export const containedTypes = (types, searchQuery) => {
    types = types.map(type => type.toLowerCase()).join('|');

    return searchQuery.match(new RegExp(types, 'g'));
};
