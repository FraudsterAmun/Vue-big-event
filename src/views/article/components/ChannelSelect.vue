<script setup>
import { onMounted } from 'vue'
import { useChannelStore } from '@/stores/modules/article'

// 1. 双向绑定的值
const modelValue = defineModel('modelValue')

// 2. 使用分类Store
const channelStore = useChannelStore()

// 3. 组件挂载时加载分类数据
onMounted(async () => {
  console.log('分类选择组件挂载，开始加载分类数据')
  try {
    // 调用Store获取分类数据（可能使用缓存）
    await channelStore.getChannelList()
    console.log('分类数据加载完成')
  } catch (error) {
    console.error('加载分类数据失败:', error)
  }
})
</script>
<template>
  <!-- 分类选择下拉框 -->
  <el-select placeholder="请选择分类" v-model="modelValue" clearable style="width: 200px">
    <el-option
      v-for="item in channelStore.channelList"
      :key="item.id"
      :label="item.cate_name"
      :value="item.id"
    />
  </el-select>
</template>
