'use strict'

const { statSync } = require('node:fs')
const path = require('node:path')

function checkSpecDir (fastify, specDir) {
  if (specDir === undefined) {
    throw new Error('"specDir" option is required')
  }

  if (typeof specDir === 'string') {
    return checkPath(fastify, specDir)
  }

  if (Array.isArray(specDir)) {
    if (!specDir.length) {
      throw new Error('"specDir" option array requires one or more paths')
    }

    if (new Set(specDir).size !== specDir.length) {
      throw new Error(
        '"specDir" option array contains one or more duplicate paths'
      )
    }

    return specDir.map((path) => checkPath(fastify, path))
  }

  throw new Error('"specDir" option must be a string or an array of strings')
}

function checkPath (fastify, rootPath) {
  if (typeof rootPath !== 'string') {
    throw new Error('"specDir" option must be a string')
  }
  if (path.isAbsolute(rootPath) === false) {
    throw new Error('"specDir" option must be an absolute path')
  }

  try {
    const pathStat = statSync(rootPath)

    if (pathStat.isDirectory() === false) {
      throw new Error('"specDir" option must point to a directory')
    }
  } catch (e) {
    if (e.code === 'ENOENT') {
      fastify.log.warn(`"specDir" path "${rootPath}" must exist`)
      return
    }

    throw e
  }
}

module.exports = { checkSpecDir }
