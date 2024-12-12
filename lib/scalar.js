/**
 * @type {import('fastify').FastifyPluginCallback}
 */
function scalarUi (fastify, opts, done) {
  const cdn = opts.cdn || 'https://cdn.jsdelivr.net/npm/@scalar/api-reference'
  const scalarConfig = {
    ...opts.scalarConfig,
    spec: {
      url: `${opts.prefix}/openapi.json`,
    }
  }

  fastify.route({
    method: 'GET',
    url: '/',
    handler: (_, reply) => {
      reply
        .type('text/html')
        .send(htmlTemplate({
          cdn,
          serializedOptions: JSON.stringify(scalarConfig).split('"').join('&quot;'),
        }))
    }
  })

  done()
}

function htmlTemplate (opts) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Scalar API Reference</title>
      <meta charset="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1" />
    </head>
    <body>
      <script
        id="api-reference"
        type="application/json"
        data-configuration="${opts.serializedOptions}"></script>
      <script src="${opts.cdn}"></script>
    </body>
    </html>
  `
}

module.exports = { scalarUi }
