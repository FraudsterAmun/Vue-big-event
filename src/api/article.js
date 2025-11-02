import request from '@/utils/request'

export const getArticleChannel = () => request.get('/my/cate/list')

export const addArticleChannel = (data) => request.post('/my/cate/add', data)

export const editArticleChannel = (data) => request.put('/my/cate/info', data)

export const delArticleChannel = (id) => request.delete(`/my/cate/del`, { params: { id } })

export const articleGetListService = (params) => request.get('/my/article/list', { params })

export const addArticleService = (data) => request.post('/my/article/add', data)

export const getArticleInfoService = (id) => request.get('/my/article/info', { params: { id } })

export const editArticleService = (data) => request.put('/my/article/info', data)
