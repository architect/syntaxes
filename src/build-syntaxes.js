let util = require('util')
let { writeFileSync } = require('fs')
let { join } = require('path')
let plist = require('plist')

let textmate = require('./textmate')
let highlight = require('./highlight')

let newline = '\n'

/**
 * Textmate (JSON)
 */
let tmFile = join(__dirname, '..', 'arc-textmate.json')
let tm = JSON.stringify(textmate, null, 2) + newline
writeFileSync(tmFile, tm)
console.log('Built Arc syntax definition: VS Code (TextMate / JSON)')

/**
 * Textmate (PLIST)
 */
let tmLangFile = join(__dirname, '..', 'arc.tmLanguage')
let tmLang = plist.build(textmate) + newline
writeFileSync(tmLangFile, tmLang)
console.log('Built Arc syntax definition: TextMate (TextMate / PLIST)')

/**
 * Highlight.js (CJS)
 */
let props = Object.entries(highlight.props).map(([ k, v ]) => {
  let item = typeof v === 'string' ? `'${v}'` : util.inspect(v, { depth: null })
  return `let ${k} = ${item}`
}).join(newline)
let hljs = props += `\nmodule.exports = ` + highlight.index + newline
let hljsFile = join(__dirname, '..', 'arc-hljs-grammar.js')
writeFileSync(hljsFile, hljs)
console.log('Built Arc syntax definition: VS Code (Highlight.js / CJS module)')
