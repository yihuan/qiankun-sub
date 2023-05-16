import { BASE_URL } from '@/request/http'

export default {
  sponsorList: BASE_URL + 'sgsponsor/getSGSponsorList',
  sponsorDel: BASE_URL + 'sgsponsor/delete',
  sponsorSave: BASE_URL + 'sgsponsor/save',
  getSGTagManageList: BASE_URL + '/sgtagmanage/getSGTagManageList',
  deleteSGTag: BASE_URL + '/sgtagmanage/delete',
  sgTagManagerSave: BASE_URL + '/sgtagmanage/save',
  getSgNoticeGroupList: BASE_URL + '/sgnoticegroup/getSGNoticeGroupList',
  sgNoticeGroupSave: BASE_URL + '/sgnoticegroup/save',
  deleteSgNoticeGroup: BASE_URL + '/sgnoticegroup/delete'
}
