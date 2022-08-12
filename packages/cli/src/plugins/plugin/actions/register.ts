/**
 * 插件注册 action (局部注册 | 全局注册)
 * @author: sunkeysun
 */
import { plugin, prompts } from '../../../core/index.js'

export default class Action extends plugin.Action {
  name = 'register'
  description = '注册插件使其可通过 inventor 调用，支持全局插件和局部插件'
  options = [
    { option: '-n --name [name]', description: '注册插件名称，作为插件调用指令' },
    { option: '-p --package [name]', description: '插件 npm 包名称，可支持绝对路径' },
  ]

  async action(options: Record<string, string>) {
    console.log(options)
    const answers = await prompts.prompts([
      {
        type: 'text',
        name: 'name',
        message: '请输入注册插件名称[用于调用插件的命令]',
        validate: async (name) => {
          if (!false) {
            return '插件名称不合法[只允许字母数字下划线]'
          }
          if (!false) {
            return '插件名称已经被注册，请选择其他名称'
          }
          return true
        },
      },
      {
        type: 'text',
        name: 'package',
        message: '请输入插件 npm 包名称[或插件入口文件全路径]',
      },
    ])

    console.log(answers)
  }
}
