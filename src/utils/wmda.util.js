// https://docs.58corp.com/#/space/1561532327731982336
init(location.host)
function init(domain) {
  try {
    let loadDomain = domain
    const isProd = domain === 'ee.58corp.com'
    loadDomain = loadDomain + '/api-yunxiao-iwork2'

    const ajax = new XMLHttpRequest()
    ajax.open(
      'get',
      window.location.protocol + '//' + loadDomain + '/wmda/getUserInfo'
    )
    ajax.withCredentials = true
    ajax.send()
    ajax.onreadystatechange = function () {
      if (ajax.readyState == XMLHttpRequest.DONE && ajax.status == 200) {
        const res = JSON.parse(ajax.responseText)
        if (isProd) {
          initWmda(24270504957749, 'ysha3ymn', '24260459992880', res.data)
        } else {
          initWmda(24270854990131, 'ofii482d', '24260459992880', res.data)
        }
        loadWmda(loadDomain)
      }
    }
  } catch (err) {
    // eslint-disable-next-line
    console.error(err)
  }
}

function loadWmda(domain) {
  try {
    const ajax = new XMLHttpRequest()
    ajax.open(
      'get',
      window.location.protocol + '//' + domain + '/wmda/getVersion'
    )
    ajax.withCredentials = true
    ajax.send()
    ajax.onreadystatechange = function () {
      if (ajax.readyState == XMLHttpRequest.DONE && ajax.status == 200) {
        const res = ajax.responseText
        if (res) {
          const wmda = document.createElement('script')
          wmda.type = 'text/javascript'
          wmda.async = true
          wmda.src = JSON.parse(res).data
          const s = document.getElementsByTagName('script')[0]
          s.parentNode.insertBefore(wmda, s)
        }
      }
    }
  } catch (error) {
    // eslint-disable-next-line
    console.error(error)
  }
}

function initWmda(appId, key, projectId, data) {
  const bizInfo = data?.yunxiaoOrgBizDto
  const orgNames = data?.allOrgName?.split('/') || []
  const orgMap = {
    0: '一级部门',
    1: '二级部门',
    2: '三级部门',
    3: '四级部门',
    4: '五级部门',
    5: '六级部门',
    6: '七级部门',
    7: '八级部门'
  }
  const orgs = orgNames.reduce((ret, curr, index) => {
    ret.push({
      key: orgMap[index],
      value: curr
    })
    return ret
  }, [])

  window.WMDA_SDK_CONFIG = {
    api_v: 1,
    sdk_v: 0.1,
    mode: 'report',
    appid: appId,
    key,
    project_id: projectId,
    page_extra: [
      ...orgs,
      {
        key: '业务线名称',
        value: bizInfo?.bizName || '业务线名称'
      },
      {
        key: '业务线ID',
        value: bizInfo?.orgId || '业务线ID'
      }
    ],
    getUserId: function () {
      return data?.userName
    },
    SPA_HASH: true
  }
}
