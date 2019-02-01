<template>
    <b-nav-form>
        <b-form-input
            class="mr-sm-2"
            type="text"
            placeholder="Search"></b-form-input>
        <b-button
            variant="outline-primary"
            class="my-2 my-sm-0"
            type="submit"
            @click.prevent="onSubmit">Search</b-button>
    </b-nav-form>
</template>

<script>
    export default {
        methods: {
            onSubmit() {
                console.log('submitted');
            }
        }
    };
</script>

<style lang="sass">
    .btn-outline-primary
        color: #17a2b8 !important
        border-color: #17a2b8 !important
    .btn-outline-primary:hover
        background: #17a2b8 !important
        color: #232323 !important
    .btn-outline-primary:focus, .btn-outline-primary:active
        -webkit-box-shadow: 0 0 10px 0 rgba(23,162,184,0.2)
        -moz-box-shadow: 0 0 10px 0 rgba(23,162,184,0.2)
        box-shadow: 0 0 10px 0 rgba(23,162,184,0.2)
</style>
