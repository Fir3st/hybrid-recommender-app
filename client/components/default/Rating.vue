<template>
    <b-row v-if="isLogged">
        <b-col>
            <h2>Rate this movie</h2>
            <b-button-group>
                <b-button
                    v-for="i in getRatingValues()"
                    :key="i"
                    :variant="(userRating !== null && userRating === i) ? 'info' : 'default'"
                    :data-rating="i"
                    v-on="userRating !== i ? { click: rateMovie } : {}">{{ i }}</b-button>
            </b-button-group>
        </b-col>
    </b-row>
</template>

<script>
    export default {
        props: {
            isLogged: {
                type: Boolean,
                required: true
            },
            userRating: {
                type: Number | null,
                required: true
            },
            rateMovie: {
                type: Function,
                required: true
            }
        },
        methods: {
            getRatingValues() {
                const ratings = [];
                for (let i = 1; i <= 5; i += 0.5) {
                    ratings.push(i);
                }

                return ratings;
            }
        }
    };
</script>

<style lang="sass" scoped>
    h2
        padding: 20px 0
</style>
