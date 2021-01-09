<template lang="pug">
    div
        b-row(v-if="group.users && group.users.length", class="mb-3")
            b-col
                strong Number of users in group:
                span  {{ group.users.length }}
        b-row
            b-col
                b-table(v-if="group.users && group.users.length", :items="group.users")
</template>

<script>
    export default {
        props: {
            group: {
                type: Object,
                required: true
            }
        },
    };
</script>
