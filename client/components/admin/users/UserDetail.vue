<template>
    <b-row>
        <b-col>
            <b-row>
                <b-col sm="2">
                    Name:
                </b-col>
                <b-col sm="10">
                    {{ user.name }}
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="2">
                    Surname:
                </b-col>
                <b-col sm="10">
                    {{ user.surname }}
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="2">
                    E-mail:
                </b-col>
                <b-col sm="10">
                    {{ user.email }}
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="2">
                    Role:
                </b-col>
                <b-col sm="10">
                    {{ user.admin ? 'Admin' : 'User' }}
                </b-col>
            </b-row>
            <b-row v-if="favGenres.length">
                <b-col sm="2">
                    Favourite genres:
                </b-col>
                <b-col sm="10">
                    {{ favGenres.join(', ') }}
                </b-col>
            </b-row>
            <b-row v-if="notFavGenres.length">
                <b-col sm="2">
                    Favourite genres:
                </b-col>
                <b-col sm="10">
                    {{ notFavGenres.join(', ') }}
                </b-col>
            </b-row>
        </b-col>
    </b-row>
</template>

<script>
    export default {
        props: {
            user: {
                type: Object,
                required: true
            }
        },
        computed: {
            favGenres() {
                return this.getGenresByType(1);
            },
            notFavGenres() {
                return this.getGenresByType(-1);
            }
        },
        methods: {
            getGenresByType(type = 1) {
                const genres = [];
                if (this.user.favouriteGenres && this.user.favouriteGenres.length > 0) {
                    const favGenres = this.user.favouriteGenres.filter(item => item.type === type).map(item => item.genre.name);
                    genres.push(...favGenres);
                }

                return genres;
            }
        }
    };
</script>
