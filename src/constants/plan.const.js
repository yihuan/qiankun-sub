const freeze = Object.freeze

/**
 * 计划状态枚举
 */
export const PlanStatus = freeze({
  INIT: 0, // 待开始
  PENDING: 1, // 进行中
  DONE: 2, // 已完成
  DELAYED: 3 // ! Deprecated
})

/**
 * 计划状态映射关系
 */
export const PlanStatusMap = freeze({
  [PlanStatus.INIT]: {
    label: '待开始',
    color: '#50A944',
    value: PlanStatus.INIT
  },
  [PlanStatus.PENDING]: {
    label: '进行中',
    color: '#1564FF',
    value: PlanStatus.PENDING
  },
  [PlanStatus.DONE]: {
    label: '已完成',
    color: '#EAE9EB',
    value: PlanStatus.DONE
  },
  // ! Deprecated
  [PlanStatus.DELAYED]: {
    label: '延期未完成',
    color: '#D9001B',
    value: PlanStatus.DELAYED
  }
})

/**
 * 是否临时版本
 */
export const IsTemporary = freeze({
  YES: 1,
  NO: 0
})

/**
 * 是否延期
 */
export const IsDelayed = freeze({
  YES: 1,
  NO: 0
})

/**
 * 系统类型枚举
 */
export const SystemType = freeze({
  ALL: -1,
  ANDROID: 0,
  IOS: 1
})

/**
 * 提醒类型
 */
export const NoticeType = freeze({
  NONE: 0, // 无
  ON_TIME: 1, // 准时
  BEFORE_15MIN: 2, // 提前15分钟
  BEFORE_1HOUR: 3, // 提前1小时
  BEFORE_1DAY: 4 // 提前1天
})

/**
 * 提醒类型列表
 */
export const NOTICE_TYPES = freeze([
  freeze({
    label: '无',
    value: NoticeType.NONE
  }),
  freeze({
    label: '准时',
    value: NoticeType.ON_TIME
  }),
  freeze({
    label: '提前15分钟',
    value: NoticeType.BEFORE_15MIN
  }),
  freeze({
    label: '提前1小时',
    value: NoticeType.BEFORE_1HOUR
  }),
  freeze({
    label: '提前1天',
    value: NoticeType.BEFORE_1DAY
  })
])

/**
 * 构建包类型
 */
export const PackageType = freeze({
  BUILD: 3, //构建包
  GRAY: 1, //灰度包
  RELEASE: 2 //全量包
})

/**
 * 清单状态
 */
export const TodoStatus = freeze({
  DONE: 1, // 已完成
  UNDONE: 0 // 未完成
})

/**
 * 字段类型
 */
export const FieldType = freeze({
  SINGLE_SELECT: 'select',
  MULTIPLE_SELECT: 'multiSelect'
})
