const Scribe = function(numstrings, scribeOptions = {}) {
  this.numstrings = numstrings
  this.opts = scribeOptions
}


 /**
 * get tab for frequencies
 *
 * @param {array} data, eg [ { '0': 0 }, ... ]
 * @returns {array}
 */
Scribe.prototype.tab = function(data) {
  const stafflength = this.opts.stafflength || 75

  ns = this.numstrings
  function newStaff() {
    const ret = []
    for (var i = 0; i < ns; i++) {
      ret.push('-')
    }
    return ret
  }

  const result = []
  let staff = newStaff()
  result.push(staff)

  for (var i = 0; i < data.length; i++) {
    const frets = newStaff()
    for (var s = 0; s < this.numstrings; s++) {
      let v = data[i][`${s}`]
      if (v === undefined) {
        v = null
      }
      frets[s] = v
    }
    // console.log(frets)
    const maxfret = Math.max(...frets)
    maxfretlen = `${maxfret}`.length
    const fretstring = frets.
          map(n => n === null ? '-' : `${n}`).
          map(s => `${'-'.repeat(maxfretlen - s.length)}${s}`).
          map(s => `${s}-`)
    // console.log(fretstring)
    for (var j = 0; j < fretstring.length; j++) {
      staff[j] += fretstring[j]
    }

    if (staff[0].length >= stafflength) {
      staff = newStaff()
      result.push(staff)
    }
  }
  return result
}


module.exports = { Scribe }
