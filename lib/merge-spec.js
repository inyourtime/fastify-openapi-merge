'use strict'

const fs = require('node:fs')

const YAML = require('yaml')
const { merge, isErrorResult } = require('openapi-merge')

const baseSpec = {
  openapi: '3.0.0',
  info: {
    title: 'OpenAPI Spec',
    version: '1.0.0'
  },
  servers: [],
  paths: {},
  components: {},
  tags: [],
  externalDocs: {},
  security: [],
}

async function mergeSpec (specPaths, customMerge) {
  const _merge = customMerge ?? merge
  if (typeof _merge !== 'function') {
    throw new Error('mergeFn must be a function')
  }

  const specs = []

  for (const specPath of specPaths) {
    const content = fs.readFileSync(specPath, 'utf-8')
    const parse = YAML.parse(content) ?? {}

    if (!customMerge) {
      specs.push({ oas: parse })
    } else {
      specs.push(parse)
    }
  }

  const result = await _merge(specs)

  if (!customMerge && isErrorResult(result)) {
    throw new Error(`Error merging OpenAPI specs: ${result.message}`)
  }

  return {
    ...baseSpec,
    ...(!customMerge ? result.output : result)
  }
}

module.exports = { mergeSpec }
