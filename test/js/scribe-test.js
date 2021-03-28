const { join } = require('path')
const test = require('tape')

const js = join(process.cwd(), 'src', 'js')
const { Scribe } = require(join(js, 'scribe.js'))
const { GuitarString } = require(join(js, 'GuitarString.js'))

test('single open string', t => {
  const b = new GuitarString('b', 246.94)
  const scribeOpts = {
    strings: [b]
  }
  const scribe = new Scribe(scribeOpts)
  const actual = scribe.tab([246.94])
  const expected = "-0-"
  t.equal(actual, expected)
  t.end()
})


/* TESTS

frequencies:
  t.equal(0, b.getFret(246.94), 'open string')
  t.equal(5, b.getFret(329.63), 'E = b string, 5th fret')
  t.equal(12, b.getFret(246.94 * 2), 'octave')

single string:
multiple notes
< 0 ignored
> max ignored
ignored puts a blank in the tab
same note repeated
notes at or above 10th fret

multiple strings
multiple notes
< 0 ignored
> max ignored
ignored puts a blank in the tab
same note repeated
notes at or above 10th fret
*/
