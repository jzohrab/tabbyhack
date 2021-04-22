const Scribe = function(numstrings = 6, scribeOptions = {}) {
  this.numstrings = numstrings
  this.opts = scribeOptions
}


 /**
 * get tab for app line.
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

    let notes = appline[i]
    if (!(notes instanceof Array))
      notes = [ notes ]

    const frets = new Array(ns).fill(null)

    // Fill in frets for all strings.
    notes.forEach(n => {
      // Hacky, ensure the string chosen is valid!
      if (n.string >= 0 && n.string < ns)
        frets[n.string] = n.frets[`${n.string}`]
    })
    console.log(`for line # ${i}, have frets: [ ${frets.join(', ')} ]`)

    let maxfretlen = 0
    for (var j = 0; j < frets.length; j++) {
      let fstring = '-'
      if (frets[j] !== null && frets[j] !== undefined)
        fstring = `${frets[j]}`
      frets[j] = fstring
      if (maxfretlen < fstring.length)
        maxfretlen = fstring.length
    }
    console.log(`after stringing, have frets: [ ${frets.join(', ')} ]`)
    // console.log(frets)

    const fretstring = frets.
          map(s => `${'-'.repeat(maxfretlen - s.length)}${s}`).
          map(s => `${s}-`)
    console.log(`fretstring = [ ${fretstring.join(', ')} ]`)
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
