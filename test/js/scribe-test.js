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
  const scribe = new Scribe(1)
  t.deepEqual(scribe.tab([ { '0': 0 } ]), [["-0-"]])
  t.end()
})

test('single string multiple notes', t => {
  const scribe = new Scribe(1)
  const actual = scribe.tab([ { '0': 0 }, {0: 5}, {0: 12} ])
  const expected = [["-0-5-12-"]]
  t.deepEqual(actual, expected)
  t.end()
})

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

