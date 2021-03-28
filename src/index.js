import { GuitarNeck } from './js/guitarneck.js'
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
  window.app = new Application()
  window.app.start()
}

window.printRecord = function() {
  const content = JSON.stringify(window.app.notes)
  const display = document.querySelector('.recorded span')
  display.innerHTML = content
}
