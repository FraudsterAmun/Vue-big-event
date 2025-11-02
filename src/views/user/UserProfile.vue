<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores/index'
import { updateUserInfo } from '@/api/user'

const userInfoStore = useUserStore()

const formModel = ref({
  id: userInfoStore.userInfo.id,
  username: userInfoStore.userInfo.username,
  nickname: userInfoStore.userInfo.nickname,
  email: userInfoStore.userInfo.email,
})
const formRef = ref(null)
const rules = ref({
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    { min: 2, max: 10, message: '用户昵称长度在2-10个字符之间', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]+$/, message: '用户昵称只能包含字母和数字', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: '请输入正确的邮箱格式',
      trigger: 'blur',
    },
  ],
})

const handleSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const res = await updateUserInfo(formModel.value)
      console.log(res)
      // ElMessage.success('修改成功')
      userInfoStore.getUserInfoData()
      // userInfoStore.setUserInfo(res.data)
    }
  })
}
</script>

<template>
  <PageContainer title="用户信息">
    <template #default>
      <el-form :model="formModel" label-width="120px" :rules="rules" ref="formRef">
        <el-form-item label="登录名称">
          <el-input v-model="formModel.username" disabled />
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="formModel.nickname" placeholder="请输入用户昵称" />
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="formModel.email" placeholder="请输入用户邮箱" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit" style="width: 100px">修改</el-button>
        </el-form-item>
      </el-form>
    </template>
  </PageContainer>
</template>

<style scoped>
.el-input {
  width: 300px;
}
</style>
