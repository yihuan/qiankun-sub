import { getRequest } from '@/request/http'
import urls from '@/request/urls'

export function getMeishiAuthCode(params) {
  return getRequest({
    url: urls.thirdParty.meishiAuthCode,
    params: params
  })
}

export function getMeishiGroupInfo(params) {
  return getRequest({
    url: urls.thirdParty.getMeishiGroupInfo,
    params: params
  })
}

export function joinMeishiGroup(params) {
  return getRequest({
    url: urls.thirdParty.joinMeishiGroup,
    params: params
  })
}

/**
 * 获取 nps 链接
 * @param {String} scene - 场景值
 * @returns {Promise}
 */
export function getNpsLink(scene) {
  return getRequest({
    url: urls.thirdParty.npsLink,
    params: { scene }
  })
}

/**
 * 获取构建参数和代码地址
 * @param {*} id
 * @returns {Promise}
 */
export function getCompilerPackageDetail(id) {
  return getRequest({
    url: urls.thirdParty.getCompilerPackageDetail,
    params: { id }
  })
}

/**
 * 获取全部构建参数
 * @param {*} id
 * @returns {Promise}
 */
export function getCompilerPackageAllInfo(id) {
  return getRequest({
    url: urls.thirdParty.getCompilerPackageAllInfo,
    params: { id }
  })
}
