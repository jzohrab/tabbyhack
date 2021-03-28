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
  t.equal(scribe.tab([Bhz]), "-0-")
  t.end()
})

test('single string multiple notes', t => {
  const scribe = new Scribe([b])
  const actual = scribe.tab([Bhz, Ehz, Bhz * 2])
  const expected = "-0-5-12-"
  t.equal(actual, expected)
  t.end()
})

test('fret less than 0 ignored', t => {
  const scribe = new Scribe([b])
  t.equal(scribe.tab([Bhz-100]), "---")
  t.end()
})

test('fret can be very large if no max fret specified', t => {
  const scribe = new Scribe([b])
  t.equal(scribe.tab([Bhz * 16]), "-48-")
  t.end()
})

test('fret greater than max ignored', t => {
  const scribe = new Scribe([b], { max: 12 } )
  t.equal(scribe.tab([Bhz, Ehz, Ehz * 2, Bhz * 2]), "-0-5---12-")
  t.end()
})

/* TESTS

single string:
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
