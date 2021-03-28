const Scribe = function(strings, scribeOptions = {}) {
  this.strings = strings
  this.opts = scribeOptions
}


 /**
 * get tab for frequencies
 *
 * @param {array} frequency
 * @returns {array}
 */
Scribe.prototype.tab = function(frequencies) {

  const topfret = (this.opts.max || 100)
  const bottomfret = (this.opts.min || 0)

  const result = this.strings.map(s => '-')

  for (var i = 0; i < frequencies.length; i++) {
    const freq = frequencies[i]
    const frets = this.strings.
          map(s => s.getFret(freq)).
          map(n => n < 0 ? null : n).
          map(n => n < bottomfret ? null : n).
          map(n => n > topfret ? null : n)
    // console.log(frets)
    const maxfret = Math.max(...frets)
    maxfretlen = `${maxfret}`.length
    const fretstring = frets.
          map(n => n === null ? '-' : `${n}`).
          map(s => `${'-'.repeat(maxfretlen - s.length)}${s}`).
          map(s => `${s}-`)
    // console.log(fretstring)
    for (var j = 0; j < fretstring.length; j++) {
      result[j] += fretstring[j]
    }
  }
  return [result]
}


module.exports = { Scribe }
