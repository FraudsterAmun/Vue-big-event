<script setup>
import { ref } from 'vue'
import { Plus, Upload } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/index'
import PageContainer from '@/components/PageContainer.vue'
import { updateUserAvatar } from '@/api/user'
import { ElMessage } from 'element-plus'
const userInfoStore = useUserStore()
const uploadRef = ref(null)
const imgUrl = ref(userInfoStore.userInfo.user_pic)
const onUploadFile = (file) => {
  const reader = new FileReader()
  reader.readAsDataURL(file.raw)
  reader.onload = () => {
    imgUrl.value = reader.result
  }
}
const handleUpload = async () => {
  try {
    if (!imgUrl.value) {
      ElMessage.warning('请先选择图片')
      return
    }
    // 传递包含头像数据的对象
    await updateUserAvatar({ avatar: imgUrl.value })
    ElMessage.success('上传成功')
    await userInfoStore.getUserInfoData()
  } catch (error) {
    console.error('上传失败:', error)
    ElMessage.error('上传失败，请重试')
  }
}
</script>

<template>
  <PageContainer title="更换头像">
    <el-row>
      <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
        <el-upload
          ref="uploadRef"
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onUploadFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
        <br />
        <el-button
          type="primary"
          :icon="Plus"
          size="large"
          @click="uploadRef.$el.querySelector('input').click()"
        >
          选择图片
        </el-button>
        <el-button type="success" :icon="Upload" size="large" @click="handleUpload">
          上传头像
        </el-button>
      </el-col>
    </el-row>
  </PageContainer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
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
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}

/* 📱 移动端适配 */
@media (max-width: 767px) {
  .avatar-uploader {
    width: 100%;

    :deep() {
      /* 需要 !important 覆盖固定宽高 */
      .avatar {
        width: 100% !important;
        height: auto !important;
        aspect-ratio: 1 / 1;
      }

      .el-upload {
        width: 100% !important;
      }

      .el-icon.avatar-uploader-icon {
        width: 100% !important;
        height: auto !important;
        aspect-ratio: 1 / 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  /* 按钮在移动端占满宽度 */
  .el-button {
    width: 100%;
    margin: 5px 0;
  }
}
</style>
