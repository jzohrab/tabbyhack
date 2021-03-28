import { GuitarNeck } from './js/guitarneck.js'

// Added "window." due to hint:
// https://stackoverflow.com/questions/57602686/
//   javascript-function-wont-trigger-when-called-in-html-file-during-parcel-build
window.listNeckStrings = function() {
  const n = new GuitarNeck()
  alert(n.listStrings())
}

window.printRecord = function() {
  const content = JSON.stringify(window.app.notes)
  const display = document.querySelector('.recorded span')
  display.innerHTML = content
}
