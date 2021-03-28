import { GuitarString } from './guitarstring.js'

const GuitarNeck = function() {
  // Frequencies from https://en.wikipedia.org/wiki/Guitar_tunings
  const stringFreqs = [
    329.63,
    246.94,
    196.00,
    146.83,
    110.00,
    82.41
  ]

  this.strings = stringFreqs.map((f, i) => new GuitarString(i, f))
}

GuitarNeck.prototype.listStrings = function() {
  return this.strings.map(s => s.stringNumber).join(', ')
}

module.exports = { GuitarNeck }
