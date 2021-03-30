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


Rawtab.prototype.tabHtml = function(frequencies) {
  const data = this.tab(frequencies)
  const rows = this.strings.map(s => document.createElement('tr'))
  for (var i = 0; i < data.length; i++) {
    for (s = 0; s < this.strings.length; s++) {
      const td = document.createElement('td')
      let v = data[i][s]
      if (v === null) { v = '&nbsp;' }
      td.innerHTML = v  // appendChild(document.createTextNode(v))
      rows[s].appendChild(td)
    }
  }
  return rows
}

module.exports = { Rawtab }
