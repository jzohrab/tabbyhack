const { join } = require('path')
const test = require('tape')

const js = join(process.cwd(), 'src', 'js')
const { Application } = require(join(js, 'app.js'))

const Ehz = 329.63
const Bhz = 246.94

test('add_frequency adds a note', t => {
  const app = new Application()
  t.equal(app.notes.length, 0)
  app.add_frequency(Ehz)
  t.equal(app.notes.length, 1)
  t.end()
})

test('add_frequency adds some note data', t => {
  const app = new Application()
  app.add_frequency(Ehz)
  const n = app.notes[0]
  t.equal(n.frequency, Ehz)
  t.equal(n.name, "E")
  t.equal(n.octave, 4, "octave")
  t.end()
})

test('add_frequency adds fret candidates to note', t => {
  const app = new Application({min: 0, max: 24})
  app.add_frequency(Ehz)
  const n = app.notes[0]
  const hsh = n.frets
  t.ok(hsh, 'have frets')
  const expected = {
    0: 0,
    1: 5,
    2: 9,
    3: 14,
    4: 19,
    5: 24
  }
  t.deepEqual(hsh, expected)
  t.end()
})


test('add_frequency only returns valid frets', t => {
  const app = new Application({ min: 0, max: 24})
  app.add_frequency(Bhz)
  const n = app.notes[0]
  const hsh = n.frets
  const expected = {
    1: 0,
    2: 4,
    3: 9,
    4: 14,
    5: 19
  }
  t.deepEqual(hsh, expected)
  t.end()
})

test('add_frequency: frets out of range arent included', t => {
  const app = new Application({ min: 4, max: 12 })
  app.add_frequency(Bhz)
  const n = app.notes[0]
  const hsh = n.frets
  const expected = {
    // 1: 0,
    2: 4,
    3: 9,
    // 4: 14,
    // 5: 19
  }
  t.deepEqual(hsh, expected)
  t.end()
})

test('can generate vextab from notes', t => {
  const app = new Application()
  app.add_frequency(Bhz)
  const n = app.notes[0]
  t.equal(app.vextab(), ':q B/3', 'B 3rd octave')
  n.tab = { string: 1, type: 'tone' }
  t.equal(app.vextab(), ':q 0/2', 'B on 2nd string (strings indexed from 0 in code)')
  t.end()
})

test('vextab can handle chords from notes', t => {
  const app = new Application()
  app.add_frequency(Bhz)
  app.add_frequency(Ehz)
  t.equal(app.vextab(), ':q B/3 E/4', 'melody')
  app.notes[0].tab = { string: 2, type: 'tone' }
  app.notes[1].tab = { string: 0, type: 'chord' }
  t.equal(app.vextab(), ':q (4/3.0/1)', 'chord: B on 2nd string, E on 1st')
  t.end()
})

test('vextab can handle note timings', t => {
  const app = new Application()
  app.add_frequency(Bhz)
  app.add_frequency(Ehz)
  t.equal(app.vextab(), ':q B/3 E/4', 'melody')
  app.notes[0].tab = { string: 2, type: 'tone' }
  app.notes[1].tab = { string: 0, type: 'tone' }
  app.notes[1].duration = '16'
  t.equal(app.vextab(), ':q 4/3 :16 0/1')
  t.end()
})

/*
test('app has cursor for current edit position', t => {
  const app = new Application()
  app.add_frequency(Bhz)
  app.add_frequency(Bhz)
  app.add_frequency(Ehz)
  t.equal(app.vextab(), ':q B/3 B/3 E/4', 'initial melody')
  app.cursorIndicator = 'HERE'
  app.cursor = 0
  t.equal(app.vextab(), ':q B/3 HERE B/3 E/4', 'cursor indicated')
  app.cursor = 0
  t.equal(app.vextab(), ':q B/3 B/3 HERE E/4', 'next note')
  app.cursor = null
  t.equal(app.vextab(), ':q B/3 B/3 E/4', 'no cursor')
  app.cursor = 42
  t.equal(app.vextab(), ':q B/3 B/3 E/4', 'cursor out of bounds')
  // cursor with chord
  t.end()
})
*/

// next tests:
// 1st note can't be a chord
// add cursor indicator for vextab output - eg - notes :q 1/2 7/3 6/3 F#/5 HERE E/5
// duration chords - is for first note
// duration changes for notes pulled into chord

/*
// Useful frequencies (open strings)

const b = new GuitarString('b', Bhz)
const e = new GuitarString('e', Ehz)

test('single string multiple notes', t => {
  const rawtab = new Rawtab([b])
  const actual = rawtab.tab([Bhz, Ehz, Bhz * 2])
  const expected = [[0], [5], [12]]
  t.deepEqual(actual, expected)
  t.end()
})

test('multistring open string', t => {
  const rawtab = new Rawtab([e, b])
  const actual = rawtab.tab([Bhz, Ehz])
  const expected = [
    [null, 0], [0, 5]
  ]
  t.deepEqual(actual, expected)
  t.end()
})

test('multistring above 10th fret', t => {
  const rawtab = new Rawtab([e, b])
  const actual = rawtab.tab([Bhz, Ehz, Bhz * 2, Ehz])
  const expected = [
    [null, 0],
    [0, 5],
    [7, 12],
    [0, 5]
  ]
  t.deepEqual(actual, expected)
  t.end()
})

test('multistring ignored notes arent tabbed', t => {
  const rawtab = new Rawtab([e, b], { min: 4, max: 12 } )
  const actual = rawtab.tab([Bhz, Ehz, Bhz * 2, Bhz / 2, Ehz * 2])
  const expected = [
    [null, null],
    [null, 5],
    [7, 12],
    [null, null],
    [12, null]
  ]
  t.deepEqual(actual, expected)
  t.end()
})

test('multistring out of range notes yields blank tab', t => {
  const rawtab = new Rawtab([e, b], { min: 4, max: 12 } )
  const actual = rawtab.tab([Ehz * 8, Bhz * 8, Bhz / 2, Ehz * 8])
  const expected = [
    [null, null],
    [null, null],
    [null, null],
    [null, null]
  ]
  t.deepEqual(actual, expected)
  t.end()
})
*/