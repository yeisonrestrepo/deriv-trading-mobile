import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
            title: 'Dashboard',
            requiresAuth: true
        }
    },
    {
        path: '/accounts',
        name: 'Accounts',
        component: () => import('@/views/Accounts.vue'),
        meta: {
            title: 'Accounts Management',
            requiresAuth: true
        }
    },
    {
        path: '/trading',
        name: 'Trading',
        component: () => import('@/views/Trading.vue'),
        meta: {
            title: 'Live Trading',
            requiresAuth: true
        }
    },
    {
        path: '/analytics',
        name: 'Analytics',
        component: () => import('@/views/Analytics.vue'),
        meta: {
            title: 'Analytics & Reports',
            requiresAuth: true
        }
    },
    {
        path: '/settings',
        name: 'Settings',
        component: () => import('@/views/Settings.vue'),
        meta: {
            title: 'Settings',
            requiresAuth: true
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
        meta: {
            title: 'Login',
            requiresAuth: false
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue'),
        meta: {
            title: 'Page Not Found',
            requiresAuth: false
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
    // Set page title
    document.title = `${to.meta.title} - Deriv Trading Dashboard`

    // Check authentication
    if (to.meta.requiresAuth) {
        const token = localStorage.getItem('auth_token')
        if (!token) {
            next('/login')
            return
        }
    }

    next()
})

export default router