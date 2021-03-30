import { GuitarString } from './guitarstring.js'
// import { Scribe } from './scribe.js'
import { Rawtab } from './rawtab.js'
import { Tuner } from './tuner.js'

const Application = function(opts = {}) {
  const a4 = 440
  this.options = opts
  this.options.min = this.options.min || 0
  this.options.max = this.options.max || 12
  this.tuner = new Tuner(a4)
  this.$rawnote = document.getElementById('rawnote')
  // this.$tab = document.getElementById('tab')
  this.$rawtab = document.getElementById('rawtab')
  this.notes = []

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

  this.rawtab = new Rawtab(this.strings, this.options)
}


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

  self.tuner.init()
  self.frequencyData = new Uint8Array(self.tuner.analyser.frequencyBinCount)

}


Application.prototype.stop = function() {
  this.tuner.onNoteDetected = function(note) { /* no-op */ }
}

Application.prototype.rawtabdata = function() {
  return this.rawtab.tab(this.notes.map(n => n.frequency))
}

/** This is terribly done, there is likely a much better way to do it. */
Application.prototype.writeRawTab = function() {
  const data = this.rawtabdata()
  const rows = this.strings.map(s => document.createElement('tr'))
  for (var i = 0; i < data.length; i++) {
    for (var s = 0; s < this.strings.length; s++) {
      const td = document.createElement('td')
      let v = data[i][s]
      if (v === null) { v = '&nbsp;' }
      td.innerHTML = v
      rows[s].appendChild(td)
    }
  }

  while (this.$rawtab.children.length > 0) {
    const r = this.$rawtab.getElementsByTagName("tr")[0]
    this.$rawtab.removeChild(r)
  }

  // console.log(rawtab)
  for (var i = 0; i < rows.length; i++) {
    // console.log(rawtab[i])
    this.$rawtab.appendChild(rows[i])
  }
}

/*
Application.prototype.writeTab = function() {
  const scribetab = this.scribe.tab(this.notes.map(n => n.frequency))
  const tabout = scribetab.map(a => a.join('<br />')).join('<br /><br /><br />')
  this.$tab.innerHTML = tabout
}
*/

Application.prototype.update = function(note) {
  if (note.standard !== 0) {
    const notedesc = `${note.name}${note.octave} (${note.frequency.toFixed(2)} Hz)`
    this.$rawnote.innerHTML = `Current: ${notedesc}`
    this.notes.push(note)
    // this.writeTab()
    this.writeRawTab()
  }
}

// noinspection JSUnusedGlobalSymbols
Application.prototype.toggleAutoMode = function() {
  this.notes.toggleAutoMode()
}

module.exports = { Application }
