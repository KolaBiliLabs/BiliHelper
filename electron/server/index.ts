import Fastify from 'fastify'
import auth from './auth'
// import log from '../main/logger'
import { getSafePort } from './getPort'
import search from './search'

async function initAppServer() {
  try {
    const fastify = Fastify({
      logger: true,
    })

    // 注册 the search route
    fastify.register(search, { prefix: '/api' })
    fastify.register(auth, { prefix: '/api' })

    const { servePort } = await getSafePort()
    // Run the server!
    fastify.listen({ port: servePort }, (err, _address) => {
      if (err) {
        throw err
      }

      // log.info(`Server is now listening on ${address}`)
    })
  } catch (error) {
    // log.error('🚫 AppServer failed to start')
    console.log(error)
    throw error
  }
}

export default initAppServer
