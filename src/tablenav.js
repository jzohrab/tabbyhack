/** The table we're navigating. */
const tbl = document.getElementById('scrap')

/** The current cursor position in the table. */
var curr = null

/** Highlight the cursor cell (only one cell should be lit per column). */
function updateView(sibling) {
  if (sibling != null) {
    clearColumn(sibling)
    sibling.focus()
    sibling.classList.add("highlight")
    curr = sibling
  }
}

/** Clear all cells in column. */
function clearColumn(e) {
  const col = e.cellIndex
  const rows = tbl.getElementsByTagName('tr').length
  for (var i = 0; i < rows; i++) {
    const c = tbl.getElementsByTagName('tr')[i].getElementsByTagName('td')[col]
    c.classList.remove("highlight")
  }
}

/** Keyboard handler. */
function checkKey(e) {
  e = e || window.event
  if (e.keyCode == '38') {
    // up arrow
    const r = curr.parentElement.previousElementSibling
    if (r != null) {
      updateView(r.cells[curr.cellIndex])
    }
  } else if (e.keyCode == '40') {
    // down arrow
    const r = curr.parentElement.nextElementSibling
    if (r != null) {
      updateView(r.cells[curr.cellIndex])
    }
  } else if (e.keyCode == '37') {
    // left arrow
    updateView(curr.previousElementSibling)
  } else if (e.keyCode == '39') {
    // right arrow
    updateView(curr.nextElementSibling)
  }
}

document.onkeydown = checkKey
curr = document.getElementById('start')
curr.focus()
curr.classList.add("highlight")
