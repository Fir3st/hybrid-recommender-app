<template>
    <div class="login-form">
        <div class="title-container">
            <h1 class="h1">{{ title }}</h1>
        </div>
        <el-alert
            v-if="error"
            :title="error"
            :closable="closableAlert"
            type="error"
            show-icon>
        </el-alert>
        <el-form
            ref="form"
            :model="form">
            <el-form-item>
                <el-input
                    v-model="form.email"
                    placeholder="E-mail address"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input
                    v-model="form.password"
                    placeholder="Password"
                    type="password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    class="btn"
                    @click="onSubmit">Log in</el-button>
            </el-form-item>
        </el-form>
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
        data() {
            return {
                form: {
                    email: '',
                    password: ''
                },
                title: 'Sign in',
                error: null,
                closableAlert: false
            };
        },
        methods: {
            async onSubmit() {
                return this.$auth.loginWith('local', {
                    data: {
                        email: this.form.email,
                        password: this.form.password
                    }
                })
                .then(() => {
                    this.$notify({
                        title: 'Success',
                        message: 'You have been successfully logged into system.',
                        type: 'success',
                        position: 'bottom-right'
                    });
                })
                .catch((error) => {
                    this.error = error.response.data.message;
                    this.form.email = '';
                    this.form.password = '';
                });
            }
        }
    };
</script>

<style lang="sass" scoped>
    .login-form
        width: 100%
        background: #fff
        padding: 20px
        -webkit-box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.75)
        -moz-box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.75)
        box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.75)
    .title-container
        width: 100%
        text-align: center
        margin-bottom: 20px
    .el-alert
        margin-bottom: 20px
    .btn
        width: 100%
</style>
