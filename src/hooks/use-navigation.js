import { useRouter } from 'vue-router/composables'

/**
 * 路由导航相关
 */
export function useNavigation() {
  const router = useRouter()

  function openNewTab(routerInfo) {
    const { href } = router.resolve(routerInfo)
    window.open(href, '_blank')
  }

  function openNewTabLink(url) {
    window.open(url, '_blank')
  }

  return { openNewTab, openNewTabLink }
}
