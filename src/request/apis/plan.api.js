import { getRequest, postBodyRequest } from '@/request/http'
import urls from '@/request/urls'

/**
 * 获取计划列表
 * @param {Object} params
 * {
 *   versionNo?: string; - version number
 *   status?: number; - PlanStatus in plan.const.js
 *   productName: string;
 *   page: number;
 *   pageSize: number;
 * }
 * @returns {Promise}
 */
export function getPlanList(params) {
  return postBodyRequest({
    url: urls.plan.planList,
    params: params
  })
}

/**
 * 获取过滤器数据
 * @param {number} scheduleId - 版本计划ID
 * @returns {Promise}
 */
export function getPlanFilters(scheduleId) {
  return getRequest({
    url: urls.plan.planFilters,
    params: { scheduleId }
  })
}

/**
 * 新建计划
 * @param {Object} params
 * {
 *   prodName: string;	-	产品名
 *   versionNo: string;		- 计划版本号
 *   isTemporary:	number; - 临时版本，0正式，1临时
 *   templateId:number;	-	模板id
 *   versionStartTime?: string;
 *   serverOnlineTime?: string;
 *   nativeOnlineTime?:	string;
 *   integrationStartTime?: string;
 *   grayPublishTime?: string;
 *   iosSubmitTime?: string;
 *   androidPublishTime?:	string;
 *   publishCycle:	string; - 版本间隔，天
 *   iterationId?: string;	1	迭代id，多个以逗号分隔
 *   isDelay?: number;	- 是否延期，0正常，1延期
 *   delayReason?: string; -	延期原因
 * }
 * @returns {Promise}
 */
export function createPlan(params) {
  return postBodyRequest({
    url: urls.plan.planCreate,
    params
  })
}

/**
 * 获取版本间隔天数
 * @param {string} prodName - 产品（app）名称
 * @param {string} newVersionTime - 新建版本的ios提审/android发布时间
 * @returns {Promise}
 */
export function getLastVersionInterval(prodName, newVersionTime) {
  return getRequest({
    url: urls.plan.lastVersionInternal,
    params: { prodName, newVersionTime }
  })
}

/**
 * 编辑计划
 * @param {Object} params
 * {
 *   id: number; - ID
 *   prodName: string;	-	产品名
 *   versionNo: string;		- 计划版本号
 *   isTemporary:	number; - 临时版本，0正式，1临时
 *   templateId: number;	-	模板id
 *   versionStartTime?: string;
 *   serverOnlineTime?: string;
 *   nativeOnlineTime?:	string;
 *   integrationStartTime?: string;
 *   grayPublishTime?: string;
 *   iosSubmitTime?: string;
 *   androidPublishTime?:	string;
 *   publishCycle?:	string; - 版本间隔，天
 *   iterationId?: string;	1	迭代id，多个以逗号分隔
 *   isDelay?: number;	- 是否延期，0正常，1延期
 *   delayReason?: string; -	延期原因
 * }
 * @returns {Promise}
 */
export function updatePlan(params) {
  return postBodyRequest({
    url: urls.plan.planUpdate,
    params
  })
}

export function deletePlan(id) {
  return getRequest({
    url: urls.plan.planDel,
    params: { id }
  })
}

/**
 * 获取模板列表
 * @param {string} prodName - 产品名称
 * @returns {Promise}
 */
export function getTemplateList(prodName) {
  return getRequest({
    url: urls.plan.templateList,
    params: { prodName }
  })
}

/**
 * 获取迭代列表
 * @param {string} prodName - 产品名称
 * @param {string} title - 迭代名称（模糊搜索）
 * @returns {Promise}
 */
export function getIterationList(prodName, title) {
  return getRequest({
    url: urls.plan.iterationList,
    params: { prodName, title }
  })
}

/**
 *  获取计划详情概览
 * @param {number} id
 * @returns {Promise}
 */
export function getPlanOverview(id) {
  return getRequest({
    url: urls.plan.planOverview,
    params: { id }
  })
}

/**
 * 获取版本进展
 * @param {Object} params
 * {
 *   scheduleId: string; - 排期ID
 *   name: string; - 任务名称
 *   operater; string; - 任务操作人
 *   tag: string; - 标签
 *   status: string; - 状态
 * }
 * @returns {Promise}
 */
export function getPlanProgress(params) {
  return postBodyRequest({
    url: urls.plan.planProgress,
    params
  })
}

/**
 * 更新上线信息
 * @param {Object} params
 * @returns {Promise}
 */
export function updateOnlineInfo(params) {
  return postBodyRequest({
    url: urls.plan.updateOnlineInfo,
    params
  })
}

/**
 * 更新主要负责人
 * @param {Object} params
 * {
 *   role: string;
 *   productName: string;
 *   realName: string;
 *   oaName: string;
 *   scheduleId: number;
 * }
 * @returns {Promise}
 */
export function updateManager(params) {
  return postBodyRequest({
    url: urls.plan.updateManager,
    params
  })
}

export function getPackageList(params) {
  return getRequest({
    url: urls.plan.getPackageList,
    params
  })
}

export function getFlowList(params) {
  return getRequest({
    url: urls.plan.getFlowList,
    params
  })
}

export function getReleaseFlowList(params) {
  return getRequest({
    url: urls.plan.getReleaseFlowList,
    params
  })
}

export function getIntegrateFlowList(params) {
  return getRequest({
    url: urls.plan.getIntegrateFlowList,
    params
  })
}

export function getMergeFlowList(params) {
  return getRequest({
    url: urls.plan.getMergeFlowList,
    params
  })
}

/**
 * 删除任务
 *
 * @param {string} nodeAttrId - Task Id
 * @returns {Promise}
 */
export function deletePlanTask(nodeAttrId) {
  return postBodyRequest({
    url: urls.plan.deleteTask,
    params: { nodeAttrId }
  })
}

/**
 * 获取任务操作操作历史记录
 *
 * @param {Object} params
 * {
 *   nodeAttrId: string;
 *   current: number;
 *   pageSize: number;
 * }
 * @return {Promise}
 */
export function getTaskRecords(params) {
  return getRequest({
    url: urls.plan.taskRecords,
    params
  })
}

/**
 * 获取版本计划操作操作记录
 *
 * @param {Object} params
 * {
 *   scheduleId: string;
 *   current: number;
 *   pageSize: number;
 * }
 * @return {Promise}
 */
export function getPlanRecords(params) {
  return getRequest({
    url: urls.plan.planRecords,
    params
  })
}

/**
 * 新增或编辑任务
 * @param {Object} params
 * {
 *   scheduleId: string; - 排期（版本计划）ID
 *   nodeId: string; - 分类ID
 *   nodeStepId: string; - 阶段ID
 *   nodeStepAttrId?: string; - 任务ID
 *   nodeAttrName: string; - 任务名称
 *   core: number; - 任务类型，0:非核心，1:核心
 *   startTime: string; - 开始时间，可选值在 plan.const.js 的 NoticeType 中定义
 *   endTime: string; - 结束时间，同上
 *   startNoticeTime: string;
 *   endNoticeTime: string;
 *   operater: string; - 操作人
 *   status: string; - 状态
 *   tagId: string; - 标签
 *   flowIds: string; - 流水线
 *   todo: Array; - 清单
 *     {
 *       id: number;
 *       status: number;
 *       content: string;
 *     }
 *   remark?: string; 备注
 * }
 * @returns {Promise}
 */
export function savePlanTask(params) {
  return postBodyRequest({
    url: urls.plan.savePlanTask,
    params
  })
}

/**
 * 获取关联流水线
 * @param {string} scheduleId - 版本计划ID
 * @returns {Promise}
 */
export function getPlanFlows(scheduleId) {
  return getRequest({
    url: urls.plan.planFlows,
    params: { scheduleId }
  })
}

/**
 * 获取任务详情或初始化信息
 * 不传任务ID则获取任务初始化信息
 * @param {Object} params
 * {
 *   scheduleId: string; 版本计划ID
 *   nodeId: string; 分类ID
 *   nodeStepId: string; 阶段ID
 *   nodeStepAttrId?: string; 任务ID
 * }
 * @returns {Promise}
 */
export function initOrFetchTask(params) {
  return postBodyRequest({
    url: urls.plan.initOrFetchTask,
    params
  })
}
