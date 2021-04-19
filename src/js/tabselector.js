/** The "keyboard navigator" to select the strings to use from the rawtab. */

const Tabselector = function(app, updateCallback) {
  /** The table we're navigating. */
  this.tbl = document.getElementById('rawtab')

  /** This class changes the app notes. */
  this.app = app

  /** The current cursor position in the table. */
  this.currNote = 0
  this.currString = this.getGoodStringForNote(this.app.notes[this.currNote], 0, false)
  this.app.cursor = 0

  /** The preferred strings selected by navigation. */
  this.app.notes[this.currNote].tab = { string: this.currString, type: 'tone' }

  /** The cursor is active when it changes the preferred strings. */
  this.activeCursor = true
  this.cursorStyle = "current"

  /** A callback for when something updates. */
  this.callUpdate = updateCallback
  this.callUpdate()

  /** Listen to keyboard events. */
  // bind required here to ensure that "this" in the checkKey method
  // refers to the Tabselector, and not the window.
  // ref https://www.html5gamedevs.com/topic/
  //   9765-javascript-keydown-addeventlistener-will-not-call-my-class-method/
  this.eventListener = this.checkKey.bind(this)
}


/**
 * If not changing string and the given note already has a string selected, keep it;
 * otherwise, try to use the suggested string, and if that doesn't
 * work, return the lowest string value.
 */
Tabselector.prototype.getGoodStringForNote = function(note, suggestedString, changingString) {
  if (!note)
    return
  if (!changingString && note.tab && note.tab.string !== null)
    return note.tab.string

  const possibleStrings = Object.keys(note.frets).map(n => parseInt(n, 10)).sort()
  if (possibleStrings.includes(suggestedString))
    return suggestedString
  maxString = possibleStrings[possibleStrings.length - 1]
  if (suggestedString > maxString)
    return maxString
  return possibleStrings[0]
}


Tabselector.prototype.init = function() {
  window.addEventListener("keydown", this.eventListener)
  this.updateView(0, 0)
}

Tabselector.prototype.stop = function() {
  window.removeEventListener("keydown", this.eventListener)
  /* Update the app, so vextab can be updated. */
  this.app.cursor = null
  this.callUpdate()
}

Tabselector.prototype.toggleCursor = function() {
  const cl = this.cell(this.currString, this.currNote).classList
  cl.remove(this.cursorStyle)
  this.activeCursor = !this.activeCursor
  this.cursorStyle = (this.activeCursor ? "current" : "currentpassive")
  cl.add(this.cursorStyle)

  if (this.activeCursor) {
    this.updateView(this.currString, this.currNote)
  }
}

Tabselector.prototype.cell = function(r, c) {
  return this.tbl.
    getElementsByTagName('tr')[r].
    getElementsByTagName('td')[c]
}

/** Highlight the cursor cell (only one cell should be highlighted per column). */
Tabselector.prototype.updateView = function(oldString, oldNote) {
  return
  // TODO - remove this method

  this.cell(oldString, oldNote).classList.remove(this.cursorStyle)
  const c = this.cell(this.currString, this.currNote)
  c.focus()
  c.classList.add(this.cursorStyle)
  c.scrollIntoView({inline: "nearest"})

  if (!this.activeCursor) {
    return
  }

  /** Clear all cells in column. */
  for (var i = 0; i < this.app.strings.length; i++) {
    this.clearHighlights(i, this.currNote)
  }

  c.classList.add("highlight")
}

Tabselector.prototype.clearHighlights = function(r, c) {
  const cl = this.cell(r, c).classList
  cl.remove("highlight")
  cl.remove("chordtone")
}

Tabselector.prototype.clearCurrent = function() {
  this.cell(this.currString, this.currNote).classList.remove("highlight")
  this.app.notes[this.currNote].tab = { string: null, type: 'tone' }
}

Tabselector.prototype.toggleChordTone = function() {
  if (!this.activeCursor)
    return
  this.clearHighlights(this.currString, this.currNote)

  const scorenotes = this.app.scorenotes()
  const sn = scorenotes[this.app.cursor]
  if (sn instanceof Array) {
    sn.map(n => n.tab.type = 'tone')
    // keep app.cursor in current position, should be at the start of the chord notes.
    
    // The tabsel cursor should be at the first note of this chord ...
    // so find all notes up to that.
    // Tricky code = bad code.
    this.currNote = scorenotes.slice(0, this.app.cursor + 1).flat().length
  }
  else {
    // Can't make the 0th tone a chord.
    if (this.app.cursor == 0)
      return

    // If the prior thing is a chord, and the chord already has this
    // string, don't allow the toggle.
    const chord = this.app.scorenotes()[this.app.cursor - 1]
    if (chord instanceof Array) {
      const chordstrings = chord.map(n => n.tab.string)
      if (chordstrings.includes(sn.tab.string)) {
        console.log('chord already has that string')
        return
      }
    }
      
    this.app.notes[this.currNote].tab.type = 'chord'

    // keep app.cursor where it is, now it's at the next note.
    // tabselector cursor should go to the next note.
    this.currNote += 1
  }

  /*
  const currType = this.app.notes[this.currNote].tab.type
  const newtype = (this.app.notes[this.currNote].tab.type === 'tone') ?
        { type: 'chord', classname: 'chordtone' } :
        { type: 'tone', classname: 'highlight' }
  this.app.notes[this.currNote].tab.type = newtype.type
  this.cell(this.currString, this.currNote).classList.add(newtype.classname)  
  */
}


/**
 * Delete the current note.
 */
Tabselector.prototype.deleteCurrent = function() {
  if (!this.activeCursor)
    return

  console.log('deleting note at index ' + this.currNote)
  const scorenotes = this.app.scorenotes()
  const sn = scorenotes[this.app.cursor]
  if (sn instanceof Array) {
    console.log('chord deletion not implemented')
    return
  }

  // Delete the current note.  Leave everything else (cursor positions etc) as-is.
  const n = this.app.notes.splice(this.currNote, 1)
  console.log(`Deleted note ${JSON.stringify(n)}`)
}

// Allowable durations
noteDurations = [
  'w', 'h', 'q', '8', '16', '32'
]

// Count backwards until you find a note with a duration, and return it.
Tabselector.prototype.mostRecentDuration = function(stripDot = true) {
  const ret = this.app.notes[this.currNote].duration
  for (var i = this.currNote; i >= 0; i--) {
    const d = this.app.notes[this.currNote].duration
    if (d) {
      if (stripDot)
        return d.replace(/d$/, '')  // remove dotted rhythm
      return d
    }
  }
  return 'q'  // default
}

Tabselector.prototype.speedUp = function() {
  let i = noteDurations.indexOf(this.mostRecentDuration())
  i += 1
  i = Math.min(i, noteDurations.length - 1)
  this.app.notes[this.currNote].duration = noteDurations[i]
}

Tabselector.prototype.slowDown = function() {
  let i = noteDurations.indexOf(this.mostRecentDuration())
  i -= 1
  i = Math.max(i, 0)
  this.app.notes[this.currNote].duration = noteDurations[i]
}

Tabselector.prototype.toggleDot = function() {
  let d = this.mostRecentDuration(false)
  console.log(`most recent = ${d}`)
  const n = this.app.notes[this.currNote]
  let newduration = d
  if (d.endsWith('d'))
    newduration = d.replace(/d$/, '')
  else
    newduration = `${d}d`
  console.log(`updating to = ${newduration}`)
  n.duration = newduration
}

/** Keyboard handler. */
Tabselector.prototype.checkKey = function(e) {
  // console.log(`initial: r = ${this.currString}, c = ${this.currNote}`)
  
  const oldString = this.currString
  const oldNote = this.currNote

  e = e || window.event
  // Movement
  const [ DOWN, RIGHT, UP, LEFT, SPACE, T ] = [ 40, 39, 38, 37, 32, 84 ]
  // Chords
  const [ C ] = [ 67 ]
  // Tempo
  const [ PLUS, MINUS, DOT ] = [ 187, 189, 190 ]
  // Misc
  const [ DELETE ] = [ 8 ]
  let changingString = false
  switch(0 + e.keyCode) {
  case UP: this.currString -= 1; break
  case DOWN: this.currString += 1; break
  case LEFT: this.currNote -= 1; this.app.cursor -= 1; break
  case RIGHT: this.currNote += 1; this.app.cursor += 1; break
  case PLUS: this.speedUp(); break
  case MINUS: this.slowDown(); break;
  case DOT: this.toggleDot(); break;
  case DELETE: this.deleteCurrent(); break;
  case SPACE: this.clearCurrent(); break
  case T: this.toggleCursor(); break
  case C: this.toggleChordTone(); break
  default: return
  }

  changingString = (oldString !== this.currString)

  /* Ensure curr row and column are within bounds. */
  this.currString = this.getGoodStringForNote(this.app.notes[this.currNote], this.currString, changingString)
  this.currNote = Math.max(0, this.currNote)
  this.currNote = Math.min(this.currNote, this.app.notes.length - 1)

  // console.log(`r = ${this.currString}, c = ${this.currNote}`)
  if (this.currString !== oldString || this.currNote !== oldNote) {
    this.updateView(oldString, oldNote)

    const an = this.app.notes[this.currNote]
    if (an.tab == null) {
      an.tab = { type: 'tone' }
    }
    an.tab.string = this.currString
  }

  if (this.callUpdate) {
    this.callUpdate()
  }
}


module.exports = { Tabselector }
