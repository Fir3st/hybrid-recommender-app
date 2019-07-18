export const containedGenres = (genres, searchQuery) => {
    const query = searchQuery.toLowerCase();
    genres = genres.map(genre => genre.name.toLowerCase()).join('|');

    return query.match(new RegExp(genres, 'g'));
};

export const containedTypes = (types, searchQuery) => {
    const query = searchQuery.toLowerCase();
    types = types.map(type => type.toLowerCase()).join('|');

    return query.match(new RegExp(types, 'g'));
};
