const { GuitarString } = require('./guitarstring.js')
const { Note } = require('./note.js')

/**
 * Main application.
 *
 * Tracks notes.
 */
const Application = function(opts = {}) {
  this.options = opts
  this.options.min = this.options.min || 0
  this.options.max = this.options.max || 12

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

  // Callbacks, can be overridden.
  this.noteAdded = (n) => { /* no-op by default. */ }

  // The "cursor position" when editing notes.
  this.cursorIndicator = '$.a-/bottom.$'  // default fermata
  this.cursor = null
}


Application.prototype.notes = function(f) {
  console.log('TODO remove app.notes() if possible.')
  return this.line.flat()
}


/** Dev helper for adding random notes. */
Application.prototype.add_frequency = function(f) {
  this.addNote(new Note(f))
}

/** Add a new note. */
Application.prototype.addNote = function(note) {
  if (note.frequency == 0) {
    return
  }

  // Default to quarter note for first note.
  if (this.line.length == 0)
    note.duration = 'q'

  note.frets = this.strings.reduce((result, s) => {
    const f = s.getFret(note.frequency)
    if (f >= this.options.min && f <= this.options.max)
      result[s.stringNumber] = f
      return result
  },{})
  
  this.line.push(note)
  this.noteAdded(note)
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

  if (e instanceof Array) {
    e[0].duration = s
  }
  else {
    e.duration = s
  }
}


/**
 * Delete element from line.
 */
Application.prototype.deleteAt = function(i) {
  const maxi = this.line.length
  if (i < 0 || i > maxi)
    throw `Bounds exception, get ${i} but should be in [0, ${maxi})`

  // Propagate time settings.
  const [ first, second ] = this.line.flat()
  if (first && second)
    second.duration = second.duration || first.duration

  this.line.splice(i, 1)  // remove existing thing
}


/**
 * Get note, first note of chord if chord
 */
Application.prototype.noteAt = function(i) {
  const maxi = this.line.length
  if (i < 0 || i > maxi)
    throw `Bounds exception, get ${i} but should be in [0, ${maxi})`

  const e = this.line[i]
  return (e instanceof Array) ? e[0] : e
}


/**
 * Generate vextab "notes" string.
 */
Application.prototype.vextab = function(header = '', opts = {}) {
  if (this.line.length == 0) {
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

  for (var i = 0; i < this.line.length; i++) {
    const sn = this.line[i]

    const is_chord = (sn instanceof Array)

    if (!is_chord) {
      addDuration(currstaff, sn)
      currstaff.push(sn.vextab())
    }
    else {
      addDuration(currstaff, sn[0])
      const t = '(' + sn.map(n => n.vextab()).join('.') + ')'
      currstaff.push(t)
    }

    if (this.cursor !== null && this.cursor == i)
      currstaff.push(this.cursorIndicator)

    const isLastNote = (i == this.line.length - 1)
    if (currstaff.length >= maxstafflength && !isLastNote) {
      currstaff = []
      result.push(currstaff)
    }

  }

  let heading = header || ''
  if (this.options.vextabopts)
    heading = `${heading} ${this.options.vextabopts}`
  if (heading !== '' && this.line.length > 0)
    heading += '\nnotes '

  return result.
    map(staff => `${heading}${staff.join(' ')}`).
    join('\n\n')
}


module.exports = { Application }
