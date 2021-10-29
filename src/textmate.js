/* eslint-disable indent */
let {
  alphaLow, alphaUp, anyNonWhitespace, anyWhitespace, ascii, captureGroupStart, concat, end, greedy,
  group, lit, negLookahead, negSet, oneOrMore, optional, or, posLookahead,
  posLookbehind, set, space, start, tab, zeroOrMore, zeroToNine
} = require('./_regex')

// These two allow us to capture clean tokens as we work through lines of potentially many words
let precedingSpaceStartOrCapture = posLookbehind(anyWhitespace, or, start, or, captureGroupStart)
let proceedingSpaceCommentOrEnd = posLookahead(anyWhitespace, or, '#', or, end)

let syntax = {
  name: 'Architect',
  scopeName: 'source.arc',
  firstLineMatch: concat(start, '@', set(alphaLow, alphaUp, zeroToNine, '-', '_'), oneOrMore),
  patterns: [
    { include: '#comments' },

    { include: '#booleans' },

    { include: '#numbers' },

    { include: '#strings' },

    // Pragmas
    {
      comment: 'pragmas',
      name: 'entity.name.function.arc',
      match: concat(start, '@', set(alphaLow, alphaUp, zeroToNine, '-', '_'), oneOrMore),
    },

    /**
     * Arrays are handled inline by individual string captures, so do not need a pattern. Yay!
     */

    // Map (aka object) properties
    // - This is a bit funky, but because TM grammar rules fall through…
    // - So let's assume we find a new line with two spaces/tabs (aka a map prop or vector item)
    //   - To detect vector items, we just need to reliably match map properties (e.g. a word followed by non-comments) – the rest just falls through!
    //   - And if we find a map property, its values will be handled recursively with $self
    {
      comment: 'map properties & implied vector values; map / vector names cannot be detected',
      begin: concat(
        // Anchor on new lines starting with two spaces / tabs
        group(
          start,
          set(tab, space), '{2}'
        ),
        // But it cannot start with comment
        negLookahead('#'),
        // Must then be followed by >0 chars; capture until finding a # or space char
        // - Hitting a # makes this a vector value, so don't match and fall through
        // - Hitting a space makes this a map property, keep on checking
        group(negSet(`#`, lit`s`), oneOrMore),
        // Map props cannot be followed by a comment (or they'd be vector items)
        negLookahead(anyWhitespace, zeroOrMore, '#'),
        // Ok, so now we've found a whole word; so look for some spaces preceding real chars
        posLookahead(group(
          group(set(tab, space), oneOrMore),
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
          end: concat(
            group('"'),
            proceedingSpaceCommentOrEnd,
          ),
          endCaptures: {
            '0': {
              name: 'string.quoted.double.arc'
            }
          },
          patterns: [
            {
              name: 'string.quoted.double.arc',
              match: group(lit`\\"`)
            },
            {
              name: 'invalid.illegal.arc',
              match: '"'
            },
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
          end: concat(
            group("'"),
            proceedingSpaceCommentOrEnd,
          ),
          endCaptures: {
            '0': {
              name: 'string.quoted.single.arc'
            }
          },
          patterns: [
            {
              name: 'string.quoted.single.arc',
              match: group(lit`\\'`)
            },
            {
              name: 'invalid.illegal.arc',
              match: "'"
            },
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
          end: concat(
            group('`'),
            proceedingSpaceCommentOrEnd,
          ),
          endCaptures: {
            '0': {
              name: 'string.quoted.backtick.arc'
            }
          },
          patterns: [
            {
              name: 'string.quoted.backtick.arc',
              match: group(lit`\\\``)
            },
            {
              name: 'invalid.illegal.arc',
              match: '`'
            },
          ]
        },

        // Unquoted (raw) strings
        {
          name: 'string.unquoted.arc',
          match: concat(
            precedingSpaceStartOrCapture,
            group(
              set(...ascii), oneOrMore
            ),
            proceedingSpaceCommentOrEnd
          )
        },
      ]
    },
  }
}

module.exports = syntax
