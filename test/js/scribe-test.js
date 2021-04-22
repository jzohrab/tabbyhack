const { join } = require('path')
const test = require('tape')

const js = join(process.cwd(), 'src', 'js')
const { Scribe } = require(join(js, 'scribe.js'))
const { GuitarString } = require(join(js, 'GuitarString.js'))
const { Note } = require(join(js, 'Note.js'))

// Scribe doesn't care about frequencies, just frets and strings.
function makeFrettedNote(frets, string) {
  const n = new Note(246.94)
  n.frets = frets
  n.string = string
  return n
}

test('no notes = empty tab', t => {
  const scribe = new Scribe()
  t.deepEqual(scribe.tab([]), [new Array(6).fill("-")])
  t.end()
})

test('single open string, 2 string ', t => {
  const scribe = new Scribe(2)
  const line = [ makeFrettedNote({ 1: 0}, 1) ]
  t.deepEqual(scribe.tab(line), [["---", "-0-"]])
  t.end()
})

/*
test('single string multiple notes', t => {
  const scribe = new Scribe(2)

  const b = new Note(Bhz)
  const e = new Note(Ehz)


  const actual = scribe.tab([ { '0': 0 }, {0: 5}, {0: 12} ])
  const expected = [["-0-5-12-"]]
  t.deepEqual(actual, expected)
  t.end()
})

/*

test('null tabbed as empty', t => {
  const scribe = new Scribe(1)
  t.deepEqual(scribe.tab([{0: 0}, {0: 5}, {0: null}, {0: 12}]), [["-0-5---12-"]])
  t.end()
})

test('multistring numbers aligned correctly', t => {
  const scribe = new Scribe(2)
  const actual = scribe.tab([{1: 0}, {0: 0, 1: 0}, {0: 7, 1: 12}, {1: 5}])
  const expected = [[
    "---0--7---",
    "-0-0-12-5-"
  ]]
  t.deepEqual(actual, expected)
  t.end()
})

test('multistring null notes arent tabbed', t => {
  const scribe = new Scribe(2)
  const actual = scribe.tab([{1: 0}, {0: null, 1: 0}, {0: 7, 1: 12}, {1: 5}])
  const expected = [[
    "------7---",
    "-0-0-12-5-"
  ]]
  t.deepEqual(actual, expected)
  t.end()
})

test('can split tab to separate lines', t => {
  const scribe = new Scribe(2, { stafflength: 7 })
  const actual = scribe.tab([{1: 0}, {0: null, 1: 0}, {0: 7, 1: 12}, {1: 5}])
  const expected = [
    [
      "------7-",
      "-0-0-12-"
    ],
    [
      "---",
      "-5-"
    ]
  ]
  t.deepEqual(actual, expected)
  t.end()
})

*/
