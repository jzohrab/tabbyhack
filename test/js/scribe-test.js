const { join } = require('path')
const test = require('tape')

const js = join(process.cwd(), 'src', 'js')
const { Scribe } = require(join(js, 'scribe.js'))
const { GuitarString } = require(join(js, 'GuitarString.js'))

// Useful frequencies (open strings)
const Bhz = 246.94
const Ehz = 329.63

const b = new GuitarString('b', Bhz)

test('single open string', t => {
  const scribe = new Scribe([b])
  const actual = scribe.tab([Bhz])
  const expected = "-0-"
  t.equal(actual, expected)
  t.end()
})

test('single string multiple notes', t => {
  const scribe = new Scribe([b])
  const actual = scribe.tab([Bhz, Ehz, Bhz * 2])
  const expected = "-0-5-12-"
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
out of range for all strings (less than 0)
*/
