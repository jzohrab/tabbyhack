import { GuitarString } from './guitarstring.js'
import { Tuner } from './tuner.js'

const Application = function() {
  const a4 = 440
  this.tuner = new Tuner(a4)
  this.$rawnote = document.querySelector('.rawnote span')
  this.notes = [];
}

// Frequencies from https://en.wikipedia.org/wiki/Guitar_tunings
const stringFreqs = [
  329.63,
  246.94,
  196.00,
  146.83,
  110.00,
  82.41
  ]

const GuitarStrings = stringFreqs.map((f, i) => new GuitarString(i, f))

Application.prototype.start = function() {
  const self = this
  this.currNote = null
  this.currNoteStart = null

  // Milliseconds duration note must reach before being processed.
  const MIN_DURATION = 400

  // Only add the current note _once_ after it has lasted the min
  // duration.
  this.currNoteProcessed = false

  this.tuner.onNoteDetected = function(note) {
    const now = Date.now()

    // Ignore first sample, as we can't do anything with a note until it
    // reaches MIN_DURATION.
    if (!self.currNote) {
      self.currNote = note
      self.currNoteStart = now
      return
    }

    const currNoteAge = (now - self.currNoteStart)
    if (!self.currNoteProcessed && currNoteAge > MIN_DURATION) {
      // console.log(`Curr note duration ${duration} exceeds min, updating`)
      self.update(self.currNote)
      self.currNoteProcessed = true
    }

    if (note.standard !== self.currNote.standard) {
      // console.log('New current note)
      self.currNote = note
      self.currNoteStart = now
      self.currNoteProcessed = false
    }

  }

  swal.fire('Start getting notes').then(function() {
    self.tuner.init()
    self.frequencyData = new Uint8Array(self.tuner.analyser.frequencyBinCount)
  })

}

Application.prototype.update = function(note) {
  if (note.standard !== 0) {
    note.frets = GuitarStrings.map((s, i) => s.getFret(note.frequency))
    this.$rawnote.innerHTML = note.standard + ": " + note.frets.join(', ')
    this.notes.push(note)
  }
}

// noinspection JSUnusedGlobalSymbols
Application.prototype.toggleAutoMode = function() {
  this.notes.toggleAutoMode()
}

window.app = new Application()
window.app.start()
