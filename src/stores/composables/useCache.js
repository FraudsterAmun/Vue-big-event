import { ref } from 'vue'

/**
 * 通用缓存 Hook
 * @param {Function} apiFunction - API 请求函数
 * @param {Function} dataExtractor - 数据提取函数，默认提取 res.data.data
 * @returns {Object} 缓存相关的状态和方法
 */
export function useCache(apiFunction, dataExtractor = (res) => res.data.data) {
  // 缓存状态
  const data = ref([])
  const total = ref(0)
  const loaded = ref(false)
  const currentParams = ref({})

  // 获取数据（带缓存）
  const getData = async (params = {}, forceRefresh = false) => {
    // 检查参数是否变化（仅当有参数时）
    const hasParams = Object.keys(params).length > 0
    const paramsChanged = hasParams 
      ? JSON.stringify(params) !== JSON.stringify(currentParams.value)
      : false

    // 缓存判断
    if (loaded.value && !paramsChanged && !forceRefresh) {
      return hasParams 
        ? { list: data.value, total: total.value }
        : data.value
    }

    try {
      const res = await apiFunction(params)
      const extractedData = dataExtractor(res)
      
      data.value = extractedData
      loaded.value = true
      
      // 如果有参数，记录参数并设置总数
      if (hasParams) {
        currentParams.value = { ...params }
        total.value = res.data.total || extractedData.length
        return { list: data.value, total: total.value }
      }
      
      return data.value
    } catch (error) {
      console.error('获取数据失败:', error)
      throw error
    }
  }

  // 刷新数据
  const refreshData = async (params = {}) => {
    const hasParams = Object.keys(params).length > 0
    if (hasParams && Object.keys(currentParams.value).length > 0) {
      return await getData(currentParams.value, true)
    }
    return await getData(params, true)
  }

  // 清除缓存
  const clearCache = () => {
    data.value = []
    total.value = 0
    loaded.value = false
    currentParams.value = {}
  }

  return {
    // 状态
    data,
    total,
    loaded,
    currentParams,
    
    // 方法
    getData,
    refreshData,
    clearCache,
  }
}
