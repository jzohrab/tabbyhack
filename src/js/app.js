const { GuitarString } = require('./guitarstring.js')

/**
 * Main application.
 *
 * Tracks notes.
 */
const Application = function(opts = {}) {
  this.options = opts
  this.options.min = this.options.min || 0
  this.options.max = this.options.max || 12
  this.notes = []
  this.semitone = 69
  this.middleA = 440

  this.noteStrings = [
    'C',
    'C♯',
    'D',
    'D♯',
    'E',
    'F',
    'F♯',
    'G',
    'G♯',
    'A',
    'A♯',
    'B'
  ]

  // Frequencies from https://en.wikipedia.org/wiki/Guitar_tunings
  const stringFreqs = [
    329.63,
    246.94,
    196.00,
    146.83,
    110.00,
    82.41
  ]
  this.strings = stringFreqs.map((f, i) => new GuitarString(i, f))
  // this.scribe = new Scribe(this.strings, { max: 24 })
}


/** Dev helper for adding random notes. */
Application.prototype.add_frequency = function(f) {
  this.addNote(this.buildNoteStruct(f))
}

/** Add a new note. */
Application.prototype.addNote = function(note) {
  if (note.standard !== 0) {
    this.notes.push(note)
  }
}


/**
 * Build full note struct from frequency.
 */
Application.prototype.buildNoteStruct = function(frequency) {

  if (!frequency) {
    return {
      name: 'rest',
      value: 0,
      cents: 0,
      octave: 0,
      frequency: 0,
      standard: 0,
      frets: {}
    }
  }

  const note = this.getNote(frequency)
  const frets = this.strings.reduce((result, s) => {
    const f = s.getFret(frequency)
    if (f >= this.options.min && f <= this.options.max)
      result[s.stringNumber] = f
    return result
  },{})
  return {
    name: this.noteStrings[note % 12],
    value: note,
    cents: this.getCents(frequency, note),
    octave: parseInt(note / 12) - 1,
    frequency: frequency,
    standard: this.getStandardFrequency(note),
    frets
  }
}

/**
 * get musical note from frequency
 *
 * @param {number} frequency
 * @returns {number}
 */
Application.prototype.getNote = function(frequency) {
  const note = 12 * (Math.log(frequency / this.middleA) / Math.log(2))
  return Math.round(note) + this.semitone
}

/**
 * get the musical note's standard frequency
 *
 * @param note
 * @returns {number}
 */
Application.prototype.getStandardFrequency = function(note) {
  return this.middleA * Math.pow(2, (note - this.semitone) / 12)
}

/**
 * get cents difference between given frequency and musical note's standard frequency
 *
 * @param {number} frequency
 * @param {number} note
 * @returns {number}
 */
Application.prototype.getCents = function(frequency, note) {
  return Math.floor(
    (1200 * Math.log(frequency / this.getStandardFrequency(note))) / Math.log(2)
  )
}


module.exports = { Application }
