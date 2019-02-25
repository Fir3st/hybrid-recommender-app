<template>
    <div class="login-form">
        <div class="title-container">
            <h1 class="h1">
                {{ title }}
            </h1>
        </div>
        <el-alert
            v-if="error"
            :title="error"
            :closable="closableAlert"
            type="error"
            show-icon
        >
        </el-alert>
        <el-form
            ref="form"
            :model="form"
        >
            <el-form-item>
                <el-input
                    v-model="form.name"
                    placeholder="First name"
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-input
                    v-model="form.surname"
                    placeholder="Last name"
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-input
                    v-model="form.email"
                    placeholder="E-mail address"
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-input
                    v-model="form.password"
                    placeholder="Password"
                    type="password"
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    class="btn"
                    @click="onSubmit"
                >
                    Register
                </el-button>
            </el-form-item>
        </el-form>
        <b-row class="text-center">
            <b-col>
                <nuxt-link to="/">
                    Go back to main page
                </nuxt-link>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    export default {
        head() {
            return {
                title: this.title
            };
        },
        layout: 'auth',
        auth: false,
        data() {
            return {
                form: {
                    name: '',
                    surname: '',
                    email: '',
                    password: ''
                },
                title: 'Sign up',
                error: null,
                closableAlert: false
            };
        },
        methods: {
            async onSubmit() {
                try {
                    await this.$axios.$post(`/users`, this.form);
                    this.$notify({
                        title: 'Success',
                        message: 'Your account has been successfully created.',
                        type: 'success',
                        position: 'bottom-right'
                    });
                    this.$router.push('/login');
                } catch (error) {
                    this.error = error.response.data.message;
                }
            }
        }
    };
</script>

<style lang="sass" scoped>
    .login-form
        width: 100%
        background: #fff
        padding: 20px
        -webkit-box-shadow: 0 0 15px 0 rgba(0,0,0,0.75)
        -moz-box-shadow: 0 0 15px 0 rgba(0,0,0,0.75)
        box-shadow: 0 0 15px 0 rgba(0,0,0,0.75)
        .title-container
            width: 100%
            text-align: center
            margin-bottom: 20px
        .el-alert
            margin-bottom: 20px
        .btn
            width: 100%
</style>
