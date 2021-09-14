/* eslint-disable indent */

// Gather and concat all the regex components
let concat = (...items) => items.join('')

// Create regex sets
let set = (...items) => `[${concat(...items)}]`
let negSet = (...items) => `[^${concat(...items)}]`

// Create capture groups
let group = (...items) => `(${concat(...items)})`

// Literalizer
let l = str => `\\${str}`

let re = {
  // Positions
  start: '^',
  end: '$',
  captureGroupStart: l`G`, // Oniguruma-specific

  // Chars
  alphaLow: 'a-z',
  alphaUp: 'A-Z',
  zeroToNine: '0-9',
  parens: '()',
  braces: '{}',
  brackets: l`[` + l`]`,
  angleBrackets: '<>',
  anyNonWhitespace: l`S`,

  // Space
  space: ' ',
  tab: l`t`,
  anyWhitespace: l`s`,

  // Bool
  or: '|',

  // Quant
  greedy: '.*',
  zeroOrMore: '*',
  oneOrMore: '+',
  optional: '?',

  // Lookgaround
  posLookahead: (...items) => `(?=${concat(...items)})`,
  negLookahead: (...items) => `(?!${concat(...items)})`,
  posLookbehind: (...items) => `(?<=${concat(...items)})`,

  // Utils
  concat,
  set,
  negSet,
  group,
  lit: l,
}

// This is the ascii charset without the two reserved Arc chars: `@` + `#`
let ascii = [
  re.alphaLow,
  re.alphaUp,
  re.zeroToNine,
  '!',
  '$',
  '%',
  '^',
  '&',
  '*',
  re.parens,
  re.braces,
  re.brackets,
  re.angleBrackets,
 l`-`,
  '_',
 l`+`,
  '=',
 l`|`,
 l`\\`,
  ':',
  ';',
  '"',
  `'`,
  ',',
 l`.`,
 l`?`,
  '/',
  '`',
  '~',
]

module.exports = {
  ...re,
  ascii,
}
