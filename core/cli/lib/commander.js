const commander = require('commander')
const pkg = require('../package.json')

// 获取commander的单例
// const {program} = commander

// 手动实例化一个commander
const program = new commander.Command()
program
    .name(Object.keys(pkg.bin)[0])  // 设置脚手架Usage的名称
    .usage('<command> [options]')   // 设置脚手架Usage中的描述
    .version(pkg.version)           // 脚手架版本号
    .option('-d, --debug','是否开启调试模式', false) // 注册一个命令
    .option('-e, --envName <envName>', '获取环境变量名称')
    // .parse(process.argv);           // 传入参数

// console.log(program.debug)
// console.log(program.envName)
// program.outputHelp() // 直接打印出帮助信息
// console.log(program.opts()) // options对象

// command api 注册
// 这是一个新的对象了，跟program不是一个对象， 这里注册的是主命令
const clone = program.command('clone <source> [destination]')  // 尖括号是必选，方括号是可选
clone.description('clone a repository') // 描述
    .option('-f, --force', '是否强制克隆')
    .action((source, destination,cmdObj)=>{
        console.log('do clone',source, destination,cmdObj.force)
    })

// addCommand 注册子命令
const service = new commander.Command('service')
service.description('service start or stop')
service.command('start [port]')
    .description('start service at some port')
    .action((port)=>{
        console.log('do service start', port)
    })
service.command('stop')
    .description('stop service')
    .action(()=>{
        console.log('do service stop')
    })
// 添加子命令的注册
program.addCommand(service)

// 这个会将 install直接加载脚手架名字后面，diy-cli-stu-install
// program.command('install [name]', 'install package',{
//     executableFile: 'diy-cli', // 会把默认的`diy-cli-stu-install` 改成 `diy-cli`来执行
//     isDefault: true, // 会让脚手架默认执行这个命令
//     hidden: true // 可以将当前command在help中隐藏
// }).alias('i')

// 下面这个可以匹配到所有命令，可以强制要求我们必须要传入一个参数
// program.arguments('<cmd> [options]')
//     .description('test command',{ // 加入第二个参数就会出现描述里
//         cmd: 'command to run',
//         options: 'options for command'
//     })
//     .action((cmd, options)=>{
//         console.log(cmd, options)
//     })


// 高级定制1：自定义help信息
// program.helpInformation = function(){
//     // return 'your help info1'
//     return ''
// }
// // 监听htlp返回
// program.on('--help',()=>{
//     console.log('your help info2')
// })

// 高级定制额：实现debug模式
// 这个监听是早于我们命令执行之前处理的
program.on('option:debug', ()=>{
    if(program.debug){
        process.env.LOG_LEVEL = 'verbose'
    }
    console.log(process.env.LOG_LEVEL)
})

// 高级定制3：对未知命令监听
program.on('command:*', (obj)=>{
    // 走到这里面，就是没有命中到已知的命令。 就可以在这里做错误提示了
    console.log(obj)
    console.error('未知的命令：'+obj[0])
    const availableCommads = program.commands.map(cmd=>cmd.name())
    console.log('可用命令：'+availableCommads.join(','))
})

program.parse(process.argv)
// program.outputHelp() // 直接打印出帮助信息
