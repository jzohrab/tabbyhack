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
  t.equal(n.octave, 5, "octave")
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
  t.equal(app.vextab(), ':q B/4', 'B 4th octave')
  n.tab = { string: 1, type: 'tone' }
  t.equal(app.vextab(), ':q 0/2', 'B on 2nd string (strings indexed from 0 in code)')
  t.equal(app.vextab('tabstave notation=true'), 'tabstave notation=true\nnotes :q 0/2', 'can add header, notes is added automagically')
  t.end()
})

test('can specify vextab options', t => {
  const app = new Application( { vextabopts: 'blah' } )
  app.add_frequency(Bhz)
  const n = app.notes[0]
  n.tab = { string: 1, type: 'tone' }
  t.equal(app.vextab('tabstave notation=true'), 'tabstave notation=true blah\nnotes :q 0/2')
  t.end()
})

test('no notes = empty stave', t => {
  const app = new Application()
  t.equal(app.vextab('tabstave notation=true'), 'tabstave notation=true')
  t.end()
})

test('can generate multiple staves of vextab', t => {
  const app = new Application()
  app.add_frequency(Bhz)
  app.add_frequency(Bhz)
  app.add_frequency(Ehz)
  app.add_frequency(Ehz)
  const [ n1, n2, n3, n4 ] = app.notes
  n1.tab = { string: 2, type: 'tone' }
  n2.tab = { string: 2, type: 'tone' }
  n3.tab = { string: 0, type: 'chord' }
  n4.tab = { string: 0, type: 'tone' }

  const expected = `tabstave notation=true
notes :q 4/3

tabstave notation=true
notes (4/3.0/1)

tabstave notation=true
notes 0/1`

  t.equal(app.vextab('tabstave notation=true', { stafflength: 1 }), expected, '3 staves generated')
  t.end()
})


test('vextab can handle chords from notes', t => {
  const app = new Application()
  app.add_frequency(Bhz)
  app.add_frequency(Ehz)
  t.equal(app.vextab(), ':q B/4 E/5', 'melody')
  app.notes[0].tab = { string: 2, type: 'tone' }
  app.notes[1].tab = { string: 0, type: 'chord' }
  t.equal(app.vextab(), ':q (4/3.0/1)', 'chord: B on 2nd string, E on 1st')
  t.end()
})

test('vextab can handle note timings', t => {
  const app = new Application()
  app.add_frequency(Bhz)
  app.add_frequency(Ehz)
  t.equal(app.vextab(), ':q B/4 E/5', 'melody')
  app.notes[0].tab = { string: 2, type: 'tone' }
  app.notes[1].tab = { string: 0, type: 'tone' }
  app.notes[1].duration = '16'
  t.equal(app.vextab(), ':q 4/3 :16 0/1')
  t.end()
})

test('scorenotes', t => {
  const app = new Application()
  app.add_frequency(Bhz)
  app.add_frequency(Bhz)
  app.add_frequency(Ehz)
  app.add_frequency(Ehz)
  const [ n1, n2, n3, n4 ] = app.notes
  n1.tab = { string: 2, type: 'tone' }
  n2.tab = { string: 2, type: 'tone' }
  n3.tab = { string: 0, type: 'chord' }
  n4.tab = { string: 0, type: 'tone' }
  t.equal(app.vextab(), ':q 4/3 (4/3.0/1) 0/1', 'sanity check')
  sn = app.scorenotes()
  expected = [ n1, [ n2, n3 ], n4 ]
  t.deepEqual(sn, expected)
  t.end()
})

test('app has cursor based off of scorenotes for current edit position', t => {
  const app = new Application()
  app.add_frequency(Bhz)
  app.add_frequency(Bhz)
  app.add_frequency(Ehz)
  t.equal(app.vextab(), ':q B/4 B/4 E/5', 'initial melody')
  app.cursorIndicator = 'HERE'
  app.cursor = 0
  t.equal(app.vextab(), ':q B/4 HERE B/4 E/5', 'cursor indicated')
  app.cursor = 1
  t.equal(app.vextab(), ':q B/4 B/4 HERE E/5', 'next note')
  app.cursor = null
  t.equal(app.vextab(), ':q B/4 B/4 E/5', 'no cursor')
  app.cursor = 42
  t.equal(app.vextab(), ':q B/4 B/4 E/5', 'cursor out of bounds')

  app.notes[0].tab = { string: 2, type: 'tone' }
  app.notes[1].tab = { string: 2, type: 'tone' }
  app.notes[2].tab = { string: 0, type: 'chord' }
  app.cursor = 1
  t.equal(app.vextab(), ':q 4/3 (4/3.0/1) HERE', 'note and chord')

  t.end()
})

test('blah', t => {
  t.skip('aoeu')
  t.end()
})


/*

TODO Tabbyhack tests

Toggle chord

1st note can't be a chord
If currently on cord, sets all notes to tone, app cursor stays the same, note cursor points at the first note.
If note, and cord already contains note on string, does nothing, or raises error
if last note, app cursor points at cord
If not last note, app cursor stays the same


Deletion

If chord, all notes are deleted, and app cursor is on the next note
If last cord, or is last note, app cursor is at the last note
If not last note or not last cord app cursor stays the same
If first note or first cord, second is first
If no cursor does nothing
If no notes does nothing

Setting time

F chord, only the duration of the first note is set
If note duration is set
Uses the duration of most recently specified note
If note has same duration as previous note, the duration is removed, because it’s implicit

 */
