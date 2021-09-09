let { writeFileSync } = require('fs')
let { join } = require('path')
let grammar = require('./textmate-grammar')
let file = join(__dirname, '..', 'arc-textmate-grammar.json')
let data = JSON.stringify(grammar, null, 2) + '\n'
writeFileSync(file, data)
