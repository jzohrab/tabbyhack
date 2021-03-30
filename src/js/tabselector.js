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
}


Tabselector.prototype.init = function() {
  // bind required here to ensure that "this" in the checkKey method
  // refers to the Tabselector, and not the window.
  // ref https://www.html5gamedevs.com/topic/
  //   9765-javascript-keydown-addeventlistener-will-not-call-my-class-method/
  window.addEventListener("keydown", this.checkKey.bind(this))
  this.updateView(0, 0)
}

Tabselector.prototype.cell = function(r, c) {
  return this.tbl.
    getElementsByTagName('tr')[r].
    getElementsByTagName('td')[c]
}
  
/** Highlight the cursor cell (only one cell should be lit per column). */
Tabselector.prototype.updateView = function(oldRow, oldCol) {
  /** Clear all cells in column. */
  for (var i = 0; i < this.rows; i++) {
    this.cell(i, this.currCol).classList.remove("highlight")
  }

  this.cell(oldRow, oldCol).classList.remove("current")

  const c = this.cell(this.currRow, this.currCol)
  c.focus()
  c.classList.add("highlight")
  c.classList.add("current")
  this.strings[this.currCol] = this.currRow
}

Tabselector.prototype.clearCurrent = function() {
  this.cell(this.currRow, this.currCol).classList.remove("highlight")
  this.strings[this.currCol] = null
}

/** Keyboard handler. */
Tabselector.prototype.checkKey = function(e) {
  // console.log(`initial: r = ${this.currRow}, c = ${this.currCol}`)
  
  const oldRow = this.currRow
  const oldCol = this.currCol

  e = e || window.event
  const [ DOWN, RIGHT, UP, LEFT, SPACE ] = [ '40', '39', '38', '37', '32' ]
  switch(`${e.keyCode}`) {
  case UP: this.currRow -= 1; break
  case DOWN: this.currRow += 1; break
  case LEFT: this.currCol -= 1; break
  case RIGHT: this.currCol += 1; break
  case SPACE: clearCurrent(); break
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
