'use strict'

const path = require('node:path')

const fp = require('fastify-plugin')
const { glob } = require('glob')

const { checkSpecDir } = require('./lib/spec-dir')
// const { mergeSpec } = require('./lib/merge-spec')

async function fastifyOpenapiMerge (fastify, opts) {
  // const openapiPath = opts.openapiPath || 'openapi'
  const specDir = opts.specDir

  checkSpecDir(fastify, specDir)

  const rootsSpec = Array.isArray(specDir) ? specDir : [specDir]
  const specFiles = []

  for (const specPath of rootsSpec) {
    const files = await glob('**/*.{yaml,yml,json}', {
      cwd: specPath, absolute: false, follow: true, nodir: true,
    })

    specFiles.push(...files.map((file) => {
      return path.join(specPath, file).split(path.win32.sep).join(path.posix.sep)
    }))
  }

  // const mergedSpec = mergeSpec(specFiles)
  // console.log(mergedSpec)
}

module.exports = fp(fastifyOpenapiMerge, {
  fastify: '5.x',
  name: 'fastify-openapi-merge'
})
module.exports.default = fastifyOpenapiMerge
module.exports.fastifyOpenapiMerge = fastifyOpenapiMerge
