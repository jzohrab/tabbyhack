import { Application } from './app.js'
import { GuitarString } from './guitarstring.js'
import { Tuner } from './tuner.js'
import { Note } from './note.js'
import { Fretboard } from '@moonwave99/fretboard.js';

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

  // The fretboard
  // Ref https://moonwave99.github.io/fretboard.js/documentation-fretboard.html
  const fretboardconfig = {
    el: '#fretboard',
    fretCount: 24,
    middleFretColor: "#666",
    middleFretWidth: 1,
    width: 1500,
    // height: 50,
    scaleFrets: "true",
    showFretNumbers: "false",
    disabledOpacity: "0.4",
  }
  this.fretboard = new Fretboard(fretboardconfig)
  this.fretboard.render()

  // Vextab creates a textarea with class "editor"
  const editors = document.getElementsByClassName("editor")
  if (editors.length !== 1) {
    throw "no unique 'editor' class found"
  }
  this.vextabeditor = editors[0]
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

ApplicationController.prototype.stop = function() {
  this.isRecording = false
  this.tuner.onFrequencyDetected = function(note) { /* no-op */ }
}



ApplicationController.prototype.handleNote = function(note) {
  this.drawNoteOnFretboard(note)
  this.updateCurrentNoteDisplay(note)
}


/** Update the fretboard. */
ApplicationController.prototype.drawNoteOnFretboard = function(note) {
  console.log(`added ${JSON.stringify(note)}`)
  // note.frets example: "frets":{"2":2,"3":7,"4":12}
  const dots = Object.entries(note.frets).
        map(p => [ parseInt(p[0]) + 1, p[1] ]).
        reduce((arr, p) => { arr.push({ string: p[0], fret: p[1] }); return arr }, [])
  this.fretboard.
    setDots(dots).
    render().
    style({ fill: 'green' })
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


/** SAMPLE CODE to be integrated */
// When the user is editing and the cursor changes, get the notes and update the fretboard.
ApplicationController.prototype.TODO_fix_this = function() {
  const config = {
    el: '#fretboard',
    fretCount: 24,
    middleFretColor: "#666",
    middleFretWidth: 1,
    width: 2000,
    scaleFrets: "true",
    disabledOpacity: "0.4",
  }
  const fretboard = new Fretboard(config);

  /*
  const dots = [
    { string: 5, fret: 3 }, { string: 4, fret: 2 }, {string: 3, fret: 0}, { string: 2, fret: 1 }
  ].map(e => { return { ...e, group: 1, disabled: true } })
  */
  // "distance" means the distance from the current note ... that is, this is "priordots", in order before they appear before the current dots.
  const prior = [ 2, 3, 4, 5,6,7 ].map((e, i) => { return { string: 5, fret: e, distance: 6 - i } })
  const current = [
    { string: 5, fret: 8 }, {string: 5, fret:9}, { string: 4, fret: 7 }, {string: 3, fret: 5}, { string: 2, fret: 6 }
  ].map(e => { return { ...e, distance: 0 } })
  const alldots = prior.concat(current)
  // console.log(JSON.stringify(alldots,null,2))
  fretboard.
    setDots(alldots).
    // .setDots(current)
    render().
    style({
      // this gives us just the root notes
      // filter: ({ interval: '1P' }),
      filter: ( { distance } ) => distance > 0,
      // displays the note name
      // text: ({ note }) => note,
      // sets the value of the fill attribute
      fill: 'red'
    }).
    style({
      // this gives us just the root notes
      // filter: ({ interval: '1P' }),
      filter: ( { distance } ) => distance === 0,
      // displays the note name
      // text: ({ note }) => note,
      // sets the value of the fill attribute
      fill: 'green'
    })

  // Set opacity so that the further back you go, things fade out.
  // dot distances map to opacity
  const opacityForDistance = (n) => {
    if (n == 0)
      return 1
    return 0.5 - 0.05 * n
  }
  for (var d = 0; d <= 10; ++d) {
    const cn = `dot-distance-${d}`
    console.log('setting opacity for ' + cn)
    var els = document.getElementsByClassName(cn)
    for (var i = 0; i < els.length; i++) {
      els[i].setAttribute("opacity", opacityForDistance(d))
    }
  }
}

module.exports = { ApplicationController }
