<template>
    <b-row>
        <b-col>
            <b-form>
                <b-form-group
                    label="Item"
                >
                    <p><strong>Selected item:</strong> {{ settings.selectedItem ? settings.selectedItem.title : 'Nothing selected' }}</p>
                    <SearchInput
                        :search-term="searchTerm"
                        :on-change="search"
                        :suggestions="suggestions"
                        :on-select="selectItem"
                    />
                </b-form-group>
                <b-form-group
                    id="take"
                    label="Number of results"
                    label-for="take"
                >
                    <b-form-input
                        id="take"
                        :value="settings.take"
                        type="number"
                        min="1"
                        required
                        placeholder="Enter number of results"
                        @change="changeTake"
                    ></b-form-input>
                </b-form-group>
            </b-form>
        </b-col>
    </b-row>
</template>

<script>
    import { CancelToken } from 'axios';
    import SearchInput from '~/components/default/questionnaire/Input';

    export default {
        components: {
            SearchInput
        },
        props: {
            settings: {
                type: Object,
                required: true
            },
            changeSettingsHandler: {
                type: Function,
                required: true
            }
        },
        data() {
            return {
                source: CancelToken.source(),
                minLength: 3,
                selectedItem: null,
                searchTerm: '',
                suggestions: []
            };
        },
        methods: {
            changeId(value) {
                this.changeSettingsHandler('general', 'movieId', parseInt(value));
            },
            changeSelectedItem(value) {
                this.changeSettingsHandler('general', 'selectedItem', value);
            },
            changeTake(value) {
                this.changeSettingsHandler('general', 'take', parseInt(value));
            },
            requestReset() {
                this.source.cancel('Request cancelled.');
                this.source = CancelToken.source();
            },
            stateReset() {
                this.suggestions = [];
                this.requestReset();
            },
            async search(event) {
                this.searchTerm = event.target.value;
                this.stateReset();
                if (this.searchTerm && this.searchTerm.length > this.minLength) {
                    try {
                        const url = `/movies/search?query=${this.searchTerm}&take=100`;
                        const response = await this.$axios.$get(url, { cancelToken: this.source.token });
                        const { movies } = response;
                        if (movies && movies.length > 0) {
                            this.suggestions = movies;
                        }
                    } catch (error) {
                        console.log(error.message);
                    }
                }
            },
            selectItem(id) {
                const movieIndex = this.suggestions.findIndex(item => item.id === id);
                if (movieIndex > -1) {
                    this.changeSelectedItem(this.suggestions[movieIndex]);
                }
                this.stateReset();
                this.changeId(this.settings.selectedItem.id);
                this.searchTerm = '';
            }
        }
    };
</script>
