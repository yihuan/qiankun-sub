import { BASE_URL, IWORK_BASE_URL } from '@/request/http'
export default {
  users: BASE_URL + 'users',
  userAuth: BASE_URL + 'user/auth',
  searchUsers: IWORK_BASE_URL + 'group/searchUser',
  recentChoice: IWORK_BASE_URL + 'group/setRecentlyChoice'
}
