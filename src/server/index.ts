import Fastify from 'fastify'
import log from '../main/logger'

async function initAppServer() {
  try {
    const fastify = Fastify({
      logger: true,
    })

    // Declare a route
    fastify.get('/', (request, reply) => {
      reply.send({ hello: 'world' })
    })

    // Run the server!
    fastify.listen({ port: 3000 }, (err, address) => {
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
