const projectName = require('../../package.json').name

export function warn(...message) {
  // eslint-disable-next-line
  console.warn(`[${projectName} warn]:`, ...message)
}

export function error(...message) {
  // eslint-disable-next-line
  console.error(`[${projectName} error]:`, ...message)
}

export function info(...msg) {
  // eslint-disable-next-line
  console.info(...msg)
}

export function throwError(msg) {
  throw new Error(`[${projectName} error]:${msg}`)
}
