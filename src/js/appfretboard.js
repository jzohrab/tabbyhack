import { Fretboard } from '@moonwave99/fretboard.js';


const AppFretboard = function() {
  // The fretboard
  // Ref https://moonwave99.github.io/fretboard.js/documentation-fretboard.html
  const fretboardconfig = {
    el: '#fretboard',
    fretCount: 24,
    middleFretColor: "#666",
    middleFretWidth: 1,
    width: 1500,
    // height: 50,
    scaleFrets: "true",
    showFretNumbers: "false",
    disabledOpacity: "0.4",
  }
  this.fretboard = new Fretboard(fretboardconfig)
  this.fretboard.render()
}

/** Update the fretboard. */
AppFretboard.prototype.drawNote = function(note) {
  console.log(`added ${JSON.stringify(note)}`)
  // note.frets example: "frets":{"2":2,"3":7,"4":12}
  const dots = this.noteAllStringFrets(note)
  this.fretboard.
    setDots(dots).
    render().
    style({ fill: 'green' })
}


AppFretboard.prototype.noteAllStringFrets = function(note, color = 'green') {
  return Object.entries(note.frets).
    map(p => [ parseInt(p[0]) + 1, p[1] ]).
    reduce((arr, p) => { arr.push({ string: p[0], fret: p[1], color: color }); return arr }, [])
}

AppFretboard.prototype.noteSelectedStringFret = function(note, color) {
  return {
    string: note.string + 1,
    fret: note.frets[`${note.string}`],
    color: color
  }
}

AppFretboard.prototype.chordStringFrets = function(notes, color) {
  return notes.map(n => {
    return this.noteSelectedStringFret(n, color)
  })
}

/** Update fretboard with line of notes. */
AppFretboard.prototype.drawLine = function(line, cursor) {
  console.log('enter drawLine')
  const dots = []
  let newdots = []

  const isChord = function(el) { return el instanceof Array }

  console.log(`starting from cursor = ${cursor}`)
  for (var i = cursor; i >= (cursor - 5) && i >= 0; i--) {
    const el = line[i]
    console.log(`got el = ${JSON.stringify(el, null, 2)}`)
    if (i == cursor) {
      // Current position in line
      if (isChord(el)) {
        newdots = this.chordStringFrets(el, 'yellow')
      }
      else {
        newdots = this.noteAllStringFrets(el, 'green')
        newdots.push(this.noteSelectedStringFret(el, 'yellow'))
      }
    }
    else {
      // Older notes (before cursor)
      if (isChord(el)) {
        newdots = this.chordStringFrets(el, 'red')
      }
      else {
        newdots.push(this.noteSelectedStringFret(el, 'red'))
      }
    }
    console.log(`got newdots = ${JSON.stringify(newdots, null, 2)}`)
    const distance = cursor - i
    dots.push(newdots.map(n => { return { ...n, distance: distance } }))
  }

  console.log(`got all dots = \n ${JSON.stringify(dots, null, 2)}`)

  this.fretboard.
    setDots(dots.flat()).
    render().
    style({
      filter: ( { color: 'red' } ),
      fill: 'red'
    }).
    style({
      filter: ( { color: 'green' } ),
      fill: 'green'
    }).
    style({
      filter: ( { color: 'yellow' } ),
      fill: 'yellow'
    })

  /*
  // Set opacity so that the further back you go, things fade out.
  // dot distances map to opacity
  const opacityForDistance = (n) => {
    if (n == 0)
      return 1
    return 0.5 - 0.05 * n
  }
  for (var d = 0; d <= 10; ++d) {
    const cn = `dot-distance-${d}`
    console.log('setting opacity for ' + cn)
    var els = document.getElementsByClassName(cn)
    for (var i = 0; i < els.length; i++) {
      els[i].setAttribute("opacity", opacityForDistance(d))
    }
  }
  */

}

module.exports = { AppFretboard }
