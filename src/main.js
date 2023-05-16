import Vue from 'vue'
import VueRouter from 'vue-router'
import { createPinia, PiniaVuePlugin } from 'pinia'

import App from './App.vue'
import routes from '@/router'
import actions from '@/utils/actions.util'
import { useAppStore } from '@/stores/app.store'
import { info } from '@/utils/log.util'

import filters from './filters'

import ElementUI from 'element-ui'
import 'animate.css'
import '@/assets/styles/element-variables.scss'

import '@/assets/styles/reset.scss'
import '@/assets/styles/base.scss'
import '@/assets/styles/icon.css'

window.Vue = Vue
window.Vue.config.productionTip = false
window.Vue.config.devtools =
  process.env.NODE_ENV !== 'production' ? true : false

window.Vue.use(filters)

const pinia = createPinia()
window.Vue.use(PiniaVuePlugin)
window.Vue.use(VueRouter)
window.Vue.use(ElementUI)

let instance = null
let router = null

const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch((err) => err)
}

function render(props = {}) {
  const {
    container,
    routerBase,
    routerBaseMap,
    useParentStore,
    ibasePublicPath
  } = props
  if (window.__POWERED_BY_QIANKUN__) {
    window.Vue.prototype.IBASE_PUBLIC_PATH = ibasePublicPath
    window.Vue.prototype.DOMAIN_PREFIX = routerBase
    // eslint-disable-next-line no-undef
    __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
    window.Vue.prototype.parentStore = useParentStore
  }

  window.Vue.prototype.getRealIWorkRouteBase = function (type) {
    if (!window.__POWERED_BY_QIANKUN__) return '/'

    if (!routerBaseMap || !routerBaseMap.IWORK) return '/'

    return `${routerBaseMap.IWORK[type]}` || '/'
  }

  const base = window.__POWERED_BY_QIANKUN__
    ? `${routerBase}`
    : process.env.BASE_URL

  router = new VueRouter({
    mode: 'history',
    base,
    routes
  })

  router.beforeEach((to, from, next) => {
    // 如果是嵌套在iframe中的页面则不显示头部
    window.top != window.self && (to.meta.showHead = false)
    document.title = to.meta && to.meta.title ? to.meta.title : '云效-版本计划'
    next()
  })

  instance = new window.Vue({
    router,
    pinia,
    render: (h) => h(App),
    mounted() {
      if (
        window.__POWERED_BY_QIANKUN__ &&
        process.env.NODE_ENV === 'development'
      ) {
        // 全局挂载子应用vm
        window.__QIANKUN_SUB_APP_IWORK__ = this
      }
    }
  }).$mount(container ? container.querySelector('#sg-app') : '#sg-app')

  const appStore = useAppStore()
  appStore.ibaseDomain =
    window.location.protocol + '//' + window.location.host + ibasePublicPath
}

if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

export async function bootstrap() {
  info(
    '%c before load',
    'background:#0f0 ; padding: 1px; border-radius: 3px;  color: #fff',
    'iWork app bootstraped'
  )
}

export async function mount(props) {
  actions.setActions(props)
  render(props)
}

export async function unmount() {
  instance.$destroy()
  instance.$el.innerHTML = ''
  instance = null
  router = null
}
