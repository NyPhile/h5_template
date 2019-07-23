import '../css/index.less' // 引入css
import './common.js' // 公共js
import { shareWithConfig } from 'utils/share.js'

$('.banner').on('click', e => {
  shareWithConfig()
})