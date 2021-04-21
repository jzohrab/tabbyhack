/**
 * Note.
 */
const Note = function(frequency) {

  this.semitone = 69
  this.middleA = 440

  this.name = 'rest'
  this.value = 0
  // cents = 0
  this.octave = 0
  this.frequency = 0
  this.standard = 0  // required as this controls whether the current note has changed or not.

  // User can change these values later.
  this.type = 'tone'
  this.string = null
  this.frets = {}
  this.duration = null

  if (frequency) {
    const note = this.getNote(frequency)
    this.name = this.getNoteString(note)
    this.value = note
    this.octave = parseInt(note / 12)
    this.frequency = frequency
    this.standard = this.getStandardFrequency(note)
  }
}

/**
 * get musical note from frequency
 *
 * @param {number} frequency
 * @returns {number}
 */
Note.prototype.getNote = function(frequency) {
  const note = 12 * (Math.log(frequency / this.middleA) / Math.log(2))
  return Math.round(note) + this.semitone
}

Note.prototype.getNoteString = function(note) {
  const noteStrings = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B'
  ]
  return noteStrings[note % 12]
}


/**
 * get the musical note's standard frequency
 *
 * @param note
 * @returns {number}
 */
Note.prototype.getStandardFrequency = function(note) {
  return this.middleA * Math.pow(2, (note - this.semitone) / 12)
}

/**
 * get cents difference between given frequency and musical note's standard frequency
 *
 * @param {number} frequency
 * @param {number} note
 * @returns {number}
 */
Note.prototype.getCents = function(frequency, note) {
  return Math.floor(
    (1200 * Math.log(frequency / this.getStandardFrequency(note))) / Math.log(2)
  )
}



/**
 * Generate vextab for note.
 */
Note.prototype.vextab = function() {
  if (this.string == null || Object.keys(this.frets).length == 0) {
    return `${this.name}/${this.octave}`
  }

  const string = this.string + 1
  const fret = this.frets[`${this.string}`]
  return `${fret}/${string}`
}


module.exports = { Note }
