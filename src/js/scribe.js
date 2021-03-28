const Scribe = function(scribeOptions = {}) {
  this.strings = scribeOptions.strings
}


 /**
 * get tab for frequencies
 *
 * @param {array} frequency
 * @returns {string}
 */
Scribe.prototype.tab = function(frequencies) {

  const result = this.strings.map(s => '-')

  for (var i = 0; i < frequencies.length; i++) {
    const freq = frequencies[i]
    const frets = this.strings.
          map(s => s.getFret(freq)).
          map(n => n < 0 ? null : n)
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
  return result.join('\n')
}


module.exports = { Scribe }
