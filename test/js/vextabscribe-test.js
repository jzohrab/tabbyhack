const { join } = require('path')
const test = require('tape')

const js = join(process.cwd(), 'src', 'js')
const { VextabScribe } = require(join(js, 'vextabscribe.js'))

/* these tests are handled by app-test.js. */
