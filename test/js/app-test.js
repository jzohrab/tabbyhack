const { join } = require('path')
const test = require('tape')

const js = join(process.cwd(), 'src', 'js')
const { Application } = require(join(js, 'app.js'))

const Ehz = 329.63
const Bhz = 246.94
const Ghz = 196.00

/* Instance we're testing. */
let app = null

test('add_frequency adds a note', t => {
  app = new Application()
  t.equal(app.line.length, 0)
  app.add_frequency(Ehz)
  t.equal(app.line.length, 1)
  t.end()
})

test('add_frequency adds some note data', t => {
  app = new Application()
  app.add_frequency(Ehz)
  const n = app.line[0]
  t.equal(n.frequency, Ehz)
  t.equal(n.name, "E")
  t.equal(n.octave, 5, "octave")
  t.end()
})

test('add_frequency adds fret candidates to note', t => {
  app = new Application({min: 0, max: 24})
  app.add_frequency(Ehz)
  const n = app.line[0]
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
  app = new Application({ min: 0, max: 24})
  app.add_frequency(Bhz)
  const n = app.line[0]
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
  app = new Application({ min: 4, max: 12 })
  app.add_frequency(Bhz)
  const n = app.line[0]
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

test('can generate vextab', t => {
  app = new Application()
  app.add_frequency(Bhz)
  const n = app.line[0]
  t.equal(app.vextab(), ':q B/4', 'B 4th octave')
  n.string = 1
  t.equal(app.vextab(), ':q 0/2', 'B on 2nd string (strings indexed from 0 in code)')
  t.equal(app.vextab('tabstave notation=true'), 'tabstave notation=true\nnotes :q 0/2', 'can add header, notes is added automagically')
  t.end()
})

test('can specify vextab options', t => {
  app = new Application( { vextabopts: 'blah' } )
  app.add_frequency(Bhz)
  const n = app.line[0]
  n.string = 1
  t.equal(app.vextab('tabstave notation=true'), 'tabstave notation=true blah\nnotes :q 0/2')
  t.end()
})

test('no notes = empty stave', t => {
  app = new Application()
  t.equal(app.vextab('tabstave notation=true'), 'tabstave notation=true')
  t.end()
})

test('can generate multiple staves of vextab', t => {
  app = new Application()
  app.add_frequency(Bhz)
  app.add_frequency(Bhz)
  app.add_frequency(Ehz)
  app.add_frequency(Ehz)
  const [ n1, n2, n3, n4 ] = app.line
  n1.string = 2
  n2.string = 2
  n3.string = 0
  n4.string = 0
  app.toggleChord(2)

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
  app = new Application()
  app.add_frequency(Bhz)
  app.add_frequency(Ehz)
  t.equal(app.vextab(), ':q B/4 E/5', 'melody')
  app.line[0].string = 2
  app.line[1].string = 0
  app.toggleChord(1)
  t.equal(app.vextab(), ':q (4/3.0/1)', 'chord: B on 2nd string, E on 1st')
  t.end()
})

test('vextab can handle note timings', t => {
  app = new Application()
  app.add_frequency(Bhz)
  app.add_frequency(Ehz)
  t.equal(app.vextab(), ':q B/4 E/5', 'melody')
  app.line[0].string = 2
  app.line[1].string = 0
  app.line[1].duration = '16'
  t.equal(app.vextab(), ':q 4/3 :16 0/1')
  t.end()
})

test('app has cursor for current edit position', t => {
  app = new Application()
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

  app.line[0].string = 2
  app.line[1].string = 2
  app.line[2].string = 0
  app.toggleChord(2)
  app.cursor = 1
  t.equal(app.vextab(), ':q 4/3 (4/3.0/1) HERE', 'note and chord')

  t.end()
})

function appWithFreqs(...freqs) {
  app = new Application()
  freqs.forEach(f => app.add_frequency(f))
  return app
}

function getAppLine(line = app.line) {
  const ret = []
  for (var i = 0; i < line.length; i++) {
    const e = line[i]
    if (e instanceof Array) {
      ret.push(e.map(n => n.frequency))
    }
    else {
      ret.push(e.frequency)
    }
  }
  return ret
}

function assertAppLineEquals(t, expected, msg = '') {
  const actual = getAppLine()
  t.deepEqual(actual, expected, msg)
}

test('cannot toggle a note into a chord until it has been assigned a string', t => {
  app = appWithFreqs(Bhz, Ehz)
  t.equal(2, app.line.length, 'sanity check')
  t.throws(() => { app.toggleChord(1) }, /must assign string/, 'Must assign a string to a note.')
  t.end()
})

test('can toggle chord for note', t => {
  app = appWithFreqs(Bhz, Ehz)
  t.equal(2, app.line.length, 'sanity check')
  assertAppLineEquals(t, [ Bhz, Ehz ], 'ungrouped')
  app.line[0].string = 1
  app.line[1].string = 0
  app.toggleChord(1)
  assertAppLineEquals(t, [ [ Bhz, Ehz ] ], 'grouped')
  t.end()
})


test('toggling appends notes to existing chord', t => {
  // open strings
  app = appWithFreqs(Ghz, Bhz, Ehz, Bhz, Ghz)
  strings = [2,1,0,1,2]
  for (var i = 0; i < strings.length; i++) {
    app.line[i].string = strings[i]
  }

  assertAppLineEquals(t, [ Ghz, Bhz, Ehz, Bhz, Ghz ], 'ungrouped')
  app.toggleChord(1)
  assertAppLineEquals(t, [ [ Ghz, Bhz ], Ehz, Bhz, Ghz ], 'chord 1')
  app.toggleChord(1)
  assertAppLineEquals(t, [ [ Ghz, Bhz, Ehz ], Bhz, Ghz ], 'chord increased')
  t.end()
})

// Need strings for all notes to ensure no clashes.
test('prior note must also have a string', t => {
  app = appWithFreqs(Bhz, Ehz)
  app.line[1].string = 0
  t.throws(() => { app.toggleChord(1) }, /prior note must have string assigned/)
  t.end()
})

test('cant make very first note a chord', t => {
  app = appWithFreqs(Bhz, Ehz)
  app.line[0].string = 1
  t.throws(() => { app.toggleChord(0) }, /first note cannot be a chord tone/)
  t.end()
})

test('toggle chord on chord explodes it', t => {
  app = appWithFreqs(Ghz, Bhz, Ehz)
  strings = [2,1,0]
  for (var i = 0; i < strings.length; i++) {
    app.line[i].string = strings[i]
  }

  assertAppLineEquals(t, [ Ghz, Bhz, Ehz ], 'ungrouped')
  app.toggleChord(1)
  assertAppLineEquals(t, [ [ Ghz, Bhz ], Ehz ], 'chorded')
  app.toggleChord(0)
  assertAppLineEquals(t, [ Ghz, Bhz, Ehz ], 'chord exploded')
  t.end()
})

test('all notes in chord must be unique strings', t => {
  app = appWithFreqs(Ghz, Bhz, Ehz)
  app.line[0].string = 2
  app.line[1].string = 2
  app.line[2].string = 2

  assertAppLineEquals(t, [ Ghz, Bhz, Ehz ], 'ungrouped')

  t.throws(() => { app.toggleChord(1) }, /string 3 already used/)

  app.line[1].string = 1
  app.toggleChord(1)
  assertAppLineEquals(t, [ [ Ghz, Bhz ], Ehz ], 'chorded')

  t.throws(() => { app.toggleChord(1) }, /string 3 already used/)

  app.line[1].string = 0
  app.toggleChord(1)
  assertAppLineEquals(t, [ [ Ghz, Bhz, Ehz ] ], 'all chorded')
  
  t.end()
})


test('deletion', t => {
  app = appWithFreqs(Ghz, Bhz, Ehz, Ghz, Bhz)
  strings = [2,1,0, 2, 1]
  for (var i = 0; i < strings.length; i++) {
    app.line[i].string = strings[i]
  }

  app.toggleChord(1)
  assertAppLineEquals(t, [ [ Ghz, Bhz ], Ehz, Ghz, Bhz ], 'chorded')

  app.deleteAt(0)
  assertAppLineEquals(t, [ Ehz, Ghz, Bhz ], 'chord deleted')

  app.deleteAt(1)
  assertAppLineEquals(t, [ Ehz, Bhz ], 'g gone')

  app.deleteAt(1)
  assertAppLineEquals(t, [ Ehz ], 'b gone')

  app.deleteAt(0)
  assertAppLineEquals(t, [ ], 'empty')
  t.end()
})


test('setting duration on note', t => {
  app = appWithFreqs(Ghz, Bhz)
  app.setDuration(0, '32')
  t.equal(app.line[0].duration, '32')
  t.equal(app.line[1].duration, null, 'implicit')
  t.end()
})

test('setting duration on chord', t => {
  app = appWithFreqs(Ghz, Bhz, Ehz, Ghz, Bhz)
  strings = [2,1,0, 2, 1]
  for (var i = 0; i < strings.length; i++) {
    app.line[i].string = strings[i]
  }

  app.toggleChord(2)
  assertAppLineEquals(t, [ Ghz, [ Bhz, Ehz ], Ghz, Bhz ], 'chorded')

  app.setDuration(1, '32')

  t.equal(app.notes()[0].duration, 'q', 'default q')
  t.equal(app.notes()[1].duration, '32', 'first note in chord')

  const n2 = app.notes()[2]
  t.equal(n2.frequency, Ehz, 'sanity check')
  t.equal(n2.duration, null, 'second note in chord does not get duration')
  t.end()
})


test('duration moves to next note if first is deleted', t => {
  app = appWithFreqs(Ghz, Bhz)
  app.setDuration(0, '32')
  t.equal(app.line[0].duration, '32')
  t.equal(app.line[1].duration, null, 'implicit')

  app.deleteAt(0)
  t.equal(app.line[0].frequency, Bhz, 'sanity check')
  t.equal(app.line[0].duration, '32')
  t.end()
})


test('noteAt', t => {
  app = appWithFreqs(Ghz, Bhz, Ehz, Ghz)
  strings = [2,1,0,2]
  for (var i = 0; i < strings.length; i++) {
    app.line[i].string = strings[i]
  }

  app.toggleChord(2)
  assertAppLineEquals(t, [ Ghz, [ Bhz, Ehz ], Ghz ], 'chorded')

  t.equal(app.noteAt(0).frequency, Ghz, 'first')
  t.equal(app.noteAt(1).frequency, Bhz, 'first note of chord')
  t.equal(app.noteAt(2).frequency, Ghz, 'Last note')
  t.end()
})


test('editorwindow', t => {
  app = appWithFreqs(Ghz, Bhz, Ehz, Ghz, Bhz)
  strings = [2,1,0,2,2]
  for (var i = 0; i < strings.length; i++) {
    app.line[i].string = strings[i]
  }
  app.toggleChord(2)

  const fullLine = [ Ghz, [ Bhz, Ehz ], Ghz, Bhz ]
  assertAppLineEquals(t, fullLine, 'sanity check')

  function assertWindow(pos, width, expLine, expBefore, expAfter, expStartIndex, expEndIndex) {
    const msg = `${pos}, ${width} `
    const w = app.editorWindow(pos, width)
    t.deepEqual(getAppLine(w.line), expLine, msg + 'line')
    t.equal(w.before, expBefore, msg + 'before window')
    t.equal(w.after, expAfter, msg + 'after window')
    t.equal(w.startIndex, expStartIndex, msg + 'start index')
    t.equal(w.endIndex, expEndIndex, msg + 'end index')
  }

  assertWindow(2, 2, fullLine, 0, 0, 0, fullLine.length)
  assertWindow(2, 1, [ [ Bhz, Ehz ], Ghz, Bhz ], 1, 0, 1, 4)
  assertWindow(0, 2, [ Ghz, [ Bhz, Ehz ], Ghz ], 0, 1, 0, 3)
  assertWindow(5, 2, [ [ Bhz, Ehz ], Ghz, Bhz ], 1, 0, 1, 4)
  assertWindow(2, 20, fullLine, 0, 0, 0, 4)
  assertWindow(3, 2, [ [ Bhz, Ehz ], Ghz, Bhz ], 1, 0, 1, 4)

  // Edge cases for fun.
  for (var i = 0; i < fullLine.length; i++) {
    assertWindow(i, 0, [ fullLine[i] ], i, fullLine.length - (i + 1), i, i + 1)
  }
  
  t.end()
})


test('window indices', t => {
  app = new Application()

  // Sanity check, 10 items, width = 1
  for (var i = 0; i < 10; i++) {
    const r = app.editorWindowIndices(10, i, 1)
    const e = [ i, i + 1 ]
    t.equal(e[0], r.start, `${i}: ${e} start, got ${r.start}`)
    t.equal(e[1], r.end, `${i}: ${e} end, got ${r.end}`)
  }
  
  // 10 items, width = 7
  const expected = {
    0: [0, 7],   // |x . . . . . .|- - -
    1: [0, 7],   // |. x . . . . .|- - -
    2: [0, 7],   // |. . x . . . .|- - -
    3: [0, 7],   // |. . . x . . .|- - -
    4: [1, 8],   //  -|. . . x . . .|- -
    5: [2, 9],   //  - -|. . . x . . .|-
    6: [3, 10],  //  - - -|. . . x . . .|
    7: [3, 10],  //  - - -|. . . . x . .|
    8: [3, 10],  //  - - -|. . . . . x .|
    9: [3, 10],  //  - - -|. . . . . . x|
  }
  for (var i = 0; i < 10; i++) {
    const r = app.editorWindowIndices(10, i, 7)
    const e = expected[`${i}`]
    t.equal(e[0], r.start, `${i}: ${e} start, got ${r.start}`)
    t.equal(e[1], r.end, `${i}: ${e} end, got ${r.end}`)
  }
  t.end()
})

/*
Future tests

- generate ascii tab from line
- Setting time
  - Uses the duration of most recently specified note
  - If note has same duration as previous note, the duration is removed, because it’s implicit
 */
