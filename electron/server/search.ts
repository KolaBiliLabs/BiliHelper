import type { FastifyInstance } from 'fastify'
import { client } from './request'

// const searchUrl = 'https://api.bilibili.com/x/web-interface/wbi/search/all/v2'

export default function (fastify: FastifyInstance, _, done) {
  fastify.get('/search', async (request, reply) => {
    const { keyword } = request.query as { keyword: string }

    if (!keyword) {
      return reply.status(400).send({ error: 'Keyword is required' })
    }

    try {
      const res = await client.search.all({
        keyword,
        page: 1,
        page_size: 20,
      })
      reply.send(res)
    } catch (error) {
      fastify.log.error(error)
    }
  })

  done()
}
