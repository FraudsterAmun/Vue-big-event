import request from '@/utils/request'

export const register = ({ username, password, repassword }) => {
  return request.post('/api/reg', { username, password, repassword })
}

export const login = ({ username, password }) => {
  return request.post('/api/login', { username, password })
}

export const getUserInfo = () => {
  return request.get('/my/userinfo')
}

export const updateUserInfo = ({ id, nickname, email }) => {
  return request.put('/my/userinfo', { id, nickname, email })
}

export const updateUserPassword = ({ old_pwd, new_pwd, re_pwd }) => {
  return request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })
}

export const updateUserAvatar = (avatar) => {
  return request.patch('/my/update/avatar', avatar)
}
