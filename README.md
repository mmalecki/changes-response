# couchdb-changes-response
[![Build Status](https://travis-ci.org/mmalecki/couchdb-changes-response.svg?branch=master)](https://travis-ci.org/mmalecki/couchdb-changes-response)

Mimic CouchDB's `_changes` response in a streaming fashion.

## Installation
```sh
npm i couchdb-changes-response
```

## Usage
Please note: this module is heavily WIP, only continuous feed is supported
right now.

```js
var ChangesResponse = require('couchdb-changes-response')

var response = new ChangesResponse({
  type: 'continuous'
}))

response.write({
  id: 'foobar',
  seq: 132,
  doc: {
    id: 'foobar',
    bar: 'foo'
  })
})
```
