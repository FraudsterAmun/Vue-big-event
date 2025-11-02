<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { Plus } from '@element-plus/icons-vue'
import { getArticleInfoService, editArticleService, addArticleService } from '@/api/article'
import { ElMessage } from 'element-plus'
import axios from 'axios'
// import { useArticleStore } from '@/stores/modules/article'
import { baseURL } from '@/utils/request'
// const articleStore = useArticleStore()

// 响应式抽屉宽度
const drawerSize = ref('50%')

// 计算抽屉宽度的函数
const updateDrawerSize = () => {
  if (window.innerWidth < 768) {
    drawerSize.value = '100%' // 移动端全屏
  } else if (window.innerWidth < 992) {
    drawerSize.value = '80%' // 平板
  } else {
    drawerSize.value = '50%' // 桌面端
  }
}

// 组件挂载时初始化并监听窗口大小变化
onMounted(() => {
  updateDrawerSize()
  window.addEventListener('resize', updateDrawerSize)
})

// 组件卸载时移除监听器
onUnmounted(() => {
  window.removeEventListener('resize', updateDrawerSize)
})

const emit = defineEmits(['success'])

const formModel = ref({
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: '',
})
const rules = ref({
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 2, max: 100, message: '文章标题长度在2-100个字符之间', trigger: 'blur' },
  ],
  cate_id: [{ required: true, message: '请选择文章分类', trigger: 'blur' }],
})
const drawer = ref(false)
const direction = ref('rtl')
const imgUrl = ref('')
const editorRef = ref(null)
const formDefault = ref({
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: '',
})
const openDrawer = async (row) => {
  drawer.value = true

  // 等待抽屉打开
  await nextTick()

  if (row) {
    const res = await getArticleInfoService(row.id)
    formModel.value = res.data.data
    // 图片需要单独处理回显
    imgUrl.value = baseURL + formModel.value.cover_img
    // 注意：提交给后台，需要的数据格式，是file对象格式
    // 需要将网络图片地址 => 转换成 file对象，存储起来, 将来便于提交
    const file = await imageUrlToFileObject(imgUrl.value, formModel.value.cover_img)
    formModel.value.cover_img = file
  } else {
    formModel.value = { ...formDefault } // 基于默认的数据，重置form数据
    // 这里重置了表单的数据，但是图片上传img地址，富文本编辑器内容 => 需要手动重置
    imgUrl.value = ''
    editorRef.value.setHTML('')
    formModel.value = { ...formDefault }
  }
}

// 文件选择处理函数
const onSelectFile = (uploadFile) => {
  console.log('选择的文件:', uploadFile)
  // 创建文件预览URL
  imgUrl.value = URL.createObjectURL(uploadFile.raw)
  // 将文件存储到表单数据中
  formModel.value.cover_img = uploadFile.raw
}

// 关闭抽屉前的处理
const handleClose = (done) => {
  // 重置表单数据
  formModel.value = { ...formDefault }
  // 清空图片预览
  imgUrl.value = ''
  // 重置编辑状态

  // 关闭抽屉
  if (typeof done === 'function') {
    done()
  } else {
    drawer.value = false
  }
}
async function imageUrlToFileObject(imageUrl, filename) {
  try {
    // 使用 Axios 下载图片数据
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })

    // 将下载的数据转换成 Blob 对象
    const blob = new Blob([response.data], {
      type: response.headers['content-type'],
    })

    // 创建 File 对象
    const file = new File([blob], filename, {
      type: response.headers['content-type'],
    })

    return file
  } catch (error) {
    console.error('Error converting image URL to File object:', error)
    return null
  }
}

// 提交表单
const formRef = ref(null)
const handleSubmit = async (state) => {
  try {
    // 表单验证 - 如果验证失败会抛出异常
    await formRef.value.validate()

    const formData = new FormData()
    formModel.value.state = state

    for (const key in formModel.value) {
      formData.append(key, formModel.value[key])
    }

    if (formModel.value.id) {
      // 编辑操作
      await editArticleService(formData)
      ElMessage.success('修改成功')
      drawer.value = false
      emit('success', 'edit')
    } else {
      // 添加操作
      await addArticleService(formData)
      ElMessage.success('添加成功')
      drawer.value = false
      // 通知到父组件，添加成功了
      emit('success', 'add')
    }
  } catch (error) {
    ElMessage.error(error.message)
    // 验证失败时会进入这里，阻止后续代码执行
    console.log('表单验证失败:', error)
    // 不需要显示错误消息，因为表单会自动显示验证提示
  }
}
defineExpose({
  openDrawer,
})
</script>
<template>
  <el-drawer
    v-model="drawer"
    :title="formModel.id ? '编辑文章' : '新增文章'"
    :direction="direction"
    :before-close="handleClose"
    :size="drawerSize"
  >
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-width="120px"
      style="padding-right: 35px"
    >
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入文章标题" />
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <ChannelSelect v-model="formModel.cate_id" />
      </el-form-item>
      <el-form-item label="文章封面">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onSelectFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor
            ref="editorRef"
            v-model:content="formModel.content"
            content-type="html"
            theme="snow"
          ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit('已发布')">发布文章</el-button>
        <el-button type="info" @click="handleSubmit('草稿')">存为草稿</el-button>
        <el-button @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  :deep() {
    width: 100%;
    .ql-editor {
      min-height: 300px;
    }
  }
}

/* 📱 移动端适配 */
@media (max-width: 767px) {
  :deep(.el-drawer) {
    width: 100%;
  }

  :deep(.el-drawer__header) {
    padding: 15px;
    margin-bottom: 15px;
  }

  :deep(.el-drawer__body) {
    padding: 15px;
  }

  /* 需要 !important 覆盖内联样式 padding-right: 35px */
  :deep(.el-form) {
    padding-right: 0 !important;
  }

  /* 需要 !important 覆盖 label-width="120px" */
  :deep(.el-form-item__label) {
    width: 80px !important;
    font-size: 14px;
  }

  /* 图片上传区域自适应 */
  .avatar-uploader {
    width: 100%;

    :deep() {
      .avatar {
        width: 100%;
        max-width: 200px;
        height: auto;
        aspect-ratio: 1 / 1;
      }

      .el-upload {
        width: 100%;
        max-width: 200px;
      }

      .el-icon.avatar-uploader-icon {
        width: 100%;
        max-width: 200px;
        height: auto;
        aspect-ratio: 1 / 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  /* 富文本编辑器适配 */
  .editor {
    :deep() {
      .ql-toolbar {
        position: sticky;
        top: 0;
        z-index: 1;
        background: white;
      }

      .ql-editor {
        min-height: 200px;
        font-size: 14px;
      }
    }
  }

  /* 按钮垂直排列 */
  :deep(.el-form-item:last-child .el-form-item__content) {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  :deep(.el-form-item:last-child .el-button) {
    width: 100%;
    margin: 0;
  }
}

/* 平板适配 */
@media (min-width: 768px) and (max-width: 991px) {
  :deep(.el-drawer__body) {
    padding: 20px;
  }

  .avatar-uploader {
    :deep() {
      .avatar {
        width: 150px;
        height: 150px;
      }

      .el-icon.avatar-uploader-icon {
        width: 150px;
        height: 150px;
      }
    }
  }
}
</style>
