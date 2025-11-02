import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfo } from '@/api/user'
export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref(null)
    const setToken = (tokenData) => (token.value = tokenData)
    const userInfo = ref({})
    const getUserInfoData = async () => {
      const res = await getUserInfo()
      userInfo.value = res.data.data
    }
    const setUserInfo = (userInfoData) => (userInfo.value = userInfoData)
    return { token, setToken, userInfo, getUserInfoData, setUserInfo }
  },
  {
    persist: true,
  },
)
