<template>
    <li>
        <b-row>
            <b-col>
                <b-img
                    :src="image"
                    fluid
                    :alt="recommendation.title"
                    width="75px"
                />
            </b-col>
            <b-col class="align-self-center">
                <nuxt-link :to="`/detail/${recommendation.id}`">
                    #{{ recommendation.id }}
                </nuxt-link>
            </b-col>
            <b-col class="align-self-center">
                {{ recommendation.title }}
            </b-col>
            <b-col class="align-self-center">
                {{ recommendation.year }}
            </b-col>
            <b-col class="align-self-center">
                <el-button
                    type="danger"
                    icon="el-icon-close"
                    circle
                    @click="setNotRelevant"
                />
                <el-button
                    type="success"
                    icon="el-icon-check"
                    circle
                    @click="setRelevant"
                />
            </b-col>
            <b-col class="align-self-center">
                {{ recommendation.relevance === true ? 'Relevant' : '' }}
                {{ recommendation.relevance === false ? 'Not relevant' : '' }}
            </b-col>
        </b-row>
    </li>
</template>

<script>
    export default {
        props: {
            recommendation: {
                type: Object,
                required: true
            },
            recType: {
                type: String,
                required: true
            },
            setRelevanceHandler: {
                type: Function,
                required: true
            }
        },
        computed: {
            image() {
                const hasImage = this.recommendation.poster !== null && this.recommendation.poster !== '' && this.recommendation.poster !== 'N/A';
                return hasImage ? this.recommendation.poster : '://via.placeholder.com/160x200';
            }
        },
        methods: {
            setRelevant() {
                this.setRelevanceHandler(this.recType, this.recommendation.id, true);
            },
            setNotRelevant() {
                this.setRelevanceHandler(this.recType, this.recommendation.id, false);
            }
        }
    };
</script>

<style lang="sass" scoped>
    .row
        min-height: 50px
</style>
