import { Application } from './js/app.js'
import { ApplicationController } from './js/appcontroller.js'
import { Tabselector } from './js/tabselector.js'
import { Scribe } from './js/scribe.js'
import { VextabScribe } from './js/vextabscribe.js'
// import { Fretboard, Tunings } from 'fretboards'
import { Fretboard } from '@moonwave99/fretboard.js';

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
  const vextabopts = document.getElementById('vextabopts').value || null
  const opts = { min: minfret, max: maxfret, vextabopts: vextabopts }
  window.app = new Application(opts)
  window.appcontroller = new ApplicationController(window.app)
  window.appcontroller.start()
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
  window.moonwave()

  // window.drawFretboard()
}


// moonwave fretboard
// https://moonwave99.github.io/fretboard.js/documentation-fretboard.html
window.moonwave = function() {
  const config = {
    fretCount: 24,
    middleFretColor: "#666",
    middleFretWidth: 1,
    width: 2000,
    scaleFrets: "true",
    disabledOpacity: "0.4",
  }
  const fretboard = new Fretboard(config);

  /*
  const dots = [
    { string: 5, fret: 3 }, { string: 4, fret: 2 }, {string: 3, fret: 0}, { string: 2, fret: 1 }
  ].map(e => { return { ...e, group: 1, disabled: true } })
  */
  // "distance" means the distance from the current note ... that is, this is "priordots", in order before they appear before the current dots.
  const dots = [ 2, 3, 4, 5, 6 ].map((e, i) => { return { string: 5, fret: e, distance: 5 - i } })
  const dots2 = [
    { string: 5, fret: 8 }, {string: 5, fret:9}, { string: 4, fret: 7 }, {string: 3, fret: 5}, { string: 2, fret: 6 }
  ].map(e => { return { ...e, group: 2 } })
  const alldots = dots.concat(dots2)
  // console.log(JSON.stringify(alldots,null,2))
  fretboard.
    setDots(alldots).
    // .setDots(dots2)
    render().
    style({
      // this gives us just the root notes
      // filter: ({ interval: '1P' }),
      filter: ( { distance } ) => distance > 0,
      // displays the note name
      // text: ({ note }) => note,
      // sets the value of the fill attribute
      fill: 'red'
    }).
    style({
      // this gives us just the root notes
      // filter: ({ interval: '1P' }),
      filter: ( { group } ) => group === 2,
      // displays the note name
      // text: ({ note }) => note,
      // sets the value of the fill attribute
      fill: 'green'
    })

  // Set opacity so that the further back you go, things fade out.
  var els = document.getElementsByClassName("dot-group-2")
  for (var i = 0; i < els.length; i++) {
    els[i].setAttribute("opacity", "0.2")
  }
}

/** Hack from https://github.com/txels/fretboards/blob/master/demos/dynamic.html */
window.drawFretboard = function() {

  /*
    config = {
    frets: 12, // Number of frets to display
    startFret: 0, // Initial fret
    strings: 6, // Strings
    tuning: Tunings.guitar6.standard, // Tuning: default = Standard Guitar
    fretWidth: 50, // Display width of frets in pixels
    fretHeight: 20, // Display heigh of frets in pixels
    leftHanded: false, // Show mirror image for left handed players
    showTitle: false, // Set the note name as the title, so it will display on hover
    }
   */

  const fb = Fretboard({
    where: "#fretboard",
    frets: 12,
    tuning: Tunings.guitar6.standard
  })

  fb.clearNotes();

  for (let note of ["3:a3", "2:c4", "1:f4"]) {
    fb.add(note);
  }
  fb.addNote("g3", "red")
  fb.addNoteOnString("g#3", 3, "blue")
  fb.paint()
}


/** Hack helper during dev, add a random frequency. */
window.addRandom = function() {
  var count = window. prompt("Number of notes to add:", 5)
  count = parseInt(count, 10)
  startRecord()
  for (var i = 0; i < count; i++) {
    const freq = Math.floor(Math.random() * 200) + 200
    window.app.add_frequency(freq)
  }
}


var tabselector = null

/** Stop the application and scrolling */
window.stopRecord = function() {
  window.appcontroller.stop()
  enableButtons({ btnStop: false })
  tabselector = new Tabselector(window.app, window.renderTab)
  tabselector.init()
}


/** Remove keyboard listener. */
window.stopEditing = function() {
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
  const scribe = new Scribe(window.app.strings.length)
  const tabout = scribe.tab(window.app.line).
        map(a => a.join('<br />')).
        join('<br /><br /><br />')
  const tabdest = document.getElementById('tabdest')
  tabdest.innerHTML = tabout

  window.appcontroller.writeVextab()
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
