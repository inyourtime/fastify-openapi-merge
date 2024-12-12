import Fastify from 'fastify'
import fastifyOpenapiServe, { OpenAPIDocument } from '..'
import { expectType } from 'tsd'

const app = Fastify()

app.register(fastifyOpenapiServe, {
  specDir: ''
})

app.register(fastifyOpenapiServe, {
  specDir: '',
  routePrefix: '/openapi'
})

app.register(fastifyOpenapiServe, {
  specDir: '',
  routePrefix: '/openapi',
  merge: (specs) => {
    expectType<Array<OpenAPIDocument>>(specs)
    return {
      paths: {},
      components: {}
    }
  }
})

app.register(fastifyOpenapiServe, {
  specDir: '',
  routePrefix: '/openapi',
  specDefinition: {
    openapi: '3.0.0',
    info: { title: 'Custom OpenAPI Spec', version: '1.0.0' },
    servers: [{ url: 'http://localhost:3000', description: 'Localhost' }],
    security: [{ bearerAuth: [] }],
    components: {},
    tags: [],
  }
})

app.register(fastifyOpenapiServe, {
  specDir: '',
  ui: true,
  scalarCdn: '',
  scalarConfig: {
    layout: 'classic',
    theme: 'moon',
    hiddenClients: true
  }
})
