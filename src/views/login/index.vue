<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>登录</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true" class="ion-padding dark-bg">
            <div class="login-container">
                <ion-list lines="none" class="dark-list">
                    <ion-item class="dark-item">
                        <ion-label position="stacked" class="dark-label">账号</ion-label>
                        <ion-input v-model="account" placeholder="请输入邮箱或手机号" type="text" clear-input
                            class="dark-input"></ion-input>
                    </ion-item>
                    <ion-item class="dark-item">
                        <ion-label position="stacked" class="dark-label">密码</ion-label>
                        <ion-input v-model="password" placeholder="请输入密码" type="password" clear-input
                            class="dark-input"></ion-input>
                    </ion-item>
                </ion-list>
                <ion-button expand="block" color="primary" @click="onLogin">
                    登录
                </ion-button>
                <ion-button expand="block" fill="outline" @click="onRegister">
                    注册
                </ion-button>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton
} from '@ionic/vue'
import { useRouter } from 'vue-router'
import axiosInstance from '@/api'
import { useMainStore } from '@/store/modules/main.store'

const account = ref('')
const password = ref('')
const router = useRouter()

const onLogin = () => {
    axiosInstance.post('/api/login', {
        email: account.value,
        password: password.value
    }).then(res => {
        if (res.data.success) {
            localStorage.setItem('token', res.data.token)
            router.push('/pages/home')

            useMainStore().user_id = res.data.data.user_id
            useMainStore().user_name = res.data.data.user_name
            useMainStore().user_avatar = res.data.data.user_avatar
        } else {
            console.log(res.data.error)
        }
    })
}

const onRegister = () => {
    // 跳转注册页或注册逻辑
    router.push('/register')
}
</script>

<style scoped>
.dark-bg {
    --background: #18181c;
    background: #18181c;
    min-height: 100vh;
}

.login-container {
    max-width: 400px;
    margin: 60px auto 0 auto;
    padding: 24px;
    background: rgba(35, 35, 43, 0.98);
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18);
}

.dark-list {
    background: transparent;
}

.dark-item {
    --background: transparent;
    background: transparent;
}

.dark-label {
    color: #e0e0e0;
}

.dark-input {
    --color: #fff;
    color: #fff;
}

ion-title {
    color: #fff;
}
</style>