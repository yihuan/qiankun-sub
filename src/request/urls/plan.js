import { BASE_URL } from '@/request/http'

export default {
  planList: BASE_URL + 'sgschedule/getScheduleList',
  planFilters: BASE_URL + 'sgverprogress/getScheduleFilterRecord',
  planCreate: BASE_URL + 'sgschedule/addSchedule',
  planUpdate: BASE_URL + 'sgschedule/updateSchedule',
  planDel: BASE_URL + 'sgschedule/delSchedule',
  iterationList: BASE_URL + 'sgschedule/getIterationList',
  templateList: BASE_URL + 'sgtemplate/getTemplateList',
  planOverview: BASE_URL + 'sgschedule/getSGScheduleDetail',
  planProgress: BASE_URL + 'sgverprogress/getScheduleProcessForCondition',
  updateOnlineInfo: BASE_URL + 'sgschedule/updateSGScheduleTime',
  updateManager: BASE_URL + 'sgschedule/updateScheduleSGSponsor',
  initOrFetchTask: BASE_URL + 'sgverprogress/initScheduleNodeAttr',
  deleteTask: BASE_URL + 'sgverprogress/deleteTask',
  taskRecords: BASE_URL + 'sgverprogress/getOperaterRecordListForTask',
  planRecords: BASE_URL + 'sgverprogress/getOperaterRecordList',
  savePlanTask: BASE_URL + 'sgverprogress/saveScheduleNodeAttr',
  getPackageList: BASE_URL + 'sgschedule/getPackageList',
  getFlowList: BASE_URL + 'sgschedule/getFlowList',
  getReleaseFlowList: BASE_URL + 'sgschedule/getReleaseFlowList',
  getIntegrateFlowList: BASE_URL + 'sgschedule/getIntegrateFlowList',
  getMergeFlowList: BASE_URL + 'sgschedule/getMergeFlowList',
  planFlows: BASE_URL + 'sgverprogress/getRelateFlowInfo',
  lastVersionInternal: BASE_URL + 'sgschedule/getLastVersionInterval'
}
