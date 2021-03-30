/** The "keyboard navigator" to select the strings to use from the rawtab. */

const Tabselector = function(rows, cols) {
  /** The table we're navigating. */
  this.tbl = document.getElementById('rawtab')
  this.rows = rows
  this.cols = cols

  /** The current cursor position in the table. */
  this.currRow = 0
  this.currCol = 0

  /** The preferred strings selected by navigation. */
  this.strings = new Array(cols)
  this.strings[this.currCol] = this.currRow

  /** The cursor is active when it changes the preferred strings. */
  this.activeCursor = true
  this.cursorStyle = "current"
}


Tabselector.prototype.init = function() {
  // bind required here to ensure that "this" in the checkKey method
  // refers to the Tabselector, and not the window.
  // ref https://www.html5gamedevs.com/topic/
  //   9765-javascript-keydown-addeventlistener-will-not-call-my-class-method/
  window.addEventListener("keydown", this.checkKey.bind(this))
  this.updateView(0, 0)
}

Tabselector.prototype.toggleCursor = function() {
  const cl = this.cell(this.currRow, this.currCol).classList
  cl.remove(this.cursorStyle)
  this.activeCursor = !this.activeCursor
  this.cursorStyle = (this.activeCursor ? "current" : "currentpassive")
  cl.add(this.cursorStyle)

  if (this.activeCursor) {
    this.updateView(this.currRow, this.currCol)
  }
}

Tabselector.prototype.cell = function(r, c) {
  return this.tbl.
    getElementsByTagName('tr')[r].
    getElementsByTagName('td')[c]
}

/** Highlight the cursor cell (only one cell should be highlighted per column). */
Tabselector.prototype.updateView = function(oldRow, oldCol) {
  this.cell(oldRow, oldCol).classList.remove(this.cursorStyle)
  const c = this.cell(this.currRow, this.currCol)
  c.focus()
  c.classList.add(this.cursorStyle)

  if (!this.activeCursor) {
    return
  }

  /** Clear all cells in column. */
  for (var i = 0; i < this.rows; i++) {
    this.clearHighlights(i, this.currCol)
  }

  c.classList.add("highlight")
  this.strings[this.currCol] = { string: this.currRow, type: 'tone' }
}

Tabselector.prototype.clearHighlights = function(r, c) {
  const cl = this.cell(r, c).classList
  cl.remove("highlight")
  cl.remove("chordtone")
}

Tabselector.prototype.clearCurrent = function() {
  this.cell(this.currRow, this.currCol).classList.remove("highlight")
  this.strings[this.currCol] = null
}

Tabselector.prototype.toggleChordTone = function() {
  if (!this.activeCursor)
    return
  this.clearHighlights(this.currRow, this.currCol)
  const newtype = (this.strings[this.currCol].type === 'tone') ?
        { type: 'chord', classname: 'chordtone' } :
        { type: 'tone', classname: 'highlight' }
  this.strings[this.currCol].type = newtype.type
  this.cell(this.currRow, this.currCol).classList.add(newtype.classname)  
}

/** Keyboard handler. */
Tabselector.prototype.checkKey = function(e) {
  // console.log(`initial: r = ${this.currRow}, c = ${this.currCol}`)
  
  const oldRow = this.currRow
  const oldCol = this.currCol

  e = e || window.event
  const [ DOWN, RIGHT, UP, LEFT, SPACE, T, C ] = [ 40, 39, 38, 37, 32, 84, 67 ]
  switch(0 + e.keyCode) {
  case UP: this.currRow -= 1; break
  case DOWN: this.currRow += 1; break
  case LEFT: this.currCol -= 1; break
  case RIGHT: this.currCol += 1; break
  case SPACE: clearCurrent(); break
  case T: this.toggleCursor(); break
  case C: this.toggleChordTone(); break
  default: return
  }

  /* Ensure curr row and column are within bounds. */
  this.currRow = Math.max(0, this.currRow)  // not < 0
  this.currRow = Math.min(this.currRow, this.rows - 1)  // not > rows - 1
  this.currCol = Math.max(0, this.currCol)
  this.currCol = Math.min(this.currCol, this.cols - 1)
  // console.log(`r = ${this.currRow}, c = ${this.currCol}`)
  if (this.currRow !== oldRow || this.currCol !== oldCol) {
    this.updateView(oldRow, oldCol)
  }
}


module.exports = { Tabselector }
