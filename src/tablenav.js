var start = document.getElementById('start');
const tbl = document.getElementById('scrap');
start.focus();
start.classList.add("highlight")
// start.style.backgroundColor = 'green';
// start.style.color = 'white';

function dotheneedful(sibling) {
  if (sibling != null) {
    // start.focus()
    // start.classList.remove("highlight")
    /*
    start.style.backgroundColor = '';
    start.style.color = '';
    */

    clearColumn(sibling)

    sibling.focus();
    sibling.classList.add("highlight")
    /*
    sibling.style.backgroundColor = 'green';
    sibling.style.color = 'white';
*/
    start = sibling;
  }
}

document.onkeydown = checkKey;

function clearColumn(e) {
  const col = e.cellIndex;
  const rows = tbl.getElementsByTagName('tr').length
  for (var i = 0; i < rows; i++) {
    const c = tbl.getElementsByTagName('tr')[i].getElementsByTagName('td')[col]
    c.classList.remove("highlight")
  }
}

function checkKey(e) {
  e = e || window.event;
  if (e.keyCode == '38') {
    // up arrow
    start.classList.remove("highlight")
    var nextrow = start.parentElement.previousElementSibling;
    if (nextrow != null) {
      var idx = start.cellIndex;
      var sibling = nextrow.cells[idx];
      dotheneedful(sibling);
    }
  } else if (e.keyCode == '40') {
    // down arrow
    start.classList.remove("highlight")
    var nextrow = start.parentElement.nextElementSibling;
    if (nextrow != null) {
      var idx = start.cellIndex;
      var sibling = nextrow.cells[idx];
      dotheneedful(sibling);
    }
  } else if (e.keyCode == '37') {
    // left arrow
    // clearColumn(start)
    var sibling = start.previousElementSibling;
    dotheneedful(sibling);
  } else if (e.keyCode == '39') {
    // right arrow
    var sibling = start.nextElementSibling;
    dotheneedful(sibling);
    // clearColumn(start)
  }
}
