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
  // console.log(`added ${JSON.stringify(note)}`)
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
  // console.log('enter drawLine')
  const dots = []

  const isChord = function(el) { return el instanceof Array }

  // Show the current dot (at the app cursor) plus this many old dots.
  const olddotcount = 1

  const currcolor = 'red'
  const oldcolor = 'green'

  // console.log(`starting from cursor = ${cursor}`)
  for (var i = cursor; i >= (cursor - olddotcount) && i >= 0; i--) {
    const el = line[i]
    // console.log(`got el = ${JSON.stringify(el, null, 2)}`)
    const color = (i == cursor) ? currcolor : oldcolor
    let newdots = null
    if (isChord(el)) {
      newdots = this.chordStringFrets(el, color)
    }
    else {
      newdots = [ this.noteSelectedStringFret(el, color) ]
    }
    // console.log(`got newdots = ${JSON.stringify(newdots, null, 2)}`)
    dots.push(newdots.map(n => { return { ...n, disabled: (i < cursor) } }))
  }

  if (!isChord(line[cursor])) {
    dots.push(this.noteAllStringFrets(line[cursor], 'white'))
  }

  // console.log(`got all dots = \n ${JSON.stringify(dots, null, 2)}`)

  // The dots to add could be in arrays (if chords), so must flatten
  // .. also want to render later dots last, and we iterated
  // backwards, so reverse it.
  const finaldots = dots.flat().reverse()
  this.fretboard.
    setDots(finaldots).
    render().
    style({
      filter: ( { color: oldcolor } ),
      fill: oldcolor
    }).
    style({
      filter: ( { color: currcolor } ),
      fill: currcolor
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
