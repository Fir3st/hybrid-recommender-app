<template>
    <b-row>
        <b-col class="d-flex justify-content-center mb-3 loading">
            <b-button
                v-if="count > movies.length"
                variant="info"
                @click="loadMore"
            >
                Load more
            </b-button>
        </b-col>
    </b-row>
</template>

<script>
    export default {
        props: {
            count: {
                type: Number,
                required: true
            },
            movies: {
                type: Array,
                required: true
            },
            loadMore: {
                type: Function,
                required: true
            }
        }
    };
</script>
