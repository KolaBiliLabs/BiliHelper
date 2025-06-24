import Fastify from 'fastify'
import log from '../main/logger'
import { getSafePort } from './getPort'
import search from './search'

async function initAppServer() {
  try {
    const fastify = Fastify({
      logger: true,
    })

    // 注册 the search route
    fastify.register(search, { prefix: '/api' })

    const { servePort } = await getSafePort()
    // Run the server!
    fastify.listen({ port: servePort }, (err, address) => {
      if (err) {
        throw err
      }

      log.info(`Server is now listening on ${address}`)
    })
  } catch (error) {
    log.error('🚫 AppServer failed to start')
    throw error
  }
}

export default initAppServer
