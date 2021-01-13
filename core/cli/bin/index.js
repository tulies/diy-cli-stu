#!/usr/bin/env node

const importLocal = require('import-local')

if(importLocal(__filename)){
    require('npmlog').info('cli','正在使用 diy-cli-stu 本地版本')
}else{
    // require('../lib/index.js')(process.argv.slice(2))
    require('../lib/commander')
}
