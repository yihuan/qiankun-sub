const freeze = Object.freeze

/**
 * 节点类型，对应 operateLevel
 */
export const NodeType = freeze({
  TASK: 1, // attr 节点
  STAGE: 2, // step 节点
  CATEGORY: 3, // node 节点
  TEMPLATE: 4 // 模板
})

export const TemplateType = freeze({
  APP: 0,
  SYSTEM: 1
})
