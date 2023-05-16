import { BASE_URL } from '@/request/http'

export default {
  meishiAuthCode: BASE_URL + 'login/getAuthCode',
  getMeishiGroupInfo: BASE_URL + 'iteration/getMeishiGroupInfo',
  joinMeishiGroup: BASE_URL + 'iteration/createAndJoinMeishiGroup',
  npsLink: BASE_URL + 'nps/check',
  getCompilerPackageDetail: BASE_URL + 'sgschedule/getCompilerPackageDetail',
  getCompilerPackageAllInfo: BASE_URL + 'sgschedule/getCompilerPackageAllInfo'
}
