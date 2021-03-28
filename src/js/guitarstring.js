const GuitarString = function(stringNumber, openFrequency) {
  this.stringNumber = stringNumber
  this.openFrequency = openFrequency

  // Any music note frequency f is related to another frequency f0 by:
  // f = f0 * alpha ^ s
  // where alpha = 2 ^ (1/12)
  // s = # of semitones from f0 to f (s > 0 if ascending, s < 0 if descending)
  this.alpha = Math.pow(2, 1/12)

  this.logalpha = Math.log(2) / 12
  this.logopenFreq = Math.log(openFrequency)
}

 /**
 * get fret from frequency.
 *
 * @param {number} frequency
 * @returns {number}
 */
GuitarString.prototype.getFret = function(frequency) {
  /* Derivation:
     Since f = f0 * alpha ^ s,
     f / f0 = alpha ^ s
     s = Math.log(f / f0) / Math.log(alpha)
     s = (Math.log(f) - Math.log(f0)) / Math.log(alpha)
  */
  const s = (Math.log(frequency) - this.logopenFreq) / this.logalpha
  return Math.round(s)
}


module.exports = { GuitarString }
