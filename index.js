'use strict'

const path = require('node:path')

const fp = require('fastify-plugin')
const { glob } = require('glob')

const { checkSpecDir } = require('./lib/spec-dir')
const { mergeSpec } = require('./lib/merge-spec')
const { scalarUi } = require('./lib/scalar')

/**
 * @type {import('fastify').FastifyPluginAsync<import('./types').FastifyOpenapiServeOptions>}
 */
async function fastifyOpenapiServe (fastify, opts) {
  const prefix = getPrefix(opts.routePrefix)
  const specDir = opts.specDir

  checkSpecDir(fastify, specDir)

  if (opts.merge && typeof opts.merge !== 'function') {
    throw new Error('"merge" option must be a function')
  }

  const rootsSpec = Array.isArray(specDir) ? specDir : [specDir]
  const specFiles = []

  for (const specPath of rootsSpec) {
    const files = await glob('**/*.{yaml,yml,json}', {
      cwd: specPath, absolute: true, follow: true, nodir: true,
    })

    specFiles.push(...files.map((file) => {
      return file.split(path.win32.sep).join(path.posix.sep)
    }))
  }

  if (opts.ui !== false) {
    fastify.register(scalarUi, {
      prefix,
      cdn: opts.scalarCdn,
      scalarConfig: opts.scalarConfig,
    })
  }

  fastify.route({
    method: 'GET',
    url: `${prefix}/openapi.json`,
    handler: async () => {
      const mergedSpec = await mergeSpec(specFiles, {
        merge: opts.merge,
        specDefinition: opts.specDefinition,
      })

      return mergedSpec
    },
  })

  fastify.route({
    method: 'GET',
    url: `${prefix}/openapi.yaml`,
    handler: async (_, reply) => {
      const mergedSpec = await mergeSpec(specFiles, {
        merge: opts.merge,
        specDefinition: opts.specDefinition,
        yaml: true
      })

      return reply
        .type('application/x-yaml')
        .send(mergedSpec)
    },
  })
}

function getPrefix (prefix) {
  prefix = prefix || '/docs'

  return prefix.endsWith('/') ? prefix.slice(0, -1) : prefix
}

module.exports = fp(fastifyOpenapiServe, {
  fastify: '5.x',
  name: 'fastify-openapi-serve',
})
module.exports.default = fastifyOpenapiServe
module.exports.fastifyOpenapiServe = fastifyOpenapiServe
