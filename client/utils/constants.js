export const numOfGenres = 3;
export const numOfItems = 20;
export const cbRecTypes = [
    { value: 'tf-idf', text: 'TF-IDF (default)' },
    { value: 'lda', text: 'LDA' },
];
export const cbfRecTypes = [
    { value: 'svd', text: 'Single Value Decomposition (default)' },
    { value: 'item-based', text: 'Item-based approach' },
    { value: 'user-based', text: 'User-based approach' }
];
export const similarityTypes = [
    { value: 'cosine', text: 'Cosine' },
    { value: 'jaccard', text: 'Jaccard' },
    { value: 'euclidean', text: 'Euclidean' }
];
export const movieTypes = [
    { value: 'movie', text: 'Movie' },
    { value: 'series', text: 'Series' }
];
