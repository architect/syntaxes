let { writeFileSync } = require('fs')
let { join } = require('path')
let plist = require('plist')

let textmate = require('./textmate')

let jsonFile = join(__dirname, '..', 'arc-textmate.json')
let json = JSON.stringify(textmate, null, 2) + '\n'
writeFileSync(jsonFile, json)
console.log('Built Arc syntax definition: VS Code (TextMate / JSON)')

let tmFile = join(__dirname, '..', 'arc.tmLanguage')
let tm = plist.build(textmate) + '\n'
writeFileSync(tmFile, tm)
console.log('Built Arc syntax definition: TextMate (TextMate / PLIST)')
