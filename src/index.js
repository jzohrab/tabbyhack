import { Application } from './js/app.js'

// All functions have "window." due to hint:
// https://stackoverflow.com/questions/57602686/
//   javascript-function-wont-trigger-when-called-in-html-file-during-parcel-build

/**  sample code only
window.listNeckStrings = function() {
  const n = new GuitarNeck()
  alert(n.listStrings())
}
*/

/** Start the application */
window.startRecord = function() {
  if (window.app) {
    return
  }
  window.app = new Application()
  window.app.start()
}

window.printRecord = function() {
  const content = JSON.stringify(window.app.notes)
  const display = document.getElementById('recorded')
  display.innerHTML = content
}

window.onloadBody = function() {
  // In prod, hide dev tools.
  // there is probably a much better way to do this,
  // but this is fine for now.
  if (process.env.NODE_ENV !== 'development') {
    document.getElementById('btnAddRandom').style.display = 'none';
  }
}

/** Hack helper during dev, add a random frequency. */
window.addRandom = function() {
  startRecord()
  const freq = Math.floor(Math.random() * 200) + 200
  const n = {
    name: '?', value: '?', cents: 0, octave: 0, frequency: freq, standard: freq
  }
  window.app.update(n)
}
