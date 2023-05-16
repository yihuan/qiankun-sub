import qs from 'qs'
import axios from 'axios'
import { Message } from '@/utils/message.util'
import { error } from '@/utils/log.util'

const duration = 2500

axios.defaults.withCredentials = true
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

export const isProduction = location.host === 'ee.58corp.com'
export const isSandbox = location.host === 'ee.58v5.cn'
export const isTest = location.host === 'ee-dev.58v5.cn'
export const isStandaloneTest = location.host === 'yici.58v5.cn'

export const BASE_URL = isProduction
  ? 'https://ee.58corp.com/api-yunxiao-ici/'
  : isSandbox || isStandaloneTest
  ? 'https://ee.58v5.cn/api-yunxiao-ici/'
  : isTest
  ? 'https://ee.58v5.cn/api-yunxiao-ici/'
  : 'https://ee.58v5.cn/api-yunxiao-ici/' // local

export const IWORK_BASE_URL = isProduction
  ? window.location.origin + '/api-yunxiao-iwork2/'
  : window.location.protocol + '//ee-dev.58v5.cn/api-yunxiao-iwork2/'

axios.interceptors.request.use(
  function (config) {
    const moreConfig = {
      crossDomain: true
    }
    config = Object.assign(config, moreConfig)
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

function isObject(value) {
  return value && typeof value === 'object' && value.constructor === Object
}

axios.interceptors.response.use(
  (response) => {
    // 302
    if (response?.status === 203) {
      ssoRedirect()
    }

    if (
      response?.status != 200 &&
      response?.statusText != 'OK' &&
      !response?.config?.errorTip
    ) {
      return Promise.reject(response.data)
    }
    if (
      response?.config?.responseType === 'blob' &&
      response?.status === 200 &&
      response?.statusText === 'OK'
    ) {
      return Promise.resolve(response)
    }
    if (!isObject(response.data)) {
      return Promise.resolve(response.data)
    }
    if (response?.data?.respCode === 0) {
      // iCi api
      return Promise.resolve({
        data: response?.data?.respData,
        rightData: response?.data?.rightData
      })
    } else if (response?.data?.code === 200) {
      // iWork api
      return Promise.resolve(response?.data?.data)
    } else {
      Message({
        dangerouslyUseHTMLString: true,
        type: 'error',
        message: response.data.errMsg,
        duration: duration
      })
      return Promise.reject(response.data)
    }
  },
  (error) => {
    try {
      const statusCode = error?.response?.status
      if (statusCode) {
        switch (statusCode) {
          case 302: {
            ssoRedirect()
            break
          }
          case 401:
            break
          // 请求不存在
          case 404:
            Message({
              dangerouslyUseHTMLString: true,
              type: 'error',
              message: '网络请求不存在',
              duration: duration
            })
            break
          case 500:
            Message({
              type: 'error',
              message: '服务器发生错误，请稍后再试',
              duration: duration
            })
            break
          default:
            Message({
              dangerouslyUseHTMLString: true,
              type: 'error',
              message: error?.message,
              duration: duration
            })
        }
        return Promise.reject(error.response)
      }
    } catch (error) {
      console.error('Error', error) // eslint-disable-line
    }
  }
)

function ssoRedirect() {
  const currentPath = document.location.href
    .replace('#', 'iwork-well')
    .replace('?', 'iwork-ques')
    .replace(/=/g, 'iwork-eqs')
    .replace(/&/g, 'iwork-and')
    .replace('http', 'iwork-hp')

  // Use iWork SSO
  const redirectPage =
    BASE_URL.replace('/api-yunxiao-ici', '/api-yunxiao-iwork2') +
    'login/toL?fromUrl=' +
    currentPath
  location.href = `https://passport.58corp.com/login?service=${encodeURIComponent(
    redirectPage
  )}`
}

const CancelToken = axios.CancelToken
const cancellableRequests = {}

export const postRequest = ({
  url,
  tag = '',
  params = {},
  config = {},
  cancellable = false
}) => {
  if (cancellable && cancellableRequests[url]) {
    cancellableRequests[url]()
  }

  if (!url) {
    error('Request URL is required')
  }
  const defaultConfig = {
    method: 'post',
    url: url + (tag ? `/${tag}` : ''),
    data: qs.stringify(params),
    cancelToken: new CancelToken(function executor(c) {
      if (cancellable) {
        cancellableRequests[url] = c
      }
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  }
  config = Object.assign(
    defaultConfig,
    {
      errorTip: false
    },
    config
  )
  return axios(config)
}

export const postBodyRequest = ({
  url,
  tag = '',
  params = {},
  config = {},
  cancellable = false
}) => {
  if (cancellable && cancellableRequests[url]) {
    cancellableRequests[url]()
  }

  if (!url) {
    error('Request URL is required')
  }
  const defaultConfig = {
    method: 'post',
    url: url + (tag ? `/${tag}` : ''),
    data: params,
    cancelToken: new CancelToken(function executor(c) {
      if (cancellable) {
        cancellableRequests[url] = c
      }
    }),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  }
  config = Object.assign(
    defaultConfig,
    {
      errorTip: false
    },
    config
  )
  return axios(config)
}

export const postFileRequest = ({
  url,
  tag = '',
  params = {},
  config = {},
  cancellable = false
}) => {
  if (cancellable && cancellableRequests[url]) {
    cancellableRequests[url]()
  }

  if (!url) {
    error('Request URL is required')
  }
  const defaultConfig = {
    method: 'post',
    url: url + (tag ? `/${tag}` : ''),
    data: params,
    cancelToken: new CancelToken(function executor(c) {
      if (cancellable) {
        cancellableRequests[url] = c
      }
    }),
    headers: {
      'Content-Type':
        'multipart/form-data; boundary=----WebKitFormBoundaryWnM976bAKhZRgF5D'
    }
  }
  config = Object.assign(
    defaultConfig,
    {
      errorTip: false
    },
    config
  )
  return axios(config)
}

export const getRequest = ({
  url,
  tag = '',
  params = {},
  config = {},
  cancellable = false
}) => {
  if (cancellable && cancellableRequests[url]) {
    cancellableRequests[url]()
  }
  if (!url) {
    error('Request URL is required')
  }
  const defaultConfig = {
    method: 'get',
    params: params,
    cancelToken: new CancelToken(function executor(c) {
      if (cancellable) {
        cancellableRequests[url] = c
      }
    }),
    url: url + (tag ? `/${tag}` : '')
  }
  config = Object.assign(
    defaultConfig,
    {
      errorTip: false
    },
    config
  )
  return axios(config)
}
