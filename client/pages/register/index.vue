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
            :rules="rules"
            @submit.native.prevent="onSubmit"
        >
            <el-form-item prop="name">
                <el-input
                    v-model="form.name"
                    placeholder="First name"
                ></el-input>
            </el-form-item>
            <el-form-item prop="surname">
                <el-input
                    v-model="form.surname"
                    placeholder="Surname"
                ></el-input>
            </el-form-item>
            <el-form-item prop="email">
                <el-input
                    v-model="form.email"
                    placeholder="E-mail address"
                ></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input
                    v-model="form.password"
                    placeholder="Password"
                    type="password"
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    class="button"
                    native-type="submit"
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
        layout: 'auth',
        data() {
            return {
                form: {
                    name: '',
                    surname: '',
                    email: '',
                    password: ''
                },
                title: 'Registration',
                error: null,
                closableAlert: false,
                rules: {
                    name: [
                        { required: true, message: 'Please input your first name', trigger: ['blur', 'change']  },
                        { min: 1, max: 100, message: 'Length should be 1 to 100', trigger: ['blur', 'change']  }
                    ],
                    surname: [
                        { required: true, message: 'Please input your surname', trigger: ['blur', 'change']  },
                        { min: 1, max: 100, message: 'Length should be 1 to 100', trigger: ['blur', 'change']  }
                    ],
                    email: [
                        { required: true, message: 'Please input your e-mail address', trigger: ['blur', 'change']  },
                        { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'] }
                    ],
                    password: [
                        { required: true, message: 'Please input your password', trigger: ['blur', 'change'] },
                        { min: 5, max: 255, message: 'Length should be 5 to 255', trigger: ['blur', 'change']  }
                    ]
                }
            };
        },
        head() {
            return {
                title: this.title
            };
        },
        auth: false,
        methods: {
            async onSubmit() {
                this.$refs['form'].validate(async (valid) => {
                    if (valid) {
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
                    } else {
                        return false;
                    }
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
        -webkit-box-shadow: 0 0 15px 0 rgba(0,0,0,0.75)
        -moz-box-shadow: 0 0 15px 0 rgba(0,0,0,0.75)
        box-shadow: 0 0 15px 0 rgba(0,0,0,0.75)
        .title-container
            width: 100%
            text-align: center
            margin-bottom: 20px
        .el-alert
            margin-bottom: 20px
        .button
            width: 100%
        .el-button--primary
            background-color: #17a2b8
            border-color: #17a2b8
</style>
