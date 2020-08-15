import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import { isWeb } from '@/const'
import { vxm } from '@/store'
import AuthStart from '@/views/authStart.vue'
import AuthVerification from '@/views/authVerification.vue'
import Dashboard from '@/views/dashboard.vue'
import Admin from '@/views/dashboard/admin.vue'
import Director from '@/views/dashboard/director.vue'
import Leader from '@/views/dashboard/leader.vue'
import Parent from '@/views/dashboard/parent.vue'
import Updates from '@/views/dashboard/updates.vue'
import User from '@/views/dashboard/user.vue'
import Landing from '@/views/landing.vue'
import Privacy from '@/views/privacy.vue'
import SignUp from '@/views/signUp.vue'
import SuperAllUsers from '@/views/superUser/allUsers.vue'
import Terms from '@/views/terms.vue'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Landing',
    component: Landing
  },
  {
    path: '/terms',
    name: 'Terms',
    component: Terms
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: Privacy
  },
  {
    path: '/auth',
    name: 'AuthStart',
    component: AuthStart
  },
  {
    path: '/auth-verify',
    name: 'AuthVerification',
    component: AuthVerification
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/dashboard',
    component: Dashboard,
    children: [
      {
        path: '',
        redirect: 'updates'
      },
      {
        path: 'user',
        name: 'User',
        component: User
      },
      {
        path: 'updates',
        name: 'Updates',
        component: Updates,
        meta: {
          title: 'Weekly Updates'
        }
      },
      {
        path: 'parent',
        name: 'ParentTools',
        component: Parent,
        meta: {
          title: 'Parent Tools'
        }
      },
      {
        path: 'leader',
        name: 'LeaderTools',
        component: Leader,
        meta: {
          title: 'Leader Tools'
        }
      },
      {
        path: 'director',
        name: 'DirectorTools',
        component: Director,
        meta: {
          title: 'Director Tools'
        }
      },
      {
        path: 'admin',
        name: 'AdminTools',
        component: Admin,
        meta: {
          title: 'Admin Tools'
        }
      },
      {
        path: 'super/all',
        name: 'SuperAllUsers',
        component: SuperAllUsers,
        meta: {
          title: 'App User Management'
        }
      }
    ]
  },
  {
    path: '/*',
    redirect: '/'
  }
]

const unauthenticatedRoutes = ['Landing', 'AuthStart', 'AuthVerification']
const openRoutes = ['Terms', 'Privacy']

const router = new VueRouter({
  mode: isWeb ? 'history' : 'hash',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const defaultRoute = vxm.user.defaultRoute
  if (openRoutes.includes(to.name ?? '')) {
    return next()
  }
  if (!vxm.user.authenticated && !unauthenticatedRoutes.includes(to.name ?? '')) {
    return next(defaultRoute)
  } else if (vxm.user.authenticated && unauthenticatedRoutes.includes(to.name ?? '')) {
    return next(defaultRoute)
  }
  next()
})

export default router
