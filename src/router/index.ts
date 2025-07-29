import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/:category(a|b|c)',
    component: () => import('@/layouts/Default.vue'),
    children: [
      {
        path: 'all/:index(\\d+)?',
        name: 'All',
        alias: '',
        props: true,
        component: () => import('@/views/All.vue'),
      },
      {
        path: 'bookmark/:id([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4[a-fA-F0-9]{3}-[8|9|aA|bB][a-fA-F0-9]{3}-[a-fA-F0-9]{12})?',
        name: 'Bookmark',
        props: true,
        component: () => import('@/views/Bookmark.vue'),
      },
      {
        path: 'history',
        name: 'History',
        props: true,
        component: () => import('@/views/History.vue'),
      },
      {
        path: ':mode(test|history)/:id([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4[a-fA-F0-9]{3}-[8|9|aA|bB][a-fA-F0-9]{3}-[a-fA-F0-9]{12})/:index(\\d+)?',
        name: 'Test',
        props: true,
        component: () => import('@/views/Test.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
