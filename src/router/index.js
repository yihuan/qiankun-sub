import HomeView from '@/views/HomeView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import demoRouter from './demo.router'

export default [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView,
    redirect: { name: 'PlanList' },
    children: [
      {
        path: 'plans',
        name: 'PlanList',
        redirect: { name: 'PlanListData' },
        meta: {
          type: 'menu',
          title: '计划'
        },
        component: () => import('@/views/plan/PlanList.vue'),
        children: [
          {
            path: '',
            name: 'PlanListData',
            component: () => import('@/views/plan/PlanListData.vue')
          },
          {
            path: 'calendar',
            name: 'PlanCalendar',
            component: () => import('@/views/plan/PlanListCalendar.vue')
          }
        ]
      },
      {
        path: 'plan/:id',
        name: 'PlanDetails',
        component: () => import('@/views/plan/PlanDetails.vue'),
        redirect: { name: 'PlanDetailsOverview' },
        children: [
          {
            path: 'overview',
            name: 'PlanDetailsOverview',
            component: () => import('@/views/plan/PlanDetailsOverview.vue')
          },
          {
            path: 'progress',
            name: 'PlanDetailsProgress',
            component: () => import('@/views/plan/PlanDetailsProgress.vue')
          },
          {
            path: 'flow',
            name: 'PlanDetailsFlow',
            component: () => import('@/views/plan/PlanDetailsFlow.vue')
          },
          {
            path: 'calendar',
            name: 'PlanDetailsCalendar',
            component: () => import('@/views/plan/PlanDetailsCalendar.vue')
          },
          {
            path: 'build',
            name: 'PlanDetailsBuild',
            component: () => import('@/views/plan/PlanDetailsBuild.vue')
          }
        ]
      },
      {
        path: 'templates',
        name: 'TemplateList',
        meta: {
          type: 'menu',
          title: '模板'
        },
        component: () => import('@/views/template/TemplateList.vue')
      },
      {
        path: 'template/:id',
        name: 'TemplateDetails',
        component: () => import('@/views/template/TemplateDetails.vue')
      },
      {
        path: 'user-groups',
        name: 'UserGroupList',
        meta: {
          type: 'menu',
          title: '用户组'
        },
        component: () => import('@/views/UserGroupList.vue')
      },
      {
        path: 'labels',
        name: 'LabelList',
        meta: {
          type: 'menu',
          title: '标签管理'
        },
        component: () => import('@/views/LabelList.vue')
      },
      {
        path: 'participants',
        name: 'PrimaryParticipantList',
        meta: {
          type: 'menu',
          title: '主要参与人'
        },
        component: () => import('@/views/PrimaryParticipantList.vue')
      }
    ]
  },
  { ...demoRouter },
  {
    path: '*',
    component: NotFoundView
  }
]
