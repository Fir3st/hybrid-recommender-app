<template lang="pug">
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
