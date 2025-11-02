import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getArticleChannel, articleGetListService } from '@/api/article'

// 分类管理 Store - 管理文章分类数据
export const useChannelStore = defineStore('channel', () => {
  // 1. 定义数据状态
  const channelList = ref([]) // 存储分类列表数据
  const isLoaded = ref(false) // 记录是否已经加载过数据

  // 2. 获取分类列表的函数
  const getChannelList = async (forceRefresh = false) => {
    // 如果已经加载过数据，且不是强制刷新，就直接返回缓存的数据
    if (isLoaded.value && !forceRefresh) {
      console.log('使用缓存数据')
      return channelList.value
    }

    try {
      console.log('发送网络请求获取数据')
      // 调用API获取数据
      const response = await getArticleChannel()
      // 保存数据到store
      channelList.value = response.data.data
      // 标记为已加载
      isLoaded.value = true
      return channelList.value
    } catch (error) {
      console.error('获取分类列表失败:', error)
      throw error
    }
  }

  // 3. 刷新分类列表的函数（强制重新获取数据）
  const refreshChannelList = async () => {
    console.log('强制刷新分类数据')
    return await getChannelList(true) // 传入true表示强制刷新
  }

  // 4. 清除缓存的函数
  const clearCache = () => {
    console.log('清除分类缓存')
    channelList.value = []
    isLoaded.value = false
  }

  // 5. 返回给外部使用的数据和方法
  return {
    // 数据
    channelList, // 分类列表
    isLoaded, // 是否已加载

    // 方法
    getChannelList, // 获取分类列表
    refreshChannelList, // 刷新分类列表
    clearCache, // 清除缓存
  }
})

// 文章管理 Store - 管理文章列表数据
export const useArticleStore = defineStore('article', () => {
  // 1. 定义数据状态
  const articleList = ref([]) // 存储文章列表数据
  const articleTotal = ref(0) // 文章总数
  const isLoaded = ref(false) // 记录是否已经加载过数据
  const lastSearchParams = ref({}) // 记录上次搜索的参数

  // 2. 获取文章列表的函数
  const getArticleList = async (searchParams, forceRefresh = false) => {
    // 检查搜索参数是否变化了
    const paramsChanged = JSON.stringify(searchParams) !== JSON.stringify(lastSearchParams.value)

    // 如果已经加载过数据，参数没变，且不是强制刷新，就直接返回缓存的数据
    if (isLoaded.value && !paramsChanged && !forceRefresh) {
      console.log('使用缓存的文章数据')
      return {
        list: articleList.value,
        total: articleTotal.value,
      }
    }

    try {
      console.log('发送网络请求获取文章数据')
      // 调用API获取数据
      const response = await articleGetListService(searchParams)
      // 保存数据到store
      articleList.value = response.data.data
      articleTotal.value = response.data.total
      // 记录这次的搜索参数
      lastSearchParams.value = { ...searchParams }
      // 标记为已加载
      isLoaded.value = true

      return {
        list: articleList.value,
        total: articleTotal.value,
      }
    } catch (error) {
      console.error('获取文章列表失败:', error)
      throw error
    }
  }

  // 3. 刷新文章列表的函数（强制重新获取数据）
  const refreshArticleList = async () => {
    console.log('强制刷新文章数据')
    // 如果有上次的搜索参数，就用上次的参数重新搜索
    if (Object.keys(lastSearchParams.value).length > 0) {
      return await getArticleList(lastSearchParams.value, true)
    }
  }

  // 4. 清除缓存的函数
  const clearCache = () => {
    console.log('清除文章缓存')
    articleList.value = []
    articleTotal.value = 0
    isLoaded.value = false
    lastSearchParams.value = {}
  }

  // 5. 返回给外部使用的数据和方法
  return {
    // 数据
    articleList, // 文章列表
    articleTotal, // 文章总数
    isLoaded, // 是否已加载
    lastSearchParams, // 上次搜索参数

    // 方法
    getArticleList, // 获取文章列表
    refreshArticleList, // 刷新文章列表
    clearCache, // 清除缓存
  }
})
