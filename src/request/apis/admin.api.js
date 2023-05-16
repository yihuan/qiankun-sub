import { getRequest, postBodyRequest } from '@/request/http'
import urls from '@/request/urls'

export function deleteSponsor(id) {
  return getRequest({
    url: urls.admin.sponsorDel,
    params: { id }
  })
}

export function getSponsorList(params) {
  return getRequest({
    url: urls.admin.sponsorList,
    params: params
  })
}

export function sponsorSave(params) {
  return postBodyRequest({
    url: urls.admin.sponsorSave,
    params
  })
}

export function getSGTagManageList(params) {
  return getRequest({
    url: urls.admin.getSGTagManageList,
    params: params
  })
}

export function deleteSGTag(id) {
  return getRequest({
    url: urls.admin.deleteSGTag,
    params: { id }
  })
}

export function sgTagManagerSave(params) {
  return postBodyRequest({
    url: urls.admin.sgTagManagerSave,
    params: params
  })
}

export function getSgNoticeGroupList(params) {
  return getRequest({
    url: urls.admin.getSgNoticeGroupList,
    params: params
  })
}

export function sgNoticeGroupSave(params) {
  return postBodyRequest({
    url: urls.admin.sgNoticeGroupSave,
    params: params
  })
}

export function deleteSgNoticeGroup(id) {
  return getRequest({
    url: urls.admin.deleteSgNoticeGroup,
    params: { id }
  })
}
