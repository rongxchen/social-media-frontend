<template>
    <div class="login-page">
        <div class="login-left">

        </div>
        <div class="login-right">
            <div class="login-container">
                <!-- login card -->
                <el-card id="login-form" class="login-form">
                    <h3>Sign in</h3>
                    <el-form
                        ref="loginFormRef"
                        :model="loginForm"
                        status-icon
                        :rules="loginRules"
                        label-position="top"
                        label-width="auto"
                    >
                        <el-form-item prop="email" label="Email">
                            <el-input v-model="loginForm.email" clearable></el-input>
                        </el-form-item>
                        <el-form-item prop="password" label="Password">
                            <el-input v-model="loginForm.password" type="password" clearable></el-input>
                        </el-form-item>
                        <el-form-item>
                            <div class="login-operation">
                                <el-checkbox v-model="rememberMe">
                                    <span :style="gretTextStyle">Remember me</span>
                                </el-checkbox>
                                <el-link :style="gretTextStyle" @click="changeForm('forgot')">
                                    Forgot password
                                </el-link>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <div class="login-button">
                                <a-spin :spinning="loginLoading">
                                    <el-button @click="login" class="login-button" type="primary">Login</el-button>
                                </a-spin>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <div class="sign-up-link">
                                <span>Do not have an account yet? </span>
                                <el-link @click="changeForm('register')" style="margin-left: 5px;">Sign up here</el-link>
                            </div>
                        </el-form-item>
                    </el-form>
                </el-card>
                <!-- register form -->
                <el-card id="register-form" class="register-form">
                    <h3>Sign up</h3>
                    <el-form
                        ref="registerFormRef"
                        :model="registerForm"
                        status-icon
                        :rules="registerRules"
                        label-position="top"
                        label-width="auto"
                        size="small"
                    >
                        <el-form-item prop="email" label="Email">
                            <el-input v-model="registerForm.email" clearable></el-input>
                        </el-form-item>
                        <el-form-item prop="username" label="Username">
                            <el-input v-model="registerForm.username" clearable></el-input>
                        </el-form-item>
                        <el-form-item prop="password" label="Password">
                            <el-input v-model="registerForm.password" type="password" clearable></el-input>
                        </el-form-item>
                        <el-form-item prop="checkPassword" label="Confirm password">
                            <el-input v-model="registerForm.checkPassword" type="password" clearable></el-input>
                        </el-form-item>
                        <el-form-item prop="code" label="Code">
                            <el-input v-model="registerForm.code">
                                <template #append>
                                    <el-button @click="sendVerificationCode" :disabled="isButtonDisabled">{{ buttonLabel }}</el-button>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <div>
                                <a-spin :spinning="registerLoading">
                                    <el-button @click="register" class="register-button-single" type="warning">Register</el-button>
                                    <el-button @click="changeForm('login')" class="register-button-single" type="primary">Back</el-button>
                                </a-spin>
                            </div>
                        </el-form-item>
                    </el-form>
                </el-card>
                <!-- send reset password -->
                <el-card id="forgot-form" class="login-form">
                    <h3>Forgot password</h3>
                    <el-form
                        ref="forgotFormRef"
                        :model="forgotForm"
                        status-icon
                        :rules="forgotFormRules"
                        label-position="top"
                        label-width="auto"
                    >
                        <el-form-item prop="email" label="Email">
                            <el-input v-model="forgotForm.email" clearable></el-input>
                        </el-form-item>
                        <el-form-item>
                            <div>
                                <a-spin :spinning="forgotLoading">
                                    <el-button @click="sendForgotEmail" class="register-button-single" type="warning">Send mail</el-button>
                                    <el-button @click="changeForm('login')" class="register-button-single" type="primary">Back</el-button>
                                </a-spin>
                            </div>
                        </el-form-item>
                    </el-form>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import store from "../store";
import { SHA256 } from "../utils/encryption";

const url = store.getters.url;

export default {
    name: "LoginPage",
    data() {
        return {
            gretTextStyle: {"color": store.getters.greyColor},
            loginForm: {email: "", password: ""},
            loginRules: {
                email: [
                    {required: true, message: "Enter email", trigger: "blur"},
                    {type: 'email', message: 'Please enter a valid email', trigger: ['blur', 'change']}
                ],
                password: [
                    {required: true, message: "Enter password", trigger: "blur"},
                    {min: 8, max: 20, message: 'Length of password should be between 8 and 20', trigger: ['blur', 'change'] }
                ],
            },
            loginLoading: false,
            rememberMe: false,
            registerForm: {email: "", username: "", password: "", checkPassword: ""},
            registerRules: {
                email: [
                    {required: true, message: "Enter email", trigger: "blur"},
                    {type: 'email', message: 'Please enter a valid email', trigger: ['blur', 'change']}
                ],
                username: [
                    {required: true, message: "Enter username", trigger: "blur"},
                    {min: 1, max: 50, message: 'Length of username should be between 1 and 50', trigger: ['blur', 'change']}
                ],
                code: [
                    {required: true, message: "Enter code", trigger: "blur"},
                    {min: 6, max: 6, message: 'Length of code should be between 1 and 50', trigger: ['blur', 'change']}
                ],
                password: [
                    {required: true, message: "Enter password", trigger: "blur"},
                    {min: 8, max: 20, message: 'Length of password should be between 8 and 20', trigger: ['blur', 'change']}
                ],
                checkPassword: [
                    {required: true, message: "Enter password", trigger: "blur"},
                    {min: 8, max: 20, message: 'Length of password should be between 8 and 20', trigger: ['blur', 'change']},
                    {validator: this.checkPassowrdMatch, trigger: ['blur', 'change']}
                ]
            },
            registerLoading: false,
            code: "",
            isButtonDisabled: false,
            buttonLabel: "Send",
            timeRemaining: 60,
            timer: null,
            forgotForm: {email: ""},
            forgotFormRules: {
                email: [
                    {required: true, message: "Enter email", trigger: "blur"},
                    {type: 'email', message: 'Please enter a valid email', trigger: ['blur', 'change']}
                ],
            },
            forgotLoading: false,
        }
    },
    methods: {
        checkPassowrdMatch(rule, value, callback) {
            if (value !== this.registerForm.password) {
                callback(new Error('Passwords do not match'));
            } else {
                callback();
            }
        },
        login() {
            this.$refs.loginFormRef.validate(async (valid) => {
                if (valid) {
                    console.log(this.rememberMe);
                    if (this.rememberMe) {
                        this.setCookie(this.loginForm.email, this.loginForm.password, 7);
                    }
                    this.loginLoading = true;
                    await axios.post(url + "/api/users/login", {
                        email: this.loginForm.email,
                        password: SHA256(this.loginForm.password)
                    }).then((res) => {
                        if (res.data.code !== 0) {
                            this.$message.error(res.data.message);
                            return;
                        }
                        localStorage.setItem("accessToken", res.data.data.accessToken);
                        localStorage.setItem("refreshToken", res.data.data.refreshToken);
                        localStorage.setItem("userInfo", JSON.stringify(res.data.data.userInfo));
                        this.$router.push("/home");
                    })
                    this.loginLoading = false;
                } else {
                    this.$message.warning("check login form");
                }
            })
        },
        async sendVerificationCode() {
            if (this.registerForm.email.trim() === "") {
                this.$message.warning("please enter email first");
                return;
            }
            if (!this.isButtonDisabled) {
                this.isButtonDisabled = true;
                let canSend = true;
                await axios.post(url + "/api/users/send-verification-code", {
                    email: this.registerForm.email
                }).then((res) => {
                    if (res.status != 200 || res.data.code !== 0) {
                        this.$message.warning(res.status != 200 ? res.data.detail : res.data.message);
                        canSend = false;
                    } else {
                        this.$message.success(res.data.message);
                    }
                })
                if (!canSend) {
                    this.isButtonDisabled = false;
                    return;
                }
                this.buttonLabel = `${this.timeRemaining}s`;
                this.timer = setInterval(() => {
                    this.timeRemaining--;
                    if (this.timeRemaining === 0) {
                        clearInterval(this.timer);
                        this.isButtonDisabled = false;
                        this.buttonLabel = 'Send';
                        this.timeRemaining = 60;
                    } else {
                        this.buttonLabel = `${this.timeRemaining}s`;
                    }
                }, 1000);
            }
        },
        register() {
            this.$refs.registerFormRef.validate(async (valid) => {
                if (valid) {
                    this.registerLoading = true;
                    await axios.post(url + "/api/users/register?code=" + this.registerForm.code, {
                        email: this.registerForm.email,
                        username: this.registerForm.username,
                        password: SHA256(this.registerForm.password)
                    }).then((res) => {
                        if (res.data.code !== 0) {
                            this.$message.error(res.data.message);
                            return;
                        } else {
                            Object.keys(this.registerForm).forEach((key) => {
                                this.registerForm[key] = "";
                            })
                            this.$message.success(res.data.message);
                            this.changeForm("login");
                        }
                    })
                    this.registerLoading = false;
                } else {
                    this.$message.warning("check register form");
                }
            })
        },
        sendForgotEmail() {
            this.$refs.forgotFormRef.validate(async (valid) => {
                if (valid) {
                    this.forgotLoading = true;
                    await axios.post(url + "/api/users/send-forgot-password", {
                        email: this.forgotForm.email,
                    }).then((res) => {
                        if (res.data.code === 0) {
                            this.$message.success(res.data.message);
                            this.forgotForm.email = "";
                            this.changeForm("login");
                        } else {
                            this.$message.error(res.data.message);
                        }
                    })
                    this.forgotLoading = false;
                } else {
                    this.$message.warning("check your email");
                }
            })
        },
        changeForm(to) {
            if (to == "login") {
                document.getElementById("login-form").style.display = "block";
                document.getElementById("register-form").style.display = "none";
                document.getElementById("forgot-form").style.display = "none";
            } else if (to == "register") {
                document.getElementById("login-form").style.display = "none";
                document.getElementById("register-form").style.display = "block";
                document.getElementById("forgot-form").style.display = "none";
            } else if (to == "forgot") {
                document.getElementById("login-form").style.display = "none";
                document.getElementById("register-form").style.display = "none";
                document.getElementById("forgot-form").style.display = "block";
            }
        },
        // cookie operations
        setCookie(email, password, days) {
            let date = new Date();
            date.setTime(date.getTime() + 1000 * 60 * 60 * 24 * days);
            document.cookie = `email=${email};path=/;expires=${date.toGMTString()}`;
            document.cookie = `password=${password};path=/;expires=${date.toGMTString()}`;
        },
        getCookie() {
            if (document.cookie.length > 0) {
                let arr = document.cookie.split("; ");
                for (const a of arr) {
                    let arr2 = a.split("=");
                    if (arr2[0] === "email") {
                        this.loginForm.email = arr2[1];
                        this.rememberMe = true;
                    } else if (arr2[0] === "password") {
                        this.loginForm.password = arr2[1];
                    }
                }
            }
        },
        clearCookie() {
            this.setCookie("", "", -1);
        }
    },
    mounted() {
        document.getElementById("register-form").style.display = "none";
        document.getElementById("forgot-form").style.display = "none";
        this.getCookie();
    }
}
</script>

<style>
.login-page {
    display: flex;
    width: 100%;
}
.login-left {
    width: 50%;
}
.login-right {
    width: 50%;
    display: flex;
    justify-content: flex-end;
}
.login-container {
    height: 100vh;
    display: flex;
    align-items: center;
    margin-right: 30px;
}
.login-form {
    width: 380px;
    height: 400px;
}
.login-operation {
    width: 100%;
    display: flex;
    justify-content: space-between;
}
.login-button {
    width: 100%;
}
.sign-up-link {
    width: 100%;
    display: flex;
    justify-content: center;
}
.register-form {
    width: 380px;
    height: 500px;
}
.register-button-single {
    width: 80px
}
</style>
