<p align=center><img src="https://s3-us-west-2.amazonaws.com/arc.codes/architect-logo-500b@2x.png" width=500></p>

> Grammars for syntax highlighter extensions and other tools that display the Architect file format


## Build the grammars

```bash
npm run build
```


## Notes / caveats

- The TextMate + Oniguruma grammar system does not enable conditional patterns, or expressions that can change state by matching across multiple lines
  - This poses some unique challenges for the Architect format, which is quite minimal, and uses significant whitespace
- Additionally, due to the way this system captures, liberal use of regex lookarounds is necessary to capture certain patterns in specific circumstances (e.g. inline arrays) without introducing weirdness or overlapping in capture groups


---

### Resources for building TextMate grammars

- [The TextMate spec](https://macromates.com/manual/en/language_grammars)
- [Guide to writing a language grammar (TextMate) in Atom, by @Aerijo](https://gist.github.com/Aerijo/b8c82d647db783187804e86fa0a604a1)
- [Writing a TextMate Grammar: Some Lessons Learned, by Matt Neuburg](http://www.apeth.com/nonblog/stories/textmatebundle.html)
- [Annotated TextMate grammar boilerplate by @DamnedScholar](https://gist.github.com/DamnedScholar/622926bcd222eb1ddc483d12103fd315)
- [Atom: TextMate grammar examples](https://github.com/atom?q=language-)
- [Oniguruma regex syntax spec](https://macromates.com/manual/en/regular_expressions)
- [Atom: Creating a Legacy TextMate Grammar](https://flight-manual.atom.io/hacking-atom/sections/creating-a-legacy-textmate-grammar/)
