/**
 * Rawtab creates tab for frequencies, showing possible frettings on
 * multiple strings.  Eg, open string high E can be played as 5th fret
 * on B string, etc.
 */
const Rawtab = function(strings, rawtabOptions = {}) {
  this.strings = strings
  this.opts = rawtabOptions
}

 /**
 * get raw tab for frequencies
 *
 * @param {array} frequency
 * @returns {array}
 */
Rawtab.prototype.tab = function(frequencies) {
  const topfret = (this.opts.max || 100)
  const bottomfret = (this.opts.min || 0)

  const result = []

  // NOTE: if the "layout" of result changes (e.g. data format change),
  // app.js writeRawTab must change as well.
  for (var i = 0; i < frequencies.length; i++) {
    const freq = frequencies[i]
    const frets = this.strings.
          map(s => s.getFret(freq)).
          map(n => n < 0 ? null : n).
          map(n => n < bottomfret ? null : n).
          map(n => n > topfret ? null : n)
    result.push(frets)
  }
  return result
}


module.exports = { Rawtab }
