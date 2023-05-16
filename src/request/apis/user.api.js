import { getRequest, postBodyRequest } from '@/request/http'
import urls from '@/request/urls'

export function getUsers(params) {
  return getRequest({
    url: urls.user.users,
    params: params
  })
}

export function getUserAuth(params) {
  return postBodyRequest({
    url: urls.user.userAuth,
    params: params
  })
}

/**
 * 人员组件名称搜索
 * @param {string} searchName - 查询名称
 * @returns {Promise}
 */
export function searchUsers(searchName) {
  return getRequest({
    url: urls.user.searchUsers,
    params: { searchName }
  })
}

export function setRecentChoice(params) {
  return getRequest({
    url: urls.user.recentChoice,
    params: params
  })
}
