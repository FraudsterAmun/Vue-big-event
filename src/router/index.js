import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/index'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/LoginPage.vue'),
      // redirect: '/login',
    },
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/channel',
      children: [
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue'),
        },
        {
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue'),
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue'),
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue'),
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const userStore = useUserStore()
  if (to.path !== '/login' && !userStore.token) {
    return '/login'
  }
  return true
})

export default router
