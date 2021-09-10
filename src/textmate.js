/* eslint-disable indent */
let {
  anyNonWhitespace, anyWhitespace, ascii, captureGroupStart, concat, end, greedy,
  group, lit, negLookahead, oneOrMore, optional, or, posLookahead, posLookbehind,
  set, space, start, tab, zeroOrMore
} = require('./_regex')

// These two allow us to capture clean tokens as we work through lines of potentially many words
let precedingSpaceStartOrCapture = posLookbehind(anyWhitespace, or, start, or, captureGroupStart)
let proceedingSpaceCommentOrEnd = posLookahead(anyWhitespace, or, '#', or, end)

// Standard ascii charset sans quotes
let asciiWithoutQuotes = ascii.filter(c => ![ '"', `'`, '`' ].includes(c))

let syntax = {
  name: 'Architect',
  scopeName: 'source.arc',
  firstLineMatch: concat(start, '@', set(...asciiWithoutQuotes), oneOrMore),
  patterns: [
    { include: '#comments' },

    { include: '#booleans' },

    { include: '#numbers' },

    { include: '#strings' },

    // Pragmas
    {
      comment: 'pragmas',
      name: 'entity.name.function.arc',
      match: concat(start, '@', set(...asciiWithoutQuotes), oneOrMore),
    },

    // Arrays are handled inline by individual string captures, so do not need a pattern. Yay!

    // Map (aka object) properties
    // Note: these are handled recursively once detected (two spaces / tabs + multiple words)
    {
      comment: 'map properties (only); map (and vector) names cannot be detected',
      begin: concat(
        // Anchor on new lines starting with two spaces / tabs
        group(
          start,
          set(tab, space), '{2}'
        ),
        // But it cannot start with comment
        negLookahead('#'),
        // Must then be followed by >0 real characters
        group(anyNonWhitespace, oneOrMore),
        // Cannot be followed by a comment (or that would make it a vector item, not a map property)
        negLookahead(anyWhitespace, zeroOrMore, '#'),
        // Must then be followed by a space, preceding >0 real characters
        posLookahead(group(
          set(tab, space),
          anyNonWhitespace, oneOrMore
        ))
      ),
      beginCaptures: {
        '0': { name: 'variable.other.arc' }
      },
      end: posLookahead(end, or, '#'),
      patterns: [
        { include: '$self' }
      ]
    },
  ],
  repository: {
    comments: {
      patterns: [
        {
          name: 'comment.line.arc',
          match: concat(
            '#',
            greedy,
            end,
          )
        }
      ]
    },

    booleans: {
      patterns: [
        // true
        {
          name: 'constant.language.boolean.true.arc',
          match: concat(precedingSpaceStartOrCapture, group('true'), proceedingSpaceCommentOrEnd)
        },

        // false
        {
          name: 'constant.language.boolean.false.arc',
          match: concat(precedingSpaceStartOrCapture, group('false'), proceedingSpaceCommentOrEnd)
        },
      ]
    },

    // Ints and floats are handled in the same regex
    numbers: {
      patterns: [
        {
          name: 'constant.numeric.decimal.arc',
          match: concat(
            precedingSpaceStartOrCapture,
            group(
              // Optional leading number with decimal
              group(lit`d`, zeroOrMore, set('.')), optional,
              // Int or decimal places
              lit`d`, oneOrMore,
            ),
            proceedingSpaceCommentOrEnd)
        },
      ]
    },

    strings: {
      patterns: [
        // Double-quoted strings
        {
          // Top-level name handles everything that isn't special characters or escaped double quote
          name: 'string.quoted.double.arc',
          begin: concat(precedingSpaceStartOrCapture, group('"')),
          beginCaptures: {
            '0': {
              name: 'string.quoted.double.arc'
            }
          },
          end: group('"'),
          endCaptures: {
            '0': {
              name: 'string.quoted.double.arc'
            }
          },
          patterns: [
            {
              name: 'string.quoted.double.arc',
              match: group(lit`\\"`)
            }
          ]
        },

        // Single-quoted strings
        {
          // Top-level name handles everything that isn't special characters or escaped double quote
          name: 'string.quoted.single.arc',
          begin: concat(precedingSpaceStartOrCapture, group("'")),
          beginCaptures: {
            '0': {
              name: 'string.quoted.single.arc'
            }
          },
          end: group("'"),
          endCaptures: {
            '0': {
              name: 'string.quoted.single.arc'
            }
          },
          patterns: [
            {
              name: 'string.quoted.single.arc',
              match: group(lit`\\'`)
            }
          ]
        },

        // Backtick-quoted strings
        {
          // Top-level name handles everything that isn't special characters or escaped double quote
          name: 'string.quoted.backtick.arc',
          begin: concat(precedingSpaceStartOrCapture, group('`')),
          beginCaptures: {
            '0': {
              name: 'string.quoted.backtick.arc'
            }
          },
          end: group('`'),
          endCaptures: {
            '0': {
              name: 'string.quoted.backtick.arc'
            }
          },
          patterns: [
            {
              name: 'string.quoted.backtick.arc',
              match: group(lit`\\\``)
            }
          ]
        },

        // Unquoted (raw) strings
        {
          name: 'string.unquoted.arc',
          match: concat(
            precedingSpaceStartOrCapture,
            group(
              set(...asciiWithoutQuotes), oneOrMore
            ),
            proceedingSpaceCommentOrEnd
          )
        },
      ]
    },
  }
}

module.exports = syntax
