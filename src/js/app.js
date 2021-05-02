const { GuitarString } = require('./guitarstring.js')
const { Note } = require('./note.js')
const { VextabScribe } = require('./vextabscribe.js')

/**
 * Main application.
 *
 * Tracks notes.
 */
const Application = function(opts = {}) {
  this.configure(opts)

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

  // Callbacks, can be overridden.  (Currently unused, remove?  TODO)
  this.noteAdded = (n) => { /* no-op by default. */ }

  // The "cursor position" when editing notes.
  this.cursorIndicator = '$.a-/bottom.$'  // default fermata
  this.cursor = null
}


Application.prototype.configure = function(config) {
  this.options = config
  this.options.min = this.options.min || 0
  this.options.max = this.options.max || 12
}


Application.prototype.notes = function(f) {
  console.log('TODO remove app.notes() if possible.')
  return this.line.flat()
}


/** Dev helper for adding random notes. */
Application.prototype.add_frequency = function(f) {
  this.addNote(new Note(f))
}


/** Build a note, indicating frets. */
// TODO - need to sort this out with some tests, currently this distorts the "architecture" :-P
Application.prototype.buildNote = function(frequency) {
  const n = new Note(frequency)
  this.addFrets(n)
  return n
}


/** Add frets to a note. */
Application.prototype.addFrets = function(note) {
  note.frets = this.strings.reduce((result, s) => {
    const f = s.getFret(note.frequency)
    if (f >= this.options.min && f <= this.options.max)
      result[s.stringNumber] = f
      return result
  },{})
}


/** Add a new note. */
Application.prototype.addNote = function(note) {
  if (note.frequency == 0) {
    return
  }

  // Default to quarter note for first note.
  if (this.line.length == 0)
    note.duration = 'q'

  this.addFrets(note)
  
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
  const finalopts = {
    ...opts,
    cursor: this.cursor,
    cursorIndicator: this.cursorIndicator,
    vextabopts: this.options.vextabopts
  }
  const vs = new VextabScribe(header, finalopts)
  return vs.tab(this.line)
}


module.exports = { Application }
