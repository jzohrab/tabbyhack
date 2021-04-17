/** The "keyboard navigator" to select the strings to use from the rawtab. */

const Tabselector = function(app) {
  /** The table we're navigating. */
  this.tbl = document.getElementById('rawtab')

  /** The current cursor position in the table. */
  this.currString = 0
  this.currNote = 0

  /** The preferred strings selected by navigation. */
  this.strings = new Array(app.notes.length)
  this.strings[this.currNote] = this.currString

  app.notes[this.currNote].tab = { string: this.currString, type: 'tone' }

  /** The cursor is active when it changes the preferred strings. */
  this.activeCursor = true
  this.cursorStyle = "current"

  /** A callback for when something updates. */
  this.callUpdate = null

  /** Listen to keyboard events. */
  // bind required here to ensure that "this" in the checkKey method
  // refers to the Tabselector, and not the window.
  // ref https://www.html5gamedevs.com/topic/
  //   9765-javascript-keydown-addeventlistener-will-not-call-my-class-method/
  this.eventListener = this.checkKey.bind(this)
}


Tabselector.prototype.init = function() {
  window.addEventListener("keydown", this.eventListener)
  this.updateView(0, 0)
}

Tabselector.prototype.stop = function() {
  window.removeEventListener("keydown", this.eventListener)
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
  this.cell(oldString, oldNote).classList.remove(this.cursorStyle)
  const c = this.cell(this.currString, this.currNote)
  c.focus()
  c.classList.add(this.cursorStyle)
  c.scrollIntoView({inline: "nearest"})

  if (!this.activeCursor) {
    return
  }

  /** Clear all cells in column. */
  for (var i = 0; i < app.strings.length; i++) {
    this.clearHighlights(i, this.currNote)
  }

  c.classList.add("highlight")
  this.strings[this.currNote] = { string: this.currString, type: 'tone' }
  app.notes[this.currNote].tab = { string: this.currString, type: 'tone' }
}

Tabselector.prototype.clearHighlights = function(r, c) {
  const cl = this.cell(r, c).classList
  cl.remove("highlight")
  cl.remove("chordtone")
}

Tabselector.prototype.clearCurrent = function() {
  this.cell(this.currString, this.currNote).classList.remove("highlight")
  this.strings[this.currNote] = null
  app.notes[this.currNote].tab = { string: null, type: 'tone' }
}

Tabselector.prototype.toggleChordTone = function() {
  if (!this.activeCursor)
    return
  this.clearHighlights(this.currString, this.currNote)
  const newtype = (this.strings[this.currNote].type === 'tone') ?
        { type: 'chord', classname: 'chordtone' } :
        { type: 'tone', classname: 'highlight' }
  this.strings[this.currNote].type = newtype.type
  app.notes[this.currNote].tab.type = newtype.type
  this.cell(this.currString, this.currNote).classList.add(newtype.classname)  
}

/** Keyboard handler. */
Tabselector.prototype.checkKey = function(e) {
  // console.log(`initial: r = ${this.currString}, c = ${this.currNote}`)
  
  const oldString = this.currString
  const oldNote = this.currNote

  e = e || window.event
  const [ DOWN, RIGHT, UP, LEFT, SPACE, T, C ] = [ 40, 39, 38, 37, 32, 84, 67 ]
  switch(0 + e.keyCode) {
  case UP: this.currString -= 1; break
  case DOWN: this.currString += 1; break
  case LEFT: this.currNote -= 1; break
  case RIGHT: this.currNote += 1; break
  case SPACE: clearCurrent(); break
  case T: this.toggleCursor(); break
  case C: this.toggleChordTone(); break
  default: return
  }

  /* Ensure curr row and column are within bounds. */
  this.currString = Math.max(0, this.currString)  // not < 0
  this.currString = Math.min(this.currString, app.strings.length - 1)  // not > rows - 1
  this.currNote = Math.max(0, this.currNote)
  this.currNote = Math.min(this.currNote, app.notes.length - 1)
  // console.log(`r = ${this.currString}, c = ${this.currNote}`)
  if (this.currString !== oldString || this.currNote !== oldNote) {
    this.updateView(oldString, oldNote)
  }

  if (this.callUpdate) {
    this.callUpdate()
  }
}


module.exports = { Tabselector }
