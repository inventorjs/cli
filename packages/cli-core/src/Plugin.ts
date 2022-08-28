/**
 * Plugin 抽象类
 * @author: sunkeysun
 */
import path from 'node:path'
import inquirer from 'inquirer'
import { oraPromise } from 'ora'
import * as fs from './modules/fs.js'
import * as env from './modules/env.js'
import * as log from './modules/log.js'
import * as git from './modules/git.js'
import * as pm from './modules/pm.js'
import * as husky from './modules/husky.js'

export abstract class Plugin {
  abstract description: string
  #entryPath: string
  #templatePath: string
  #actionPath: string

  constructor({ entryPath }: { entryPath: string }) {
    this.#entryPath = entryPath
    this.#templatePath = path.resolve(entryPath, '../../templates')
    this.#actionPath = path.resolve(entryPath, '../actions')
  }

  get entryPath() {
    return this.#entryPath
  }
  get templatePath() {
    return this.#templatePath
  }
  get actionPath() {
    return this.#actionPath
  }

  async prompt(...args: Parameters<typeof inquirer.prompt>) {
    return inquirer.prompt(args[0])
  }

  async install(...args: Parameters<typeof pm.install>) {
    return pm.install(...args)
  }
  async addDependencies(...args: Parameters<typeof pm.addDependencies>) {
    return pm.addDependencies(...args)
  }
  async addDevDependencies(...args: Parameters<typeof pm.addDevDependencies>) {
    return pm.addDevDependencies(...args)
  }
  async removeDependencies(...args: Parameters<typeof pm.removeDependencies>) {
    return pm.removeDependencies(...args)
  }
  async removeDevDependencies(
    ...args: Parameters<typeof pm.removeDevDependencies>
  ) {
    return pm.removeDevDependencies(...args)
  }

  async renderTemplate(
    templateName: string,
    destinationName: string,
    templateData: Record<string, unknown>,
  ) {
    const templateDir = path.resolve(this.#templatePath, templateName)
    const destinationDir = path.resolve(this.pwd, destinationName)
    return fs.renderTemplate(templateDir, destinationDir, templateData)
  }
  async renderTemplateFile(
    templateName: string,
    templateFile: string,
    destinationFile: string,
    templateData: Record<string, unknown>,
  ) {
    const templateFilePath = path.resolve(
      this.#templatePath,
      templateName,
      templateFile,
    )
    const destinationFilePath = path.resolve(env.cwd, destinationFile)
    return fs.renderTemplateFile(
      templateFilePath,
      destinationFilePath,
      templateData,
    )
  }

  async runTask(task: () => Promise<unknown>, cwd?: string) {
    const oldCwd = env.cwd
    env.changeCwd(cwd ?? env.cwd)
    try {
      await task()
      env.changeCwd(oldCwd)
    } catch (err) {
      env.changeCwd(oldCwd)
      throw err
    }
  }
  async loadingTask(...args: Parameters<typeof oraPromise>) {
    return oraPromise(...args)
  }
  async seriesTask(tasks: Promise<unknown>[]) {
    const results = []
    for (const task of tasks) {
      const result = await task
      results.push(result)
    }
    return results
  }

  filename(...args: Parameters<typeof env.filename>) {
    return env.filename(...args)
  }
  dirname(...args: Parameters<typeof env.dirname>) {
    return env.dirname(...args)
  }
  get color() {
    return this.log.color
  }
  get pwd() {
    return env.pwd()
  }
  get homedir() {
    return env.homedir()
  }
  get username() {
    return env.username()
  }
  get log() {
    return log
  }
  get git() {
    return git
  }
  get pm() {
    return pm
  }
  get fs() {
    return fs
  }
  get husky() {
    return husky
  }
}

export interface ActionOption {
  option: string
  description: string
  default?: unknown
}

export interface ActionOptions {
  [k: string]: unknown
}
export abstract class Action extends Plugin {
  abstract options: ActionOption[]
  abstract action(options: Record<string, unknown>): Promise<void>
}
