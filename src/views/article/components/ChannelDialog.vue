<script setup>
import { ref } from 'vue'
import { addArticleChannel, editArticleChannel } from '@/api/article'
import { ElMessage } from 'element-plus'
// 使用默认的 v-model 绑定
const dialogVisible = ref(false)
// 使用 defineModel 处理 formModel 的双向绑定
const formModel = ref({
  cate_name: '',
  cate_alias: '',
})

// 表单引用
const formRef = ref()
const rules = ref({
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' },
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' },
  ],
})
// 定义 emit 事件
const emit = defineEmits(['refresh'])

const handleConfirm = async () => {
  await formRef.value.validate()
  formModel.value.id
    ? await editArticleChannel(formModel.value)
    : await addArticleChannel(formModel.value)
  ElMessage({
    type: 'success',
    message: formModel.value.id ? '编辑成功' : '添加成功',
  })
  dialogVisible.value = false
  emit('refresh')
}
const openDialog = (row) => {
  dialogVisible.value = true
  if (row) {
    console.log(row)
    formModel.value = row
  }
}
defineExpose({
  openDialog,
})
</script>

<template>
  <el-dialog v-model="dialogVisible" title="添加分类" width="30%" @keyup.enter="handleConfirm">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item label="分类名称:" prop="cate_name">
        <el-input v-model="formModel.cate_name" />
      </el-form-item>
      <el-form-item label="分类别名:" prop="cate_alias">
        <el-input v-model="formModel.cate_alias" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
/* 📱 Dialog 移动端适配 */
@media (max-width: 767px) {
  /* Dialog 宽度需要 !important 覆盖内联样式 */
  .el-dialog {
    width: 95vw !important;
    margin: 15vh auto;
  }

  .el-dialog__header {
    padding: 15px;
  }

  .el-dialog__body {
    padding: 15px;
  }

  .el-dialog__footer {
    padding: 15px;
  }

  /* 按钮垂直排列 */
  .el-dialog__footer .dialog-footer {
    display: flex;
    flex-direction: column-reverse;
    gap: 10px;
  }

  .el-dialog__footer .dialog-footer .el-button {
    width: 100%;
    margin: 0;
  }

  /* 表单标签宽度调整 */
  .el-dialog .el-form-item__label {
    width: 80px;
    font-size: 13px;
  }

  /* MessageBox 移动端适配 - 宽度需要 !important */
  .el-message-box {
    width: 90vw !important;
    max-width: 400px;
  }

  .el-message-box__header {
    padding: 15px;
  }

  .el-message-box__title {
    font-size: 16px;
  }

  .el-message-box__content {
    padding: 15px;
    font-size: 14px;
  }

  .el-message-box__btns {
    padding: 15px;
    display: flex;
    flex-direction: column-reverse;
    gap: 10px;
  }

  .el-message-box__btns .el-button {
    width: 100%;
    margin: 0;
  }

  /* 分页组件移动端适配 */
  .el-pagination {
    padding: 10px 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 5px;
  }

  /* 隐藏元素需要 !important 确保生效 */
  .el-pagination .el-pagination__sizes,
  .el-pagination .el-pagination__jump {
    display: none !important;
  }

  /* 调整按钮和页码大小 */
  .el-pagination button,
  .el-pagination .el-pager li {
    min-width: 32px;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    margin: 0 2px;
  }

  /* total 信息换行显示 */
  .el-pagination .el-pagination__total {
    width: 100%;
    text-align: center;
    margin-bottom: 10px;
    font-size: 14px;
  }

  /* 调整分页器容器 */
  .el-pagination .el-pager {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
}

/* 平板适配 */
@media (min-width: 768px) and (max-width: 991px) {
  /* 宽度需要 !important 覆盖内联样式 */
  .el-dialog {
    width: 70% !important;
    max-width: 500px;
  }

  .el-message-box {
    width: 70% !important;
    max-width: 450px;
  }

  /* 分页组件平板适配 - 隐藏 sizes 需要 !important */
  .el-pagination .el-pagination__sizes {
    display: none !important;
  }

  .el-pagination {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
