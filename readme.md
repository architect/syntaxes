<p align=center><img src="https://s3-us-west-2.amazonaws.com/arc.codes/architect-logo-500b@2x.png" width=500></p>

> Syntax definitions for highlighter extensions and other tools that display the Architect file format


## Build the syntax definitions

```bash
npm i && npm run build
```

This generates and writes versions to be consumed by Atom, Sublime Text, and VS Code:

- [JSON format](arc-textmate.json) - Used by Atom + VS Code
- [PLIST format](arc.tmLanguage) - Used by Sublime Text

Should any additional variations need to be built, create them here and pull them in as dependencies of the text editor extension in question.


## Notes / caveats

- The TextMate + Oniguruma grammar system does not enable conditional patterns, or expressions that can change state by matching across multiple lines
  - This poses some unique challenges for the Architect format, which is quite minimal, and uses significant whitespace
- Additionally, due to the way this system captures, liberal use of regex lookarounds is necessary to capture certain patterns in specific circumstances (e.g. inline arrays) without introducing weirdness or overlapping in capture groups
- Atom makes use of TextMate Grammars in both `cson` and `json` formats, but its settings file must be a `cson` file in the `settings` dir (e.g. `settings/arc.cson`)
- Sublime's language file must be `*.tmLanguage`, its settings must be `*.tmPreferences`, and both must be authored in `PLIST`
- VS Code accepts TextMate in `json` (with another preferences `json` file pointed to by `package.json`)

---

### Resources

#### Building TextMate grammars

- [The TextMate spec](https://macromates.com/manual/en/language_grammars)
- [Guide to writing a language grammar (TextMate) in Atom, by @Aerijo](https://gist.github.com/Aerijo/b8c82d647db783187804e86fa0a604a1)
- [Writing a TextMate Grammar: Some Lessons Learned, by Matt Neuburg](http://www.apeth.com/nonblog/stories/textmatebundle.html)
- [Annotated TextMate grammar boilerplate by @DamnedScholar](https://gist.github.com/DamnedScholar/622926bcd222eb1ddc483d12103fd315)
- [Atom: TextMate grammar examples](https://github.com/atom?q=language-)
- [Oniguruma regex syntax spec](https://macromates.com/manual/en/regular_expressions)
- [Atom: Creating a Legacy TextMate Grammar](https://flight-manual.atom.io/hacking-atom/sections/creating-a-legacy-textmate-grammar/)
