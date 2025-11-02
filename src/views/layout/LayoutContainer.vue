<script setup>
import { onMounted, ref } from 'vue'
import {
  Management,
  Promotion,
  UserFilled,
  User,
  Crop,
  EditPen,
  SwitchButton,
  CaretBottom,
  Expand,
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import { useUserStore } from '@/stores/index'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'

const userStore = useUserStore()
const router = useRouter()

// 控制移动端侧边栏显示
const showMobileSidebar = ref(false)

onMounted(() => {
  userStore.getUserInfoData()
})

// 切换侧边栏显示
const toggleSidebar = () => {
  showMobileSidebar.value = !showMobileSidebar.value
}

// 关闭侧边栏
const closeSidebar = () => {
  showMobileSidebar.value = false
}

const handleCommand = (command) => {
  if (command === 'logout') {
    ElMessageBox.confirm('确定退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        userStore.setUserInfo({})
        userStore.setToken(null)
        router.push('/login')
      })
      .catch(() => {
        // ElMessage.error('取消退出登录')
      })
  } else {
    router.push(`/user/${command}`)
  }
}
</script>

<template>
  <el-container class="layout-container">
    <!-- 侧边栏 - 桌面端始终显示 -->
    <el-aside width="200px" :class="{ 'mobile-sidebar-show': showMobileSidebar }">
      <div class="el-aside__logo"></div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#232323"
        :default-active="$route.path"
        text-color="#fff"
        router
        @select="closeSidebar"
      >
        <el-menu-item index="/article/channel">
          <el-icon><Management /></el-icon>
          <span>文章分类</span>
        </el-menu-item>
        <el-menu-item index="/article/manage">
          <el-icon><Promotion /></el-icon>
          <span>文章管理</span>
        </el-menu-item>
        <el-sub-menu index="/user">
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>个人中心</span>
          </template>
          <el-menu-item index="/user/profile">
            <el-icon><User /></el-icon>
            <span>基本资料</span>
          </el-menu-item>
          <el-menu-item index="/user/avatar">
            <el-icon><Crop /></el-icon>
            <span>更换头像</span>
          </el-menu-item>
          <el-menu-item index="/user/password">
            <el-icon><EditPen /></el-icon>
            <span>重置密码</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <!-- 遮罩层 - 移动端点击关闭侧边栏 -->
    <div
      class="sidebar-overlay"
      :class="{ 'show': showMobileSidebar }"
      @click="closeSidebar"
    ></div>

    <el-container>
      <el-header>
        <!-- 移动端菜单按钮 -->
        <el-button
          class="mobile-menu-btn"
          text
          @click="toggleSidebar"
          :icon="Expand"
        >
        </el-button>

        <div class="header-info">
          黑马程序员：<strong>{{
            userStore.userInfo.username || userStore.userInfo.nickname
          }}</strong>
        </div>
        <el-dropdown placement="bottom-end" @command="handleCommand">
          <span class="el-dropdown__box">
            <el-avatar :src="userStore.userInfo.user_pic || avatar" />
            <el-icon><CaretBottom /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile" :icon="User">基本资料</el-dropdown-item>
              <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>
              <el-dropdown-item command="password" :icon="EditPen">重置密码</el-dropdown-item>
              <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>大事件 ©2023 Created by 黑马程序员</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  position: relative;

  .el-aside {
    background-color: #232323;
    transition: transform 0.3s ease;

    &__logo {
      height: 120px;
      background: url('@/assets/logo.png') no-repeat center / 120px auto;
    }

    .el-menu {
      border-right: none;
    }
  }

  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .mobile-menu-btn {
      display: none; /* 默认隐藏，移动端显示 */
      font-size: 24px;
      padding: 10px;
      margin-right: 10px;
    }

    .header-info {
      flex: 1;
    }

    .el-dropdown__box {
      display: flex;
      align-items: center;
      cursor: pointer;

      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }

  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }

  /* 遮罩层 - 默认隐藏 */
  .sidebar-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 998;
    transition: opacity 0.3s ease;
    opacity: 0;

    &.show {
      display: block;
      opacity: 1;
    }
  }
}

/* 📱 移动端和平板适配 (< 992px) */
@media (max-width: 991px) {
  .layout-container {
    .el-aside {
      /* 需要 !important 覆盖桌面端的 position: static */
      position: fixed !important;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: 999;
      transform: translateX(-100%); /* 默认隐藏 */
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);

      /* 当显示时滑入 */
      &.mobile-sidebar-show {
        transform: translateX(0);
      }
    }

    /* 显示移动端菜单按钮 - 需要 !important 覆盖默认的 display: none */
    .el-header .mobile-menu-btn {
      display: inline-flex !important;
    }
  }
}

/* 📱 移动端特殊优化 (< 480px) */
@media (max-width: 479px) {
  .layout-container {
    .el-header {
      padding: 0 10px;

      .header-info {
        font-size: 14px;

        strong {
          display: block;
          margin-top: 2px;
        }
      }
    }
  }
}

/* 💻 桌面端 (>= 992px) */
@media (min-width: 992px) {
  .layout-container {
    /* 桌面端侧边栏始终显示 - 需要 !important 覆盖移动端的 fixed 和 transform */
    .el-aside {
      position: static !important;
      transform: none !important;
    }

    /* 桌面端隐藏遮罩层 - 需要 !important 确保隐藏 */
    .sidebar-overlay {
      display: none !important;
    }
  }
}
</style>
