import type { FastifyPluginAsync } from 'fastify'

// eslint-disable-next-line camelcase
import { OpenAPIV3, OpenAPIV3_1, Spec, ReferenceConfiguration } from '@scalar/types'

type FastifyOpenapiServe = FastifyPluginAsync<fastifyOpenapiServe.FastifyOpenapiServeOptions>

declare namespace fastifyOpenapiServe {
  // eslint-disable-next-line camelcase
  export type OpenAPIDocument = Partial<OpenAPIV3.Document | OpenAPIV3_1.Document>

  export interface FastifyOpenapiServeOptions {
    /**
     * OpenAPI spec directory
     */
    specDir: string | string[]
    /**
     * OpenAPI spec path prefix
     * @default '/docs'
     */
    routePrefix?: string
    /**
     * Merge function
     * @default openapi-merge
     * @see https://github.com/robertmassaioli/openapi-merge
     */
    merge?: (specs: Array<OpenAPIDocument>) => OpenAPIDocument
    /**
     * OpenAPI spec definition
     */
    specDefinition?: Spec
    /**
     * Serve OpenAPI with UI
     * @default true
     */
    ui?: boolean
    /**
     * Scalar UI configuration
     */
    scalarConfig?: ReferenceConfiguration
    /**
     * UI cdn
     * @default 'https://cdn.jsdelivr.net/npm/@scalar/api-reference'
     */
    scalarCdn?: string
  }

  export const fastifyOpenapiServe: FastifyOpenapiServe
  export { fastifyOpenapiServe as default }
}

declare function fastifyOpenapiServe (...params: Parameters<FastifyOpenapiServe>): ReturnType<FastifyOpenapiServe>
export = fastifyOpenapiServe
