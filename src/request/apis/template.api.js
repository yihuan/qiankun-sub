import { getRequest, postBodyRequest } from '@/request/http'
import urls from '@/request/urls'

/**
 * 获取模板列表
 * @param {Object} params
 * {
 *   prodName: string;
 *   templateName: string;
 *   currentPage: number;
 *   pageSize: number;
 * }
 * @returns {Promise}
 */
export function getList(params) {
  return getRequest({
    url: urls.template.list,
    params
  })
}

/**
 * 新建模板
 * @param {string} prodName - 产品(app)名称
 * @param {string} templateName - 模板名称
 * @returns {Promise}
 */
export function createTemplate(prodName, templateName) {
  return getRequest({
    url: urls.template.create,
    params: {
      prodName,
      templateName
    }
  })
}

/**
 * 复制模板
 * @param {number} id
 * @returns {Promise}
 */
export function copyTemplate(id) {
  return postBodyRequest({
    url: urls.template.copy,
    params: { id }
  })
}

/**
 * 删除模板或节点
 * @param {number} id - ID
 * @param {number} operateLevel - 操作级别，参考 OperateLevel in src/constants/template.const.js
 * @returns {Promise}
 */
export function deleteNode(id, operateLevel) {
  return postBodyRequest({
    url: urls.template.delete,
    params: { id, operateLevel }
  })
}

/**
 * 获取模板详情
 * @param {number} id
 * @returns {Promise}
 */
export function getTemplateById(id) {
  return getRequest({
    url: urls.template.details,
    params: { id }
  })
}

/**
 * 重命名节点
 * @param {number} operateLevel - 操作级别 Available values in NodeType of template.const.js
 * @param {number} id - ID
 * @param {string} name - 名称
 * @returns {Promise}
 */
export function renameNode(operateLevel, id, name) {
  return getRequest({
    url: urls.template.rename,
    params: { operateLevel, id, name }
  })
}

/**
 * 创建阶段
 * @param {number} nodeId - 分类ID
 * @param {string} stepName - 名称
 * @returns {Promise}
 */
export function createStage(nodeId, stepName) {
  return getRequest({
    url: urls.template.createStage,
    params: { nodeId, stepName }
  })
}

/**
 * 创建任务
 * @param {number} stepId - ID
 * @param {string} attrName - 名称
 * @returns {Promise}
 */
export function createTask(stepId, attrName) {
  return getRequest({
    url: urls.template.createTask,
    params: { stepId, attrName }
  })
}
