const VextabScribe = function(header, opts = {}) {
  this.header = header
  this.opts = opts
}


 /**
 * get vextab for data.
 */
VextabScribe.prototype.tab = function(line) {
  if (line.length == 0) {
    return this.header
  }

  const maxstafflength = this.opts.stafflength || 24
  const result = []
  let currstaff = []
  let currcount = 0
  result.push(currstaff)

  addDuration = function(s, note) {
    if (note.duration) {
      s.push(`:${note.duration}`)
    }
  }

  for (var i = 0; i < line.length; i++) {
    const sn = line[i]

    const is_chord = (sn instanceof Array)

    if (!is_chord) {
      addDuration(currstaff, sn)
      currstaff.push(sn.vextab())
      currcount++
    }
    else {
      addDuration(currstaff, sn[0])
      const t = '(' + sn.map(n => n.vextab()).join('.') + ')'
      currstaff.push(t)
      currcount++
    }

    if (this.opts.cursor == i && this.opts.cursorIndicator)
      currstaff.push(this.opts.cursorIndicator)

    const isLastNote = (i == line.length - 1)
    if (currcount >= maxstafflength && !isLastNote) {
      currstaff = []
      currcount = 0
      result.push(currstaff)
    }

  }

  let heading = this.header || ''
  if (this.opts.vextabopts)
    heading = `${heading} ${this.opts.vextabopts}`
  if (heading !== '' && line.length > 0)
    heading += '\nnotes '

  return result.
    map(staff => `${heading}${staff.join(' ')}`).
    join('\n\n')
}


module.exports = { VextabScribe }
