const { join } = require('path')
const test = require('tape')

const js = join(process.cwd(), 'src', 'js')
const { VextabScribe } = require(join(js, 'vextabscribe.js'))

test('single open string', t => {
  const scribe = new VextabScribe()
  t.equal(scribe.tab([ { '0': 0 } ]), "0/1")
  t.end()
})

test('single string multiple notes', t => {
  const scribe = new VextabScribe()
  const actual = scribe.tab([ { '0': 0 }, {0: 5}, {0: 12} ])
  const expected = "0/1 5/1 12/1"
  t.equal(actual, expected)
  t.end()
})

test('null tabbed as X (dummy note)', t => {
  const scribe = new VextabScribe()
  const expected = "0/1 5/1 X/1 12/1"
  t.equal(scribe.tab([{0: 0}, {0: 5}, {0: null}, {0: 12}]), expected)
  t.end()
})

test('undefined fret skipped', t => {
  const scribe = new VextabScribe()
  const expected = "0/1 5/1 12/1"
  t.equal(scribe.tab([{0: 0}, {0: 5}, {0: undefined}, {0: 12}]), expected)
  t.end()
})


test('chords', t => {
  const scribe = new VextabScribe()
  const actual = scribe.tab([{1: 0}, {0: 0, 1: 0}, {0: 7, 1: 12}, {1: 5}])
  const expected = "0/2 (0/1.0/2) (7/1.12/2) 5/2"
  t.equal(actual, expected)
  t.end()
})

test('chord null notes are X', t => {
  const scribe = new VextabScribe()
  const actual = scribe.tab([{1: 0}, {0: null, 1: 0}, {0: 7, 1: 12}, {1: 5}])
  const expected = "0/2 (X/1.0/2) (7/1.12/2) 5/2"
  t.equal(actual, expected)
  t.end()
})
