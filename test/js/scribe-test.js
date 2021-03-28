const { join } = require('path')
const test = require('tape')

const js = join(process.cwd(), 'src', 'js')
const { Scribe } = require(join(js, 'scribe.js'))
const { GuitarString } = require(join(js, 'GuitarString.js'))

// Useful frequencies (open strings)
const Bhz = 246.94
const Ehz = 329.63

const b = new GuitarString('b', Bhz)
const e = new GuitarString('e', Ehz)

test('single open string', t => {
  const scribe = new Scribe([b])
  t.deepEqual(scribe.tab([Bhz]), ["-0-"])
  t.end()
})

test('single string multiple notes', t => {
  const scribe = new Scribe([b])
  const actual = scribe.tab([Bhz, Ehz, Bhz * 2])
  const expected = ["-0-5-12-"]
  t.deepEqual(actual, expected)
  t.end()
})

test('fret less than 0 ignored', t => {
  const scribe = new Scribe([b])
  t.deepEqual(scribe.tab([Bhz-100]), ["---"])
  t.end()
})

test('fret can be very large if no max fret specified', t => {
  const scribe = new Scribe([b])
  t.deepEqual(scribe.tab([Bhz * 16]), ["-48-"])
  t.end()
})

test('fret greater than max ignored', t => {
  const scribe = new Scribe([b], { max: 12 } )
  t.deepEqual(scribe.tab([Bhz, Ehz, Ehz * 2, Bhz * 2]), ["-0-5---12-"])
  t.end()
})

test('fret less than min ignored', t => {
  const scribe = new Scribe([b], { min: 4, max: 10 } )
  t.deepEqual(scribe.tab([Bhz, Ehz, Ehz * 2, Bhz * 2]), ["---5-----"])
  t.end()
})

test('multistring open string', t => {
  const scribe = new Scribe([e, b])
  const actual = scribe.tab([Bhz, Ehz])
  const expected = [
    "---0-",
    "-0-5-"
  ]
  t.deepEqual(actual, expected)
  t.end()
})

test('multistring above 10th fret tab numbers aligned correctly', t => {
  const scribe = new Scribe([e, b])
  const actual = scribe.tab([Bhz, Ehz, Bhz * 2, Ehz])
  const expected = [
    "---0--7-0-",
    "-0-5-12-5-"
  ]
  t.deepEqual(actual, expected)
  t.end()
})

test('multistring ignored notes arent tabbed', t => {
  const scribe = new Scribe([e, b], { min: 4, max: 12 } )
  const actual = scribe.tab([Bhz, Ehz, Bhz * 2, Bhz / 2, Ehz * 2])
  const expected = [
    "------7---12-",
    "---5-12------"
  ]
  t.deepEqual(actual, expected)
  t.end()
})

test('multistring out of range notes yields blank tab', t => {
  const scribe = new Scribe([e, b], { min: 4, max: 12 } )
  const actual = scribe.tab([Ehz * 8, Bhz * 8, Bhz / 2, Ehz * 8])
  const expected = [
    "---------",
    "---------"
  ]
  t.deepEqual(actual, expected)
  t.end()
})
