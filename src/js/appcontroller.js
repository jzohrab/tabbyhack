import { Application } from './app.js'
import { GuitarString } from './guitarstring.js'
import { Tuner } from './tuner.js'
import { Note } from './note.js'
import { AppFretboard } from './appfretboard.js'
import { Tabselector } from './tabselector.js'

const ApplicationController = function(app) {
  const a4 = 440
  this.tuner = new Tuner(a4)
  this.$rawnote = document.getElementById('rawnote')
  // this.$tab = document.getElementById('tab')
  this.$rawtab = document.getElementById('rawtab')
  this.sensitivity = document.getElementById('micsensitivity').value || 400

  this.app = app

  // We're only recording once the user clicks "start", but the mic is listening.
  this.isRecording = false

  this.fretboard = new AppFretboard()

  // Vextab creates a textarea with class "editor"
  const vexeditors = document.getElementsByClassName("editor")
  if (vexeditors.length !== 1) {
    throw "no unique 'editor' class found"
  }
  this.vextabeditor = vexeditors[0]

  // The editor
  this.tabselector = null
}

ApplicationController.prototype.configure = function(config) {
  this.sensitivity = document.getElementById('micsensitivity').value || 400
}

ApplicationController.prototype.startRecording = function() {
  this.isRecording = true
  this.start()
}

ApplicationController.prototype.start = function() {
  this.currNote = null
  this.currNoteStart = null

  // Only add the current note _once_ after it has lasted the min
  // duration.
  this.currNoteProcessed = false

  const self = this
  this.tuner.onFrequencyDetected = function(frequency) {
    const now = Date.now()
    const note = self.app.buildNote(frequency)

    // Ignore first sample, as we can't do anything with a note until it
    // reaches MIN_DURATION.
    if (!self.currNote) {
      self.currNote = note
      self.currNoteStart = now
      return
    }

    const currNoteAge = (now - self.currNoteStart)
    if (note.standard !== 0 && self.currNote.standard == note.standard && currNoteAge > self.sensitivity && !self.currNoteProcessed) {
      // console.log(`Curr note duration ${duration} exceeds min, updating`)
      this.addNote(self.currNote)
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

ApplicationController.prototype.addNote = function(n) {
  this.handleNote(n)
  if (this.isRecording) {
    this.app.addNote(n)
    this.updateUI()
  }
}

/** Start keyboard listener. */
ApplicationController.prototype.stop = function() {
  this.isRecording = false
  this.tuner.onFrequencyDetected = function(note) { /* no-op */ }

  this.tabselector = new Tabselector(this.app, this.fretboard, window.renderTab)
  this.tabselector.init()
}

/** Remove keyboard listener. */
ApplicationController.prototype.stopEditing = function() {
  this.tabselector.stop()
}


ApplicationController.prototype.handleNote = function(note) {
  this.fretboard.drawNote(note)
  this.updateCurrentNoteDisplay(note)
}


/**
 * Update the text box that shows the raw data of what's currently played.
 */
ApplicationController.prototype.updateCurrentNoteDisplay = function(note) {
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
  this.writeVextab()
}

module.exports = { ApplicationController }
