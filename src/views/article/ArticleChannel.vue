<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref, onMounted, computed } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { useChannelStore } from '@/stores/modules/article'
import ChannelDialog from './components/ChannelDialog.vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { delArticleChannel } from '@/api/article'
// 1. 使用分类数据管理Store
const channelStore = useChannelStore()
const channelDialogRef = ref()
const loading = ref(false)

// 2. 分页相关数据
const currentPage = ref(1) // 当前页码
const pageSize = ref(5) // 每页显示5条数据

// 3. 计算当前页显示的数据（从所有数据中截取一部分）
const paginatedChannelList = computed(() => {
  const allChannels = channelStore.channelList // 获取所有分类数据
  const start = (currentPage.value - 1) * pageSize.value // 计算开始位置
  const end = start + pageSize.value // 计算结束位置
  return allChannels.slice(start, end) // 截取当前页的数据
})

// 4. 计算总数据量
const total = computed(() => channelStore.channelList.length)
const onEditChannel = (row) => {
  channelDialogRef.value.openDialog(row)
}

const onDelChannel = (row) => {
  ElMessageBox.confirm('确定删除该分类吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await delArticleChannel(row.id)
        ElMessage.success('删除成功')
        // 刷新数据
        await reloadChannelData()
      } catch (error) {
        console.error('删除失败:', error)
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {
      // 用户取消删除，不需要提示
    })
}

// 5. 页面初始化时加载分类数据
const initChannelData = async () => {
  console.log('页面初始化，开始加载分类数据')
  loading.value = true // 显示加载状态
  try {
    // 调用Store的方法获取分类数据（可能使用缓存）
    await channelStore.getChannelList()
    console.log('分类数据加载完成')
  } catch (error) {
    console.error('获取分类列表失败:', error)
    ElMessage.error('获取分类列表失败')
  } finally {
    loading.value = false // 隐藏加载状态
  }
}

// 6. 刷新分类数据（添加/编辑/删除后调用）
const reloadChannelData = async () => {
  console.log('开始刷新分类数据')
  loading.value = true // 显示加载状态
  try {
    // 强制重新获取最新数据（不使用缓存）
    await channelStore.refreshChannelList()
    console.log('分类数据刷新完成')
  } catch (error) {
    console.error('刷新分类列表失败:', error)
    ElMessage.error('刷新分类列表失败')
  } finally {
    loading.value = false // 隐藏加载状态
  }
}

// 7. 分页相关的处理函数
const handleCurrentChange = (page) => {
  console.log(`用户点击了第${page}页`)
  currentPage.value = page // 更新当前页码
}

const handleSizeChange = (size) => {
  console.log(`用户改变每页显示${size}条数据`)
  pageSize.value = size // 更新每页显示条数
  currentPage.value = 1 // 重置到第一页
}

// 8. 页面挂载时自动加载数据
onMounted(() => {
  console.log('页面挂载完成，开始初始化数据')
  initChannelData()
})

// 9. 打开添加分类对话框
const addChannel = () => {
  console.log('打开添加分类对话框')
  channelDialogRef.value.openDialog({}) // 传入空对象表示新增
}
</script>

<template>
  <PageContainer title="分类管理">
    <template #extra>
      <el-button style="justify-content: flex-end" type="primary" @click="addChannel"
        >添加</el-button
      >
    </template>
    <el-table :data="paginatedChannelList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号">
        <template #default="{ $index }">
          {{ (currentPage - 1) * pageSize + $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="分类名称" prop="cate_name"></el-table-column>
      <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditChannel(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDelChannel(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[5, 10, 20, 50]"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      class="channel-pagination"
    />
  </PageContainer>
  <ChannelDialog ref="channelDialogRef" @refresh="reloadChannelData" />
</template>

<style scoped>
/* 分页样式 */
.channel-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.channel-pagination :deep(.el-pagination) {
  display: flex;
  align-items: center;
}

.channel-pagination :deep(.el-pagination__total),
.channel-pagination :deep(.el-pagination__sizes),
.channel-pagination :deep(.btn-prev),
.channel-pagination :deep(.btn-next),
.channel-pagination :deep(.el-pager) {
  display: flex;
  align-items: center;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .channel-pagination :deep(.el-pagination) {
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }

  /* 隐藏页码和跳转 */
  .channel-pagination :deep(.el-pager),
  .channel-pagination :deep(.el-pagination__jump) {
    display: none !important;
  }

  /* 总条数和每页条数 */
  .channel-pagination :deep(.el-pagination__total) {
    display: flex;
    align-items: center;
  }

  .channel-pagination :deep(.el-pagination__sizes) {
    display: flex;
    align-items: center;
  }

  .channel-pagination :deep(.btn-prev),
  .channel-pagination :deep(.btn-next) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
