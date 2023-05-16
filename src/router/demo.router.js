export default {
  path: '/demo',
  name: 'demo',
  component: () => import('@/views/demo/DemoEntry.vue'),
  redirect: { name: 'BaseComponentDemo' },
  children: [
    {
      path: 'base',
      name: 'BaseComponentDemo',
      component: () => import('@/views/demo/BaseComponentDemo.vue')
    },
    {
      path: 'draggable',
      name: 'DraggableDemo',
      component: () => import('@/views/demo/DraggableDemo.vue')
    },
    {
      path: 'table',
      name: 'TableDemo',
      component: () => import('@/views/demo/TableDemo.vue')
    },
    {
      path: 'jsx',
      name: 'JSXDemo',
      component: () => import('@/views/demo/JsxDemo.vue')
    },
    {
      path: 'layout/page',
      name: 'LayoutDemo',
      component: () => import('@/views/demo/PageLayoutDemo.vue')
    }
  ]
}
