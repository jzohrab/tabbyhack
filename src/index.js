import { Application } from './js/app.js'
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
  window.app.start()
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
  enableButtons({ btnStart: true, btnStop: false, btnWrite: false, btnCopy: false })
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
  window.app.stop()
  enableButtons({ btnStop: false, btnWrite: true })
  window.clearInterval(autoscrollInterval)
  const rawtabContainer = document.getElementById('rawtabcontainer')
  rawtabContainer.scrollTo(0,0)
  tabselector = new Tabselector(window.app.strings.length, window.app.notes.length)
  tabselector.init()
}


/** Get tab */
window.renderTab = function() {
  const rawtab = window.app.rawtabdata()
  // console.log(rawtab)
  const strings = tabselector.strings
  const result = []
  for (var i = 0; i < rawtab.length; i++) {
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
    curr[s.string] = rawtab[i][s.string]
  }

  const scribe = new Scribe(window.app.strings.length)
  const scribetab = scribe.tab(result)
  const tabout = scribetab.map(a => a.join('<br />')).join('<br /><br /><br />')
  const tabdest = document.getElementById('tabdest')
  tabdest.innerHTML = tabout

  const vextabscribe = new VextabScribe()
  const vextabout = vextabscribe.tab(result)
  const vextabdest = document.getElementById('vextabdest')
  vextabdest.innerHTML = vextabout

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
