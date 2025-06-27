import type { FastifyInstance } from 'fastify'
import { WebQrcodeLogin } from '@renmu/bili-api'
import { client } from './request'

// const searchUrl = 'https://api.bilibili.com/x/web-interface/wbi/search/all/v2'

export default function (fastify: FastifyInstance, _, done) {
  fastify.get('/auth', async (request, reply) => {
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

  fastify.get('/qrcode', async (request, reply) => {
    try {
      const webQrcodeLogin = new WebQrcodeLogin()
      const res = await webQrcodeLogin.getQrcode()
      reply.send(res)
    } catch (error) {
      reply.status(500).send({ error: '获取二维码失败', detail: error instanceof Error ? error.message : String(error) })
    }
  })

  done()
}
