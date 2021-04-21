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

  // The "line" of notes (i.e., the notes grouped into chords, or single tones.
  this.line = []

  // The notes played.
  this.notes = []
  // TODO - get rid of this, use "this.line" instead.

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
  if (note.frequency == 0) {
    return
  }

  // Default to quarter note for first note.
  if (this.notes.length == 0)
    note.duration = 'q'

  this.line.push(note)
  this.notes = this.line.flat()
}


/**
 * Build full note struct from frequency.
 */
Application.prototype.buildNoteStruct = function(frequency) {

  const ret = {
    name: 'rest',
    value: 0,
    // cents: 0,
    octave: 0,
    frequency: 0,
    standard: 0,  // required, as this controls whether the current note has changed or not.
    frets: {},

    // User can change these values later.
    type: 'tone',
    string: null,
    duration: null
  }

  if (!frequency) {
    return ret
  }

  const note = this.getNote(frequency)
  ret.name = this.noteStrings[note % 12]
  ret.value = note
  ret.octave = parseInt(note / 12)
  ret.frequency = frequency
  ret.standard = this.getStandardFrequency(note)
  ret.frets = this.strings.reduce((result, s) => {
    const f = s.getFret(frequency)
    if (f >= this.options.min && f <= this.options.max)
      result[s.stringNumber] = f
    return result
  },{})

  return ret
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
 * TODO - remove this
 */
Application.prototype.scorenotes = function() {
  console.log('TODO - remove')
  return this.line
}


/**
 * Get all notes in the chord ending with the current note.
 */
Application.prototype.chordNotes = function(i) {
  if (this.notes[i].type == 'tone')
    return []
  const ret = []
  for (var p = i; p >= 0; p--) {
    const n = this.notes[p]
    ret.push(n)
    if (n.type == 'tone') {
      break
    }
  }
  return ret.reverse()
}
  
/**
 * Toggle a note into a chord, or explode a chord into individual notes.
 */
Application.prototype.toggleChord = function(i) {
  const e = this.line[i]

  if (e instanceof Array) {
    console.log('exploding chord')
    const reinsert = e
    this.line.splice(i, 1)  // remove existing chord
    this.line.splice(i, 0, ...e)  // reinsert individual notes
    return
  }

  if (i <= 0)
    throw 'first note cannot be a chord tone'
  if (e.string == null)
    throw 'must assign string'

  const prior = this.line[i - 1]
  if (prior instanceof Array) {
    const chordstrings = prior.map(n => n.string)
    console.log(`Chord strings: ${chordstrings.join(', ')}`)
    console.log(`check chord uses ${e.string}`)
    if (chordstrings.includes(e.string))
      throw `string ${e.string + 1} already used`

    console.log('Adding to chord')
    this.line[i - 1].push(e)
    this.line.splice(i, 1)
  }
  else {
    console.log('Adding to prior note')
    if (prior.string == null)
      throw 'prior note must have string assigned'
    if (prior.string == e.string)
      throw `string ${e.string + 1} already used`

    console.log('starting chord')
    this.line[i - 1] = [prior, e]
    console.log('removing e from the line')
    this.line.splice(i, 1)
  }
  e.type = 'chord'
}


Application.prototype.setDuration = function(i, s) {
  const e = this.line[i]
  e.duration = s

  /*
  if (e instanceof Array) {
    console.log('exploding chord')
    const reinsert = e
    this.line.splice(i, 1)  // remove existing chord
    this.line.splice(i, 0, ...e)  // reinsert individual notes
    return
  }

  if (i <= 0)
    throw 'first note cannot be a chord tone'
  if (e.string == null)
    throw 'must assign string'

  const prior = this.line[i - 1]
  if (prior instanceof Array) {
    const chordstrings = prior.map(n => n.string)
    console.log(`Chord strings: ${chordstrings.join(', ')}`)
    console.log(`check chord uses ${e.string}`)
    if (chordstrings.includes(e.string))
      throw `string ${e.string + 1} already used`

    console.log('Adding to chord')
    this.line[i - 1].push(e)
    this.line.splice(i, 1)
  }
  else {
    console.log('Adding to prior note')
    if (prior.string == null)
      throw 'prior note must have string assigned'
    if (prior.string == e.string)
      throw `string ${e.string + 1} already used`

    console.log('starting chord')
    this.line[i - 1] = [prior, e]
    console.log('removing e from the line')
    this.line.splice(i, 1)
  }
  e.type = 'chord'
  */
}


/**
 * Delete element from line.
 */
Application.prototype.deleteAt = function(i) {
  this.line.splice(i, 1)  // remove existing thing
  this.notes = this.line.flat()  // TODO remove this
}


/**
 * Generate vextab "notes" string from scorenotes.
 */
Application.prototype.vextab = function(header = '', opts = {}) {
  const scorenotes = this.scorenotes()
  if (scorenotes.length == 0) {
    return header
  }

  const maxstafflength = opts.stafflength || 24
  const result = []
  let currstaff = []
  result.push(currstaff)

  addDuration = function(s, note) {
    if (note.duration) {
      s.push(`:${note.duration}`)
    }
  }

  noteText = function(note) {
    if (note.string == null) {
      return `${note.name}/${note.octave}`
    }

    const string = note.string + 1
    const fret = note.frets[`${note.string}`]
    return `${fret}/${string}`
  }

  for (var i = 0; i < scorenotes.length; i++) {
    const sn = scorenotes[i]

    const is_chord = (sn instanceof Array)

    if (!is_chord) {
      addDuration(currstaff, sn)
      currstaff.push(noteText(sn))
    }
    else {
      addDuration(currstaff, sn[0])
      const t = '(' + sn.map(n => noteText(n)).join('.') + ')'
      currstaff.push(t)
    }

    if (this.cursor !== null && this.cursor == i)
      currstaff.push(this.cursorIndicator)

    const isLastNote = (i == scorenotes.length - 1)
    if (currstaff.length >= maxstafflength && !isLastNote) {
      currstaff = []
      result.push(currstaff)
    }

  }

  let heading = header || ''
  if (this.options.vextabopts)
    heading = `${heading} ${this.options.vextabopts}`
  if (heading !== '' && scorenotes.length > 0)
    heading += '\nnotes '

  return result.
    map(staff => `${heading}${staff.join(' ')}`).
    join('\n\n')
}


module.exports = { Application }
