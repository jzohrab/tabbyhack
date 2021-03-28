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
  return "---"
}


module.exports = { Scribe }
