const { join } = require('path')
const test = require('tape')

const f = join(process.cwd(), 'src', 'js', 'guitarstring.js')
const { GuitarString } = require(f)

test('getFret', t => {
  b = new GuitarString('b', 246.94)
  t.equal(0, b.getFret(246.94), 'open string')
  t.equal(5, b.getFret(329.63), 'E = b string, 5th fret')
  t.equal(12, b.getFret(246.94 * 2), 'octave')
  t.end()
})
