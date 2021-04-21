const { join } = require('path')
const test = require('tape')

const js = join(process.cwd(), 'src', 'js')
const { Note } = require(join(js, 'note.js'))

const Ehz = 329.63
const Bhz = 246.94
const Ghz = 196.00

/* Instance we're testing. */
let note = null


test('constructor adds some note data', t => {
  note = new Note(Ehz)
  t.equal(note.frequency, Ehz)
  t.equal(note.name, "E")
  t.equal(note.octave, 5, "octave")
  t.deepEqual(note.frets, {}, "no frets")
  console.log(note.vextab())
  t.end()
})


test('can generate vextab', t => {
  note = new Note(Ehz)
  t.equal(note.vextab(), 'E/5')
  note.string = 1
  t.equal(note.vextab(), 'E/5', 'no frets set')
  note.frets = { 0: 0, 1: 5 }
  t.equal(note.vextab(), '5/2', 'fret/string')
  t.end()
})
