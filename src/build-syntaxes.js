let { writeFileSync } = require('fs')
let { join } = require('path')
let textmate = require('./textmate')
let file = join(__dirname, '..', 'arc-textmate.json')
let data = JSON.stringify(textmate, null, 2) + '\n'
writeFileSync(file, data)
