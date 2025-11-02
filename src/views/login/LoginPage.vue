<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { register, login } from '@/api/user'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/index'
import { useRouter } from 'vue-router'
const router = useRouter()
const isRegister = ref(false)
const form = ref()

const formModel = ref({
  username: '',
  password: '',
  repassword: '',
})
const regRules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'change' },
    { min: 6, max: 12, message: '用户名长度为6-12位', trigger: 'change' },
    { pattern: /^[a-zA-Z0-9]+$/, message: '用户名只能包含字母和数字', trigger: 'change' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'change' },
    { min: 6, max: 12, message: '密码长度为6-12位', trigger: 'change' },
    { pattern: /^[a-zA-Z0-9]+$/, message: '密码只能包含字母和数字', trigger: 'change' },
  ],
  repassword: [
    { required: true, message: '请输入再次密码', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error('两次密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'change',
    },
  ],
})
const handleRegister = async () => {
  try {
    await form.value.validate()
    const res = await register(formModel.value)
    if (res.data.code === 0) {
      isRegister.value = false
      ElMessage.success('注册成功')
    }
  } catch (error) {
    console.log('注册失败:', error)
    // ElMessage 错误提示已经在 request.js 的拦截器中处理了
  }
}

const userStore = useUserStore()

const handleLogin = async () => {
  try {
    await form.value.validate()
    const res = await login(formModel.value)
    if (res.data.code === 0) {
      userStore.setToken(res.data.token)
      ElMessage.success('登录成功')
      router.push('/')
    }
  } catch (error) {
    console.log('登录失败:', error)
  }
}

watch(isRegister, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: '',
  }
})
</script>

<template>
  <el-row class="login-page">
    <el-col :xs="0" :md="12" class="bg"></el-col>
    <el-col :xs="24" :md="6" :xs-offset="0" :md-offset="3" class="form">
      <el-form
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
        :model="formModel"
        :rules="regRules"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="formModel.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="handleRegister">
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false"> ← 返回 </el-link>
        </el-form-item>
      </el-form>
      <el-form
        :model="formModel"
        :rules="regRules"
        ref="form"
        size="large"
        autocomplete="off"
        v-else
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="handleLogin"
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true"> 注册 → </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    margin-left: 12.5%;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}

/* 📱 移动端适配 */
@media (max-width: 991px) {
  .login-page .form {
    padding: 0 20px;
    margin: 0;
  }
  .bg{
    display: none;
  }
}
</style>
