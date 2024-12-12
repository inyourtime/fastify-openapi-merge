const path = require('node:path')

const Fastify = require('fastify')

const fastifyOpenapiServe = require('..')

const fastify = Fastify()

fastify.register(fastifyOpenapiServe, {
  specDir: path.join(__dirname, 'specs'),
  specDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'CRUD API Example',
      version: '1.0.0',
      description: 'A sample CRUD API for managing items.'
    },
  }
})

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err
  console.log('Documentation available on http://localhost:3000/docs')
})
