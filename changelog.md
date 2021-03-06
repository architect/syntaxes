# Architect syntax definitions

---

## [1.2.0 - 1.2.1] 2021-11-01

### Added

- Added Highlight.js grammar

---

## [1.1.0] 2021-10-28

### Added

- Added JSON schema


### Changed

- Un-relax pragma validation (which, for Architect projects, should be `^@[a-zA-Z0-9-_]+`)

---

## [1.0.1] 2021-09-12

### Added

- Added invalid character flags when unescaped quotes are found inside a quoted string
- Added tests via `vscode-tmgrammar-test`


### Fixed

- Fixed scalar strings that included quotes (e.g. `h'e'l'l'o`)
- Fixed issue where vectors can't have spaces immediately following value (e.g. `vectorName\n  hi# comment`)
- Fixed issue where maps don't detect comments if a `#` is within a property
- Fixed issue where map values were only properly detected by a single space following the property, even though many are allowed

---

## [1.0.0] 2021-09-06

This syntax definition was extracted from [@ryanblock/architect-vscode-grammar-extension](https://github.com/ryanblock/architect-vscode-grammar-extension), which has been chugging along for almost exactly two years.

We've finally brought it home to @architect, given it a full rewrite, fixed a bunch of bugs, and prepared for release to some new places!


### Added

- Added support for double, single, and backtick quoted strings
  - Quoted strings are now supported as scalar strings, array values, vector names + values, and map names + values
  - Quoted strings also support linebreaks
  - Additionally, quoted strings support escaped string chars (`"They said, \"Hi.\""`)
  - Finally, quoted strings can support unicode!


### Changed

- Internal: renamed `sections` to `pragmas`


### Fixed

- Fixed bug with scalar numbers' decimals capturing into the next line
- Fixed bug with misdetection of strings of numbers with multiple decimals
- Fixed bug where scalar strings would not capture if immediately followed by a comment (e.g. `string#comment`)
- Fixed bug where numbers were not capturing in arrays
- Fixed bug where arrays in maps weren't captured properly
- Fixed bug where arrays in maps weren't detecting tabs
