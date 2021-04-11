const VextabScribe = function() {}


 /**
 * get vextab for data.
 *
 * @param {array} data, eg [ { '0': 0 }, ... ]
 * @returns {string}
 */
VextabScribe.prototype.tab = function(data) {

  const result = []

  for (var i = 0; i < data.length; i++) {
    const frets = []
    for (var string = 0; string < 6; string++) {
      // In Vextab, string 0 (high E) is actually 1.
      const vextabstring = string + 1
      
      let fret = data[i][`${string}`]
      if (fret === undefined) {
        // skip.
      }
      else if (fret === null) {
        frets.push(`X/${vextabstring}`)
      }
      else {
        frets.push(`${fret}/${vextabstring}`)
      }
    }

    // console.log(frets)
    let vextab = frets.join('.')
    const is_chord = (frets.length > 1)
    if (is_chord) {
      vextab = `(${vextab})`
    }
    if (frets.length > 0) {
      result.push(vextab)
    }
      
  }

  return result.join(' ')
}


module.exports = { VextabScribe }
