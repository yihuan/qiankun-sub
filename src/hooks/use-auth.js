import { computed, isRef, ref, unref, watchEffect } from 'vue'
import { Role } from '@/constants/app.const'

/**
 * 获取当前用户权限
 * @param {Object} authData - 权限数据，由接口返回
 * @param {string} appName - 产品(App)名称
 * @returns {Object} - 返回权限值
 * {
 *  isSuper: boolean; 是否是超管（iCi 管理员）
 *  isAdmin: boolean; 是否是产品管理员
 *  isVersionAdmin: boolean; 是否有版本计划权限
 *  hasAuth: boolean; 是否有权限（任何一个）
 * }
 */
export function useAuth(authData = {}, appName = '') {
  const isSuper = ref(false)
  const isAdmin = ref(false)
  const isVersionAdmin = ref(false)
  const hasAuth = computed(
    () => isSuper.value || isAdmin.value || isVersionAdmin.value
  )

  function parseAuth() {
    const auth = unref(authData)

    if (auth?.plateformRole === Role.SUPER) {
      isSuper.value = true
    } else {
      const products = auth?.productData
      const apps = products?.filter(
        (x) => x.prodName.toLowerCase() === unref(appName).toLocaleLowerCase()
      )
      const adminApp = apps?.find((x) => x.plateformRole === Role.ADMIN)
      if (adminApp) {
        isAdmin.value = true
      } else {
        const otherApp = apps?.find((x) => x.plateformRole !== Role.ADMIN)
        isVersionAdmin.value = otherApp?.auth_group?.length
          ? otherApp.auth_group.some((x) => x.authName === 'versionSchedule')
          : false
      }
    }
  }

  if (isRef(authData) || isRef(appName)) {
    watchEffect(parseAuth)
  } else {
    parseAuth()
  }

  return {
    isSuper,
    isAdmin,
    isVersionAdmin,
    hasAuth
  }
}
