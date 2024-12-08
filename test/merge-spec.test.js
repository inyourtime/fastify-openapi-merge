'use strict'

const path = require('node:path')
const { test } = require('node:test')
// const assert = require('node:assert')

const { mergeSpec } = require('../lib/merge-spec')

test('mergeSpec one spec file', async () => {
  const mergedSpec = await mergeSpec([path.join(__dirname, 'openapi/openapi.json')])
  console.log(mergedSpec)
})
