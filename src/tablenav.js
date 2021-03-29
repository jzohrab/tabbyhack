var start = document.getElementById('start');
start.focus();
start.style.backgroundColor = 'green';
start.style.color = 'white';

function dotheneedful(sibling) {
  if (sibling != null) {
    start.focus();
    start.style.backgroundColor = '';
    start.style.color = '';
    sibling.focus();
    sibling.style.backgroundColor = 'green';
    sibling.style.color = 'white';
    start = sibling;
  }
}

document.onkeydown = checkKey;

function checkKey(e) {
  e = e || window.event;
  if (e.keyCode == '38') {
    // up arrow
    var idx = start.cellIndex;
    var nextrow = start.parentElement.previousElementSibling;
    if (nextrow != null) {
      var sibling = nextrow.cells[idx];
      dotheneedful(sibling);
    }
  } else if (e.keyCode == '40') {
    // down arrow
    var idx = start.cellIndex;
    var nextrow = start.parentElement.nextElementSibling;
    if (nextrow != null) {
      var sibling = nextrow.cells[idx];
      dotheneedful(sibling);
    }
  } else if (e.keyCode == '37') {
    // left arrow
    var sibling = start.previousElementSibling;
    dotheneedful(sibling);
  } else if (e.keyCode == '39') {
    // right arrow
    var sibling = start.nextElementSibling;
    dotheneedful(sibling);
  }
}
