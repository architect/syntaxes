/* eslint-disable indent */
// REMINDER: when editing and improving this syntax definition, don't forget to update the others in ./src!
let {
  alphaLow, alphaUp, anyNonWhitespace, anyWhitespace, captureGroupStart, concat, end, greedy,
  group, lit, negSet, newline, oneOrMore, optional, or, posLookahead,
  posLookbehind, set, space, start, tab, zeroOrMore, zeroToNine
} = require('./_regex')

// These two allow us to capture clean tokens as we work through lines of potentially many words
let precedingSpaceStartOrCapture = posLookbehind(anyWhitespace, or, start, or, captureGroupStart)
let proceedingSpaceCommentOrEnd = posLookahead(anyWhitespace, or, '#', or, end)

// Comments
let commentStart = concat(
  '#',
  greedy,
  end,
)

// Booleans
let booleans = {
  scope: 'literal',
  begin: concat(precedingSpaceStartOrCapture, group('true', or, 'false')),
  end: proceedingSpaceCommentOrEnd,
}

// Numbers
let numbers = {
  scope: 'number',
  begin: concat(
      precedingSpaceStartOrCapture,
      group(
        // Optional leading number with decimal
        group(lit`d`, zeroOrMore, set('.')), optional,
        // Int or decimal places
        lit`d`, oneOrMore,
      ),
      proceedingSpaceCommentOrEnd
  ),
  end: proceedingSpaceCommentOrEnd,
}

// Strings
let doubleQuotedStrings = {
  scope: 'string',
  begin: concat(precedingSpaceStartOrCapture, group('"')),
  end: concat(group('"')),
  contains: [ { begin: lit`\\"` } ]
}
let singleQuotedStrings = {
  scope: 'string',
  begin: concat(precedingSpaceStartOrCapture, group("'")),
  end: concat(group("'")),
  contains: [ { begin: lit`\\'` } ]
}
let backtickQuotedStrings = {
  scope: 'string',
  begin: concat(precedingSpaceStartOrCapture, group('`')),
  end: concat(group('`')),
  contains: [ { begin: lit`\\\`` } ]
}
let string = {
  scope: 'string'
}

// Pragmas
let pragmas = {
  scope: 'title.function',
  begin: concat(start, '@', set(alphaLow, alphaUp, zeroToNine, '-', '_'), oneOrMore),
  end: proceedingSpaceCommentOrEnd
}

// Map + Vector names
let mapVectorName = {
  scope: 'keyword',
  begin: concat(
    posLookbehind(start),
    group(anyNonWhitespace, oneOrMore),
    proceedingSpaceCommentOrEnd,
    // We've found what we're looking for if we don't hit a break or non-comment
    // Unfortunately this implementation contains a bug that captures a map / vector name if followed by a non-comment word
    posLookahead(
      // Look out for comments
      '#', optional, negSet(newline), zeroOrMore,
      // Advance to the next line
      set(newline),
      group(
        start,
        set(tab, space), '{2}',
        anyNonWhitespace
      ),
    )
  ),
  end: anyWhitespace
}

// Properties in maps, as defined by two spaces / tabs followed by multiple words
let mapProperties = {
  scope: 'property',
  begin: concat(
    group(
      start,
      set(tab, space), '{2}',
      negSet('#', newline, tab, space), oneOrMore
    ),
    // Must be followed by a second word
    posLookahead(
      set(tab, space), oneOrMore,
      negSet('#', newline, tab, space), oneOrMore,
      proceedingSpaceCommentOrEnd
    )
  ),
  end: set(tab, space)
}

function index (hljs) {
  return {
    aliases: [ 'arc', 'architect' ],
    case_insensitive: true,
    contains: [
      booleans,
      numbers,
      doubleQuotedStrings,
      singleQuotedStrings,
      backtickQuotedStrings,
      pragmas,
      hljs.COMMENT(commentStart),
      // Map / vector stuff goes after comments to ensure clean inline captures
      mapVectorName,
      mapProperties,
      string, // String needs to be last, as anything not matched falls through to it
    ]
  }
}

module.exports = {
  index,
  props: {
    commentStart,
    booleans,
    numbers,
    doubleQuotedStrings,
    singleQuotedStrings,
    backtickQuotedStrings,
    pragmas,
    mapVectorName,
    mapProperties,
    string,
  }
}
