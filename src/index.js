import { Application } from './js/app.js'
import { ApplicationController } from './js/appcontroller.js'
import { Tabselector } from './js/tabselector.js'
import { Scribe } from './js/scribe.js'
import { VextabScribe } from './js/vextabscribe.js'
import { Fretboard } from '@moonwave99/fretboard.js'

// All functions have "window." due to hint:
// https://stackoverflow.com/questions/57602686/
//   javascript-function-wont-trigger-when-called-in-html-file-during-parcel-build


window.onloadBody = function() {
  // In prod, hide dev tools.
  // there is probably a much better way to do this,
  // but this is fine for now.
  if (process.env.NODE_ENV === 'development') {
    const el = document.getElementById('devControls')
    if (el) {
      el.style.display = 'block';
    }
  }
  window.openTab('btnVextab', 'finalvextab')

  window.app = new Application({})
  window.appcontroller = new ApplicationController(window.app)

  // window.stubRenderMiniEditor()  todo remove
}


const enableButtons = function(hsh) {
  const es = Object.entries(hsh)
  for (var i = 0; i < es.length; i++) {
    const e = es[i]
    document.getElementById(e[0]).disabled = !e[1]
  }
}


/** Build app config from UI settings. */
const getConfig = function() {
  const opt = function(name, defaultVal) {
    return document.getElementById(name).value || defaultVal
  }
  return {
    min: opt('minFret', 0),
    max: opt('maxFret', 0),
    vextabopts: opt('vextabopts', null)
  }
}

/** Mic slider. */
window.updateMicSensitivity = function(s) {
  document.getElementById("micsensitivity").value = s.value
  window.appcontroller.sensitivity = s.value
  window.appcontroller.start()
}

/** Start the application */
window.startRecord = function() {
  const opts = getConfig()
  window.app.configure(opts)
  window.appcontroller.configure(opts)
  window.appcontroller.startRecording()
  enableButtons({ btnStart: false, btnStop: true })
}

window.printRecord = function() {
  let ts = tabselector || { currNote: '(not editing)' }
  const output = [
    `VEXTAB: ${window.app.vextab()}`,
    `APP CURSOR: ${window.app.cursor}`,
    `TABSEL CURSOR: ${ts.currNote}`,
    `LINE:<br /><pre>${JSON.stringify(window.app.line, null, 2)}</pre>`,
  ]
  const display = document.getElementById('recorded')
  display.innerHTML = '<br />' + output.join("<hr />")
}

/** Hack helper during dev, add a random frequency. */
window.addRandom = function() {
  var count = window. prompt("Number of notes to add:", 5)
  count = parseInt(count, 10)
  startRecord()
  for (var i = 0; i < count; i++) {
    const freq = Math.floor(Math.random() * 200) + 200
    const n = window.app.buildNote(freq)
    window.appcontroller.addNote(n)
  }
}

/** Stop the application and scrolling */
window.stopRecord = function() {
  window.appcontroller.stop()
  enableButtons({ btnStop: false })
}


window.stopEditing = function() {
  window.appcontroller.stopEditing()
}

/** Toggle tabs.
 * ref https://www.w3schools.com/howto/howto_js_tabs.asp
 */
window.openTab = function(btnName, tabName) {
  // Get all elements with class="tabcontent" and hide them
  var tabcontent = document.getElementsByClassName("tabcontent");
  for (var i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  var tablinks = document.getElementsByClassName("tablinks");
  for (var i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  document.getElementById(btnName).className += " active";
}


/** Get tab */
window.renderTab = function() {
  const scribe = new Scribe(window.app.strings.length)
  const tabout = scribe.tab(window.app.line).
        map(a => a.join('<br />')).
        join('<br /><br /><br />')
  const tabdest = document.getElementById('tabdest')
  tabdest.innerHTML = tabout

  window.appcontroller.writeVextab()
  enableButtons({ btnCopy: true })
}


/** Dummy call during dev, TODO remove. */
window.stubRenderMiniEditor = function() {
  console.log('TODO remove window.stubRenderMiniEditor')
  const data = `
  tabstave notation=true key=A time=4/4

  notes :q =|: (5/2.5/3.7/4) :8 7-5h6/3 ^3^ 5h6-7/5 ^3^ :q 7V/4 |
  notes :8 t12p7/4 s5s3/4 :8 3s:16:5-7/5 :q p5/4
  text :w, |#segno, ,|, :hd, , #tr
`
  // todo
}


window.copyTab = function() {
  var copyText = document.getElementById("tabdest")
  var textArea = document.createElement("textarea")
  textArea.value = copyText.innerHTML.
    replace(/<br>/g, '\n').
    replace(/<br \/>/g, '\n')
  document.body.appendChild(textArea)
  textArea.select()
  document.execCommand("Copy")
  textArea.remove()
  document.getElementById("copied").style.display = 'inline'
}
