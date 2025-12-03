const chalk = require('chalk')
const { createUploader } = require('@mf2e/uploader')
const pkg = require('../package.json')

// 配置
const { channel, name } = pkg

// 获取命令行参数
const args = process.argv.slice(2)
const env = args.includes('publish') ? 'page' : 'test' // 默认 test，如果有 publish 参数则为 page

console.log(chalk.cyan(`项目: ${channel}/${name}`))
console.log(chalk.cyan(`当前环境: ${env}`))

async function upload() {
  const uploader = createUploader({
    certificate: 'rw',
    interactive: true,
  })

  // 1. 上传静态资源 (static/**)
  // 目标: /f2e/${channel}/${name}/static/...
  console.log(chalk.yellow('正在上传静态资源...'))
  uploader.createTask({
    remoteBasePath: 'https://wp.m.163.com/163',
    remote: `/f2e/${channel}/${name}/static`,
    locals: ['./dist/static/**/*'],
    exclude: ['./dist/*.html'],
  })

  // 2. 上传 HTML (index.html, service-worker.js)
  // 目标: /${env}/${channel}/${name}/...
  console.log(chalk.yellow('正在上传 HTML...'))
  uploader.createTask({
    remoteBasePath: 'https://wp.m.163.com/163',
    remote: `/${env}/${channel}/${name}`,
    locals: ['./dist/index.html'],
    overwrite: true,
  })

  await uploader.runAllTask()
  console.log(chalk.green('上传完成!'))
}

upload().catch(err => {
  console.error(chalk.red('上传失败:'), err)
  process.exit(1)
})