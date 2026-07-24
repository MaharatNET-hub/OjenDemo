import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    { path: '/', redirect: '/en/profile/ql-overview' },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: { standalone: true, public: true },
    },
    {
      path: '/en/profile/ql-overview',
      name: 'ql-dashboard',
      component: () => import('@/views/QlDashboard.vue'),
    },
    {
      path: '/en/profile',
      name: 'profile',
      component: () => import('@/views/CorporateProfile.vue'),
    },
    {
      path: '/en/employees',
      name: 'employees',
      component: () => import('@/views/Employees.vue'),
    },
    {
      path: '/en/subscriptions',
      name: 'subscriptions',
      component: () => import('@/views/Subscriptions.vue'),
    },
    {
      path: '/en/bookings',
      name: 'bookings',
      component: () => import('@/views/Bookings.vue'),
    },
    {
      path: '/en/payments',
      name: 'payments',
      component: () => import('@/views/Payments.vue'),
    },
    {
      path: '/en/journeys',
      name: 'journeys',
      component: () => import('@/views/JourneysCatalog.vue'),
    },
    {
      path: '/en/profile/active-package',
      name: 'active-package',
      component: () => import('@/views/ActivePackage.vue'),
    },
    {
      path: '/en/profile/active-package/card/:day',
      name: 'journey-card',
      component: () => import('@/views/JourneyCardDetail.vue'),
      props: (route) => ({ day: Number(route.params.day) }),
    },
    {
      path: '/survey/:token',
      name: 'survey',
      component: () => import('@/views/SurveyForm.vue'),
      props: true,
      meta: { standalone: true, public: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFound.vue'),
      meta: { standalone: true, public: true },
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'login' && auth.isLoggedIn) {
    return { path: '/en/profile/ql-overview' }
  }
  return true
})

export default router
