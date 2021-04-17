import { Application } from './js/app.js'
import { ApplicationController } from './js/appcontroller.js'
import { Tabselector } from './js/tabselector.js'
import { Scribe } from './js/scribe.js'
import { VextabScribe } from './js/vextabscribe.js'

// All functions have "window." due to hint:
// https://stackoverflow.com/questions/57602686/
//   javascript-function-wont-trigger-when-called-in-html-file-during-parcel-build

const enableButtons = function(hsh) {
  const es = Object.entries(hsh)
  for (var i = 0; i < es.length; i++) {
    const e = es[i]
    document.getElementById(e[0]).disabled = !e[1]
  }
}

/** Start the application */
window.startRecord = function() {
  if (window.app) {
    return
  }
  const minfret = document.getElementById('minFret').value || 0
  const maxfret = document.getElementById('maxFret').value || 12
  const opts = { min: minfret, max: maxfret }
  window.app = new Application(opts)
  window.appcontroller = new ApplicationController(window.app)
  window.appcontroller.start()
  enableButtons({ btnStart: false, btnStop: true })
}

window.printRecord = function() {
  const content = JSON.stringify(window.app.notes)
  const display = document.getElementById('recorded')
  display.innerHTML = content
}

window.restartApp = function() {
  window.app = null
  tabselector = null
  enableButtons({ btnStart: true, btnStop: false, btnCopy: false })
  const tabdest = document.getElementById('tabdest')
  tabdest.innerHTML = ''
  startRecord()
}


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
}

/** Hack helper during dev, add a random frequency. */
window.addRandom = function() {
  startRecord()
  for (var i = 0; i < 10; i++) {
    const freq = Math.floor(Math.random() * 200) + 200
    window.app.add_frequency(freq)
  }
}


// Thanks to https://stackoverflow.com/questions/49968622/auto-scroll-a-horizontal-div
// for rawtab autoscroll

var autoscrollInterval = null

window.addEventListener('load', () => {
  const rawtabContainer = document.getElementById('rawtabcontainer')
  const rawtabScrollWidth = rawtabContainer.scrollWidth
  autoscrollInterval = self.setInterval(() => {
    if (rawtabContainer.scrollLeft !== rawtabScrollWidth) {
      rawtabContainer.scrollTo(rawtabContainer.scrollLeft + 1, 0)
    }
  }, 15)
})


var tabselector = null

/** Stop the application and scrolling */
window.stopRecord = function() {
  window.appcontroller.stop()
  enableButtons({ btnStop: false })
  window.clearInterval(autoscrollInterval)
  const rawtabContainer = document.getElementById('rawtabcontainer')
  rawtabContainer.scrollTo(0,0)
  tabselector = new Tabselector(window.app)
  tabselector.init()
  tabselector.callUpdate = window.renderTab
}


/** Remove keyboard listener. */
window.stopTabSelect = function() {
  if (!tabselector)
    return
  tabselector.stop()
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
  const notes = window.app.notes
  // console.log(rawtab)
  const strings = tabselector.strings
  const result = []
  for (var i = 0; i < notes.length; i++) {
    const s = strings[i]

    if (!s)
      continue;

    let curr = {}
    switch (s.type) {
    case 'chord':
      curr = result[result.length - 1]
      break
    case 'tone':
      result.push(curr)
      break
    default:
      throw `Bad type ${s.type}`
    }
    curr[s.string] = notes[i].frets[`${s.string}`]
  }

  const scribe = new Scribe(window.app.strings.length)
  const scribetab = scribe.tab(result)
  const tabout = scribetab.map(a => a.join('<br />')).join('<br /><br /><br />')
  const tabdest = document.getElementById('tabdest')
  tabdest.innerHTML = tabout

  // Vextab creates a textarea with class "editor"
  const editors = document.getElementsByClassName("editor")
  if (editors.length !== 1) {
    throw "no 'editor' class found"
  }
  const vextabeditor = editors[0]

  const vextabscribe = new VextabScribe()
  const vextabout = vextabscribe.tab(result)
  const vextabcontent = `tabstave notation=true
notes :q ${vextabout}`
  vextabeditor.value = vextabcontent

  // Simulate a keypress in the vextab editor so that the canvas is updated.
  // ref https://github.com/0xfe/vextab/blob/master/src/div.js
  vextabeditor.dispatchEvent(new KeyboardEvent('keyup'));

  enableButtons({ btnCopy: true })
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
