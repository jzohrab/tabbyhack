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
  const dots = Object.entries(note.frets).
        map(p => [ parseInt(p[0]) + 1, p[1] ]).
        reduce((arr, p) => { arr.push({ string: p[0], fret: p[1] }); return arr }, [])
  this.fretboard.
    setDots(dots).
    render().
    style({ fill: 'green' })
}


module.exports = { AppFretboard }
