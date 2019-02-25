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
        }
    };
</script>
