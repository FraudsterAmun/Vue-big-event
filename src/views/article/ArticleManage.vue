<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref, onMounted } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ArticleEdit from './components/AtricleEdit.vue'
import ChannelSelect from './components/ChannelSelect.vue'
import { useArticleStore, useChannelStore } from '@/stores/modules/article'

// 1. 使用Store管理数据
const articleStore = useArticleStore() // 文章数据管理
const channelStore = useChannelStore() // 分类数据管理

// 2. 页面状态
const loading = ref(false) // 加载状态

// 3. 搜索参数
const searchParams = ref({
  pagenum: 1, // 当前页码
  pagesize: 10, // 每页显示条数
  cate_id: '', // 分类ID（筛选条件）
  state: '', // 文章状态（筛选条件）
})
// 4. 获取文章列表数据
const loadArticleList = async () => {
  console.log('开始加载文章列表，搜索参数：', searchParams.value)
  loading.value = true // 显示加载状态
  try {
    // 调用Store获取文章数据（可能使用缓存）
    const result = await articleStore.getArticleList(searchParams.value)
    console.log('文章数据加载完成：', result)
  } catch (error) {
    console.error('获取文章列表失败:', error)
  } finally {
    loading.value = false // 隐藏加载状态
  }
}

// 5. 获取分类列表数据（用于筛选下拉框）
const loadChannelList = async () => {
  console.log('开始加载分类列表')
  try {
    // 调用分类Store获取分类数据
    await channelStore.getChannelList()
    console.log('分类数据加载完成')
  } catch (error) {
    console.error('获取分类列表失败:', error)
  }
}

// 格式化日期函数
const formatDate = (row, column, cellValue) => {
  if (!cellValue) return ''
  const date = new Date(cellValue)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}年${month}月${day}日`
}

// 6. 文章操作相关函数
const articleEditRef = ref() // 文章编辑组件引用

const onAddArticle = () => {
  console.log('打开添加文章对话框')
  articleEditRef.value.openDrawer() // 打开编辑抽屉，不传参数表示新增
}

const onEditArticle = (row) => {
  console.log('打开编辑文章对话框，文章数据：', row)
  articleEditRef.value.openDrawer(row) // 打开编辑抽屉，传入文章数据表示编辑
}

// 7. 搜索和筛选相关函数
const onSearch = () => {
  console.log('开始搜索，参数：', searchParams.value)
  searchParams.value.pagenum = 1 // 搜索时重置到第一页
  loadArticleList() // 重新加载文章列表
}

const onReset = () => {
  console.log('重置搜索条件')
  // 重置所有搜索参数
  searchParams.value = {
    pagenum: 1,
    pagesize: 10,
    cate_id: '',
    state: '',
  }
  loadArticleList() // 重新加载文章列表
}

// 8. 分页处理函数
const handleCurrentChange = (page) => {
  console.log(`用户点击了第${page}页`)
  searchParams.value.pagenum = page // 更新页码
  loadArticleList() // 重新加载文章列表
}

const handleSizeChange = (size) => {
  console.log(`用户改变每页显示${size}条数据`)
  searchParams.value.pagesize = size // 更新每页条数
  searchParams.value.pagenum = 1 // 重置到第一页
  loadArticleList() // 重新加载文章列表
}

// 10. 文章操作成功后的回调
const reloadArticleData = async () => {
  console.log('文章操作成功，刷新文章列表')
  await articleStore.refreshArticleList() // 强制刷新文章数据
}

// 11. 删除文章（暂未实现）
const onDelArticle = (row) => {
  console.log('删除文章功能暂未实现，文章数据：', row)
  // TODO: 实现删除文章功能
}

// 12. 页面初始化
onMounted(() => {
  console.log('文章管理页面挂载完成，开始初始化数据')
  loadArticleList() // 加载文章列表
  loadChannelList() // 加载分类列表（用于筛选下拉框）
})
</script>

<template>
  <PageContainer title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">新增文章</el-button>
    </template>

    <!-- 搜索筛选表单 -->
    <el-form :model="searchParams" class="filter-form" inline>
      <el-form-item label="文章分类:" prop="cate_id">
        <channel-select v-model="searchParams.cate_id" />
      </el-form-item>

      <el-form-item label="发布状态:" prop="state">
        <el-select v-model="searchParams.state" placeholder="请选择" clearable style="width: 200px">
          <el-option label="全部" value=""></el-option>
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="articleStore.articleList" style="width: 100%" v-loading="loading">
      <el-table-column prop="title" label="文章标题" />
      <el-table-column prop="cate_name" label="分类" />
      <el-table-column prop="pub_date" label="发表时间" :formatter="formatDate" />
      <el-table-column prop="state" label="状态" />
      <el-table-column prop="action" label="操作" width="180" align="center">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDelArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      v-model:current-page="searchParams.pagenum"
      v-model:page-size="searchParams.pagesize"
      :page-sizes="[5, 10, 15, 20]"
      :small="false"
      :disabled="false"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="articleStore.articleTotal"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      class="article-pagination"
    />

    <!-- 文章编辑组件 -->
    <ArticleEdit ref="articleEditRef" @success="reloadArticleData" />
  </PageContainer>
</template>

<style scoped>
.filter-form {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  margin-bottom: 20px;
}

.filter-form :deep(.el-form-item) {
  margin-right: 24px;
  margin-bottom: 0;
}

.filter-form :deep(.el-form-item__label) {
  color: #606266;
  font-weight: 500;
  font-size: 14px;
}

.filter-form :deep(.el-form-item:last-child) {
  margin-right: 0;
  margin-left: auto;
}

/* 分页样式 */
.article-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.article-pagination :deep(.el-pagination) {
  display: flex;
  align-items: center;
}

.article-pagination :deep(.el-pagination__total),
.article-pagination :deep(.el-pagination__sizes),
.article-pagination :deep(.btn-prev),
.article-pagination :deep(.btn-next),
.article-pagination :deep(.el-pager) {
  display: flex;
  align-items: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-form {
    padding: 16px;
  }

  .filter-form :deep(.el-form-item) {
    margin-right: 0;
    margin-bottom: 16px;
    width: 100%;
  }

  .filter-form :deep(.el-form-item:last-child) {
    margin-left: 0;
    text-align: center;
  }

  /* 移动端分页简约样式 */
  .article-pagination :deep(.el-pagination) {
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }

  /* 隐藏页码和跳转 */
  .article-pagination :deep(.el-pager),
  .article-pagination :deep(.el-pagination__jump) {
    display: none !important;
  }

  /* 总条数和每页条数 */
  .article-pagination :deep(.el-pagination__total) {
    display: flex;
    align-items: center;
  }

  .article-pagination :deep(.el-pagination__sizes) {
    display: flex;
    align-items: center;
  }

  .article-pagination :deep(.btn-prev),
  .article-pagination :deep(.btn-next) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
