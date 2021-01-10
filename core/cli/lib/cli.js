'use strict';
const pkg = require('../package.json')
const path = require('path')
// semver 用于比较版本号
const semver = require('semver')
// 用于改变颜色
const colors = require('colors')
// 判断路径是否存在
const pathExists = require('path-exists').sync
// 获取用户家目录
const userHome = require('user-home')
// 解析传入参数
const minimist = require('minimist')

const dotEnv = require('dotenv')

const constant = require('./const')
const log = require('@diy-cli-stu/log')

module.exports = cli;
let args, config;
function cli() {
    try {
        checkPkgVersion()
        checkNodeVersion()
        checkRoot()
        checkUserHome()
        checkInputArgs()
        checkEnv()
    } catch (e) {
        log.error(e.message)
    }
}

function checkGlobalUpdate(){
    
}

function checkEnv(){
    const dotenvPath = path.resolve(userHome, '.env')
    // 设置到环境变量值
    if(pathExists(dotenvPath)){
        dotEnv.config({
            path: dotenvPath
        })
    }
    createDefaultConfig()
    log.verbose('环境变量', process.env.CLI_HOME_PATH)
}

function createDefaultConfig(){
    const cliConfig = {
        home:userHome
    }
    if(process.env.CLI_HOME){
        cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME)
    }else {
        cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME)
    }
    process.env.CLI_HOME_PATH = cliConfig.cliHome 
}
function checkInputArgs(){
    args = minimist(process.argv.slice(2))
    checkArgs()
}
function checkArgs(){
    // 根据传入的debug参数，设置日志等级
    if(args.debug){
        process.env.LOG_LEVEL = 'verbose'
    }else{
        process.env.LOG_LEVEL = 'info'
    }
    log.level = process.env.LOG_LEVEL

}

function checkUserHome(){
    if(!userHome || !pathExists(userHome)){
        throw new Error(colors.red('当前登录用户主目录不存在！'))
    }
}

function checkRoot() {
    const rootCheck = require('root-check')
    rootCheck();
    // 用 `sudo diy-cli-stu` 以root身份执行，发现返回的不是0。 
    // console.log(process.geteuid())
}

function checkNodeVersion() {
    const currentVersion = process.version
    const lowestVersion = constant.LOWEST_NODE_VERSION

    if (!semver.gte(currentVersion, lowestVersion)) {
        throw new Error(colors.red(`diy-cli-stu 需要安装 v${lowestVersion} 以上版本的 Node.js`))
    }
}

function checkPkgVersion() {
    log.notice('cli', pkg.version)
}