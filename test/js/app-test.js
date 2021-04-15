const { join } = require('path')
const test = require('tape')

const js = join(process.cwd(), 'src', 'js')
const { Application } = require(join(js, 'app.js'))

const Ehz = 329.63

test('add_frequency adds a note', t => {
  const app = new Application()
  t.equal(app.notes.length, 0)
  app.add_frequency(Ehz)
  t.equal(app.notes.length, 1)
  t.end()
})

/*
// Useful frequencies (open strings)
const Bhz = 246.94

const b = new GuitarString('b', Bhz)
const e = new GuitarString('e', Ehz)

test('single open string', t => {
  const rawtab = new Rawtab([b])
  t.deepEqual(rawtab.tab([Bhz]), [[0]])
  t.end()
})

test('single string multiple notes', t => {
  const rawtab = new Rawtab([b])
  const actual = rawtab.tab([Bhz, Ehz, Bhz * 2])
  const expected = [[0], [5], [12]]
  t.deepEqual(actual, expected)
  t.end()
})

test('fret less than 0 ignored', t => {
  const rawtab = new Rawtab([b])
  t.deepEqual(rawtab.tab([Bhz-100]), [[null]])
  t.end()
})

test('fret can be very large if no max fret specified', t => {
  const rawtab = new Rawtab([b])
  t.deepEqual(rawtab.tab([Bhz * 16]), [[48]])
  t.end()
})

test('fret greater than max ignored', t => {
  const rawtab = new Rawtab([b], { max: 12 } )
  t.deepEqual(rawtab.tab([Bhz, Ehz, Ehz * 2, Bhz * 2]), [[0], [5], [null], [12]])
  t.end()
})

test('fret less than min ignored', t => {
  const rawtab = new Rawtab([b], { min: 4, max: 10 } )
  t.deepEqual(rawtab.tab([Bhz, Ehz, Ehz * 2, Bhz * 2]), [[null], [5], [null], [null]])
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
