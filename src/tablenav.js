/** The table we're navigating. */
const tbl = document.getElementById('rawdata')
const rows = tbl.getElementsByTagName('tr').length
const cols = tbl.getElementsByTagName('tr')[0].getElementsByTagName('td').length

/** The current cursor position in the table. */
var currRow = 0
var currCol = 0

/** The preferred strings selected by navigation. */
const strings = new Array(cols)

/** Print highlighted cells. */
window.showCells = function() {
  alert('strings: ' + strings.join(','))
}

/** Highlight the cursor cell (only one cell should be lit per column). */
function updateView() {
  /** Clear all cells in column. */
  for (var i = 0; i < rows; i++) {
    const c = tbl.getElementsByTagName('tr')[i].getElementsByTagName('td')[currCol]
    c.classList.remove("highlight")
  }

  const c = tbl.getElementsByTagName('tr')[currRow].getElementsByTagName('td')[currCol]
  c.focus()
  c.classList.add("highlight")
  strings[currCol] = currRow
}


/** Keyboard handler. */
function checkKey(e) {
  const oldRow = currRow
  const oldCol = currCol

  e = e || window.event
  const [ DOWN, RIGHT, UP, LEFT ] = [ '40', '39', '38', '37' ]
  switch(`${e.keyCode}`) {
  case UP: currRow -= 1; break
  case DOWN: currRow += 1; break
  case LEFT: currCol -= 1; break
  case RIGHT: currCol += 1; break
  default: return
  }

  /* Ensure curr row and column are within bounds. */
  currRow = Math.max(0, currRow)  // not < 0
  currRow = Math.min(currRow, rows - 1)  // not > rows - 1
  currCol = Math.max(0, currCol)
  currCol = Math.min(currCol, cols - 1)

  if (currRow !== oldRow || currCol !== oldCol) {
    updateView()
  }

}

document.onkeydown = checkKey
curr = document.getElementById('start')
strings[currCol] = currRow
curr.focus()
curr.classList.add("highlight")
