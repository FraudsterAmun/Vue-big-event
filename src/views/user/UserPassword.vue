<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores/index'
import { updateUserPassword } from '@/api/user'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
const userInfoStore = useUserStore()

const formModel = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: '',
})
const rules = ref({
  old_pwd: [
    { required: true, message: '请输入旧密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20个字符之间', trigger: 'blur' },
  ],
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20个字符之间', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9!@#$%^&*()_+=[\]{}|;':",./<>?-]+$/,
      message: '密码只能包含字母、数字和特殊字符',
      trigger: 'blur',
    },
  ],
  re_pwd: [
    { required: true, message: '请输入确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.new_pwd) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})
const formRef = ref(null)
const router = useRouter()
const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    const res = await updateUserPassword(formModel.value)
    ElMessage.success('修改成功，请重新登录')
    formModel.value.old_pwd = ''
    formModel.value.new_pwd = ''
    formModel.value.re_pwd = ''
    userInfoStore.setUserInfo({})
    userInfoStore.setToken('')
    router.replace('/login')
    console.log(res)
  } catch (error) {
    console.log(error)
  }
}
</script>
<template>
  <PageContainer title="修改密码">
    <template #default>
      <el-form :model="formModel" label-width="120px" :rules="rules" ref="formRef">
        <el-form-item label="旧密码" prop="old_pwd">
          <el-input v-model="formModel.old_pwd" placeholder="请输入旧密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="new_pwd">
          <el-input v-model="formModel.new_pwd" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="re_pwd">
          <el-input v-model="formModel.re_pwd" placeholder="请输入确认密码" />
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
