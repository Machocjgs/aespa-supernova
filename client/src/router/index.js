import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import store from "../store"

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: Home
        },
        {
            path: '/login',
            meta:{sidebar:false},
            component: () => import('../components/Login.vue')
        },
        {
            path: '/reset',
            meta:{sidebar:false},
            component: () => import('../components/Reset.vue')
        },
        {
            path: '/products',
            component: () => import('../views/Products.vue')
        },
        {
            path: '/users',
            component: () => import('../views/Users.vue')
        },
        {
            path: '/inventory',
            component: () => import('../views/Inventory.vue')
        },
        {
            path: '/settings',
            component: () => import('../views/Settings.vue')
        },
        {
            path: '/signout',
            name: 'signout',
            meta:{sidebar:false},
            beforeEnter (to, from, next) {
                store.dispatch('auth/logout').then(() => {
                console.log(from.meta.requiresAuth)
                if (from.meta.requiresAuth) {
                    next('/login');
                }
                    location.reload();
                })
            }
        }
    ]
})

router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/reset'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('token');

    // trying to access a restricted page + not logged in
    // redirect to login page
    if (authRequired && !loggedIn) {
        next('/login');
    } else {
        next();
    }
})

export default router