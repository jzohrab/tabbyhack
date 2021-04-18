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

  // Allowable durations
  this.noteDurations = [
    'w', 'h', 'q', '8', '16', '32'
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


  // The notes played.
  this.notes = []
}


/** Dev helper for adding random notes. */
Application.prototype.add_frequency = function(f) {
  this.addNote(this.buildNoteStruct(f))
}

/** Add a new note. */
Application.prototype.addNote = function(note) {
  if (note.standard == 0) {
    return
  }

  // Default to quarter note for first note.
  if (this.notes.length == 0)
    note.duration = 'q'

  this.notes.push(note)
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


/**
 * Generate vextab "notes" string.
 */
Application.prototype.vextab = function() {
  const notes = this.notes
  const result = []

  addDuration = function(note) {
    if (note.duration) {
      result.push(`:${note.duration}`)
    }
  }

  for (var i = 0; i < notes.length; i++) {
    const n = notes[i]

    let text = `${n.name}/${n.octave}`

    const t = n.tab
    if (!t) {
      addDuration(n)
      result.push(text)
      continue
    }

    const string = t.string + 1
    const fret = n.frets[`${t.string}`]
    text = `${fret}/${string}`

    switch (t.type) {
    case 'tone':
      addDuration(n)
      result.push(text)
      break
    case 'chord':
      let chord = result[result.length - 1]
      if (!(chord instanceof Array))
        chord = [ chord ]
      chord.push(text)
      result[result.length - 1] = chord
      break
    default:
      throw `Bad type ${s.type}`
    }

  }

  const vt = result.
        map(e => (e instanceof Array) ? '(' + e.join('.') + ')' : e).
        join(' ')
  return vt
}


module.exports = { Application }
