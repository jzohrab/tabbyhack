const Scribe = function(numstrings = 6, scribeOptions = {}) {
  this.numstrings = numstrings
  this.opts = scribeOptions
}


 /**
 * get tab for frequencies
 *
 * @param {array} app.line, with .string filled in or not.
 * @returns {array}
 */
Scribe.prototype.tab = function(appline) {
  const stafflength = this.opts.stafflength || 75

  ns = this.numstrings
  function newStaff() {
    return new Array(ns).fill('-')
  }

  const result = []
  let staff = newStaff()
  result.push(staff)

  for (var i = 0; i < appline.length; i++) {
    const frets = new Array(ns).fill(null)

    let curr = appline[i]
    let notes = appline[i]
    if (!(notes instanceof Array))
      notes = [ notes ]

    notes.forEach(n => frets[n.string] = n.frets[`${n.string}`])
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
