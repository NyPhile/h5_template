import { loadScript } from 'utils/utils.js'

// 移动端console
if (process.env.NODE_ENV === 'development' || /debug/ig.test(location.hash)) {
  loadScript('//cdn.jsdelivr.net/npm/eruda', () => {
    window.eruda.init()
  })
}

if (process.env.NODE_ENV === 'production') {
  // 统计
  loadScript('//static.ws.126.net/163/frontend/libs/antanalysis.min.js')
  loadScript('//static.ws.126.net/163/frontend/antnest/' + process.env.ANT_PROJECT_ID + '.js')
  loadScript('//hm.baidu.com/hm.js?fbbd5a62f1db722ba672bc37a9bf6b05')

  loadScript('//analytics.163.com/ntes.js', () => {
    setTimeout(() => {
      window._ntes_nacc = 'mapp'
      neteaseTracker()
      loadScript('//static.ws.126.net/utf8/3g/util/analysis.min.js', () => {
        setTimeout(() => {
          window._ntes_sps_modelid = process.env.PROJECT_CHANNEL + process.env.PROJECT_NAME
          neteaseAnalysis({type:"special",spst:5,modelid:_ntes_sps_modelid});
        }, 20)
      })
    }, 20)
  })

  // 错误监控
  // loadScript('//static.ws.126.net/163/frontend/libs/raven-vue-3.26.4.min.js', () => {
  //   window.Raven.config('https://76981b9dcb584c2990e70dc596eeac3c@sentry.music.163.com/13', {
  //     tags: {
  //       project: process.env.PROJECT_NAME
  //     }
  //   }).install()
  // })
}
