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

  // The "cursor position" when editing notes.
  this.cursorIndicator = '$.a-/bottom.$'  // default fermata
  this.cursor = null
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
    octave: parseInt(note / 12),
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
 * Groups notes for scoring.
 */
Application.prototype.scorenotes = function() {
  const result = []
  for (var i = 0; i < this.notes.length; i++) {
    const n = this.notes[i]
    let entry = n
    const is_chord = (n.tab && n.tab.type === 'chord')
    if (is_chord) {
      entry = result.pop()
      if (!(entry instanceof Array))
        entry = [ entry ]
      entry.push(n)
    }
    result.push(entry)
  }
  return result
}


/**
 * Generate vextab "notes" string from scorenotes.
 */
Application.prototype.vextab = function() {
  const scorenotes = this.scorenotes()
  const result = []

  addDuration = function(note) {
    if (note.duration) {
      result.push(`:${note.duration}`)
    }
  }

  noteText = function(note) {
    if (!note.tab) {
      return `${note.name}/${note.octave}`
    }

    const string = note.tab.string + 1
    const fret = note.frets[`${note.tab.string}`]
    return `${fret}/${string}`
  }

  for (var i = 0; i < scorenotes.length; i++) {
    const sn = scorenotes[i]

    const is_chord = (sn instanceof Array)

    if (!is_chord) {
      addDuration(sn)
      result.push(noteText(sn))
    }
    else {
      addDuration(sn[0])
      const t = '(' + sn.map(n => noteText(n)).join('.') + ')'
      result.push(t)
    }

    if (this.cursor !== null && this.cursor == i)
      result.push(this.cursorIndicator)
  }

  return result.join(' ')
}


module.exports = { Application }
