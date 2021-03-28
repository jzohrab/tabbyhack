# Hacktab -- PRE-ALPHA

A very rough work-in-progress tool to generate guitar TAB from audio input.  Start the app locally or visit its deployed site, allow mic access, and start playing -- slowly, and only a single note at a time (no chords).  It will generate some candidate TAB, it's up to you to edit the TAB to select the notes you really want.

Note: this is still pre-alpha, work-in-progress, it's not fully functional

# Development

## Overview

This project uses:

- Parcel for bundling the Javascript
- Tape for unit tests
- Aubiojs for js audio processing

## Requirements

node - v14.16.0
npm - 6.14.11

I haven't tried other versions, but the above worked for me on my Mac.

## Getting started

```
git clone <this repo>
cd <repo path>
npm install

# Build and start the local Parcel server
npm start

# Then go to the local address it tells you
```

## Running tests

`npm run test`

## Contributing

Contributions would be super if it makes this more useful and interesting.

Fork; clone; make you changes and be sure to run `npm run test`; PR back to main.

# Deployment

## To github pages

After running tests, and checking the local site with `npm start`, we can deploy this automatically to a github pages repo by having everything deployed to `docs`.  See ref https://www.sitepoint.com/parcel-hyperapp-github-pages/

`npm run deploy` builds, commits, and pushes.  GH pages take a few moments to update.

# Licensing

TODO - should be free and open.  Have to set the licensing correctly to account for the open-source elements that are included (aubio)
