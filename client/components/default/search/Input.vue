<template>
    <b-row>
        <b-col>
            <input
                :value="searchTerm"
                class="form-control search"
                type="text"
                placeholder="Type to search"
                @input="onChange"
            />
        </b-col>
    </b-row>
</template>

<script>
    export default {
        props: {
            onChange: {
                type: Function,
                required: true
            },
            searchTerm: {
                type: String,
                required: true
            }
        }
    };
</script>

<style lang="sass">
    .search
        background: transparent
        border: 0
        font-size: 24px
        padding: 20px 10px
        border-bottom: 1px solid #17a2b8
        color: #fff

    .search:focus
        background: transparent
        color: #fff
        outline: none
        -webkit-box-shadow: none !important
        -moz-box-shadow: none !important
        box-shadow: none !important
</style>
