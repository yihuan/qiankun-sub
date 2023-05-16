import dayjs from 'dayjs'

/**
 * 格式化日期
 * @see Available formats: https://day.js.org/docs/en/display/format
 * @param {Number|Date|String} date
 * @param {String} formatStr
 * @returns {String}
 */
export function formatDate(date, formatStr = 'YYYY-MM-DD') {
  if (!date) return ''
  return dayjs(date).format(formatStr)
}
