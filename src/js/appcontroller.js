import { Application } from './app.js'
import { GuitarString } from './guitarstring.js'
// import { Scribe } from './scribe.js'
import { Tuner } from './tuner.js'
import { Note } from './note.js'

const ApplicationController = function(app) {
  const a4 = 440
  this.tuner = new Tuner(a4)
  this.$rawnote = document.getElementById('rawnote')
  // this.$tab = document.getElementById('tab')
  this.$rawtab = document.getElementById('rawtab')
  this.sensitivity = document.getElementById('micsensitivity').value || 400

  this.app = app

  // Vextab creates a textarea with class "editor"
  const editors = document.getElementsByClassName("editor")
  if (editors.length !== 1) {
    throw "no unique 'editor' class found"
  }
  this.vextabeditor = editors[0]
}


ApplicationController.prototype.start = function() {
  this.currNote = null
  this.currNoteStart = null

  // Milliseconds duration note must reach before being processed.
  const MIN_DURATION = this.sensitivity

  // Only add the current note _once_ after it has lasted the min
  // duration.
  this.currNoteProcessed = false

  const self = this
  this.tuner.onFrequencyDetected = function(frequency) {
    const now = Date.now()
    const note = new Note(frequency)

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
      self.app.addNote(self.currNote)
      self.updateUI()
      self.currNoteProcessed = true
    }

    if (note.standard !== self.currNote.standard) {
      // console.log('New current note)
      self.currNote = note
      self.currNoteStart = now
      self.currNoteProcessed = false
    }

  }

  self.tuner.init()
  self.frequencyData = new Uint8Array(self.tuner.analyser.frequencyBinCount)

}


ApplicationController.prototype.stop = function() {
  this.tuner.onFrequencyDetected = function(note) { /* no-op */ }
}

/**
 * Update the text box that shows the raw data of what's currently played.
 */
ApplicationController.prototype.updateCurrentNoteDisplay = function() {
  const nl = this.app.notes().length
  if (nl == 0)
    return
  const note = this.app.notes()[nl - 1]
  const notedesc = `${note.name}${note.octave} (${note.frequency.toFixed(2)} Hz)`
  this.$rawnote.innerHTML = `Current: ${notedesc}`
}

/**
 * Update the vextab editor.
 */
ApplicationController.prototype.writeVextab = function() {
  const vt = this.app.vextab('tabstave notation=true')
  if (vt === '') {
    return
  }
  this.vextabeditor.value = vt

  // Simulate a keypress in the vextab editor so that the canvas is updated.
  // ref https://github.com/0xfe/vextab/blob/master/src/div.js
  this.vextabeditor.dispatchEvent(new KeyboardEvent('keyup'));
}


ApplicationController.prototype.updateUI = function() {
  this.updateCurrentNoteDisplay()
  this.writeVextab()
}

module.exports = { ApplicationController }
