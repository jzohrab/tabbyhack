/** The "keyboard navigator" to select the strings to use from the rawtab. */

const Tabselector = function(app, fretboard, updateCallback) {
  this.app = app

  /** The current cursor position in the table. */
  this.currString = this.getGoodStringForNote(this.app.line[0], 0, false)
  this.app.cursor = 0

  /** The preferred strings selected by navigation. */
  this.app.noteAt(this.app.cursor).string = this.currString

  /** A callback for when something updates. */
  this.callUpdate = updateCallback
  this.callUpdate()

  this.fretboard = fretboard
  this.fretboard.drawLine(this.app.line, this.app.cursor)

  /** Listen to keyboard events. */
  // bind required here to ensure that "this" in the checkKey method
  // refers to the Tabselector, and not the window.
  // ref https://www.html5gamedevs.com/topic/
  //   9765-javascript-keydown-addeventlistener-will-not-call-my-class-method/
  this.eventListener = this.checkKey.bind(this)
}


/**
 * If not changing string and the given note already has a string selected, keep it;
 * otherwise, try to use the suggested string, and if that doesn't
 * work, return the lowest string value.
 */
Tabselector.prototype.getGoodStringForNote = function(note, suggestedString, changingString) {
  if (!note)
    return
  if (!changingString && note.string !== null)
    return note.string

  const possibleStrings = Object.keys(note.frets).map(n => parseInt(n, 10)).sort()
  if (possibleStrings.includes(suggestedString))
    return suggestedString
  maxString = possibleStrings[possibleStrings.length - 1]
  if (suggestedString > maxString)
    return maxString
  return possibleStrings[0]
}


Tabselector.prototype.init = function() {
  window.addEventListener("keydown", this.eventListener)
}

Tabselector.prototype.stop = function() {
  window.removeEventListener("keydown", this.eventListener)
  /* Update the app, so vextab can be updated. */
  this.app.cursor = null
  this.callUpdate()
}

Tabselector.prototype.toggleChordTone = function() {
  this.app.toggleChord(this.app.cursor)
}


/**
 * Delete the current note.
 */
Tabselector.prototype.deleteCurrent = function() {
  console.log('deleting note at index ' + this.app.cursor)
  this.app.deleteAt(this.app.cursor)
}

// Allowable durations
noteDurations = [
  'w', 'h', 'q', '8', '16', '32'
]

// Count backwards until you find a note with a duration, and return it.
Tabselector.prototype.mostRecentDuration = function(stripDot = true) {
  for (var i = this.app.cursor; i >= 0; i--) {
    const d = this.app.noteAt(i).duration
    if (d) {
      if (stripDot)
        return d.replace(/d$/, '')  // remove dotted rhythm
      return d
    }
  }
  return 'q'  // default
}

Tabselector.prototype.speedUp = function() {
  let i = noteDurations.indexOf(this.mostRecentDuration())
  i += 1
  i = Math.min(i, noteDurations.length - 1)
  this.app.setDuration(this.app.cursor, noteDurations[i])
}

Tabselector.prototype.slowDown = function() {
  let i = noteDurations.indexOf(this.mostRecentDuration())
  i -= 1
  i = Math.max(i, 0)
  this.app.setDuration(this.app.cursor, noteDurations[i])
}

Tabselector.prototype.toggleDot = function() {
  let d = this.mostRecentDuration(false)
  console.log(`most recent = ${d}`)
  const n = this.app.noteAt(this.app.cursor)
  let newduration = d
  if (d.endsWith('d'))
    newduration = d.replace(/d$/, '')
  else
    newduration = `${d}d`
  console.log(`updating to = ${newduration}`)
  this.app.setDuration(this.app.cursor, newduration)
}

/** Keyboard handler. */
Tabselector.prototype.checkKey = function(e) {
  const oldString = this.currString
  const oldCursor = this.app.cursor

  e = e || window.event
  // Movement
  const [ DOWN, RIGHT, UP, LEFT, SPACE, T ] = [ 40, 39, 38, 37, 32, 84 ]
  // Chords
  const [ C ] = [ 67 ]
  // Tempo
  const [ PLUS, MINUS, DOT ] = [ 187, 189, 190 ]
  // Misc
  const [ DELETE ] = [ 8 ]
  let changingString = false
  switch(0 + e.keyCode) {
  case UP: this.currString -= 1; break
  case DOWN: this.currString += 1; break
  case LEFT: this.app.cursor -= 1; break
  case RIGHT: this.app.cursor += 1; break
  case PLUS: this.speedUp(); break
  case MINUS: this.slowDown(); break;
  case DOT: this.toggleDot(); break;
  case DELETE: this.deleteCurrent(); break;
  case C: this.toggleChordTone(); break
  default: return
  }

  /* Ensure curr row and column are within bounds. */
  this.app.cursor = Math.min(this.app.cursor, this.app.line.length - 1)
  this.app.cursor = Math.max(0, this.app.cursor)

  changingString = (oldString !== this.currString)
  this.currString = this.getGoodStringForNote(this.app.noteAt(this.app.cursor), this.currString, changingString)

  // TODO - refactor, this is very messy.
  if (changingString || this.app.cursor !== oldCursor) {
    if (this.app.line[this.app.cursor] instanceof Array) {
      console.log('cannot change the string of a note in chord')
    }
    else {
      const n = this.app.noteAt(this.app.cursor)
      if (n) {
        n.string = this.currString
      }
      else {
        console.log('deleted all notes')
      }
    }
  }

  if (this.callUpdate) {
    this.callUpdate()
  }
  this.fretboard.drawLine(this.app.line, this.app.cursor)

}


module.exports = { Tabselector }
