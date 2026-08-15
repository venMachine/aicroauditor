import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('./views/Home.vue') },
  { path: '/login', component: () => import('./views/Login.vue') },
  { path: '/register', component: () => import('./views/Register.vue') },
  { path: '/auth/callback', component: () => import('./views/AuthCallback.vue') },
  { path: '/dashboard', component: () => import('./views/Dashboard.vue'), meta: { auth: true } },
  { path: '/pricing', component: () => import('./views/Pricing.vue'), meta: { auth: true } },
  { path: '/audit/:id', component: () => import('./views/AuditResult.vue'), meta: { auth: true } },
  { path: '/offer', component: () => import('./views/Offer.vue') },
  { path: '/contacts', component: () => import('./views/Contacts.vue') },
  { path: '/privacy', component: () => import('./views/Privacy.vue') },
  { path: '/requisites', component: () => import('./views/Requisites.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.auth && !token) next('/login')
  else next()
})

export default router