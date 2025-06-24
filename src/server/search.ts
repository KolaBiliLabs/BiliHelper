export default function (fastify, opts, done) {
  fastify.get('/search', async (request, reply) => {
    const { keyword } = request.query as { keyword: string }
    if (!keyword) {
      return reply.status(400).send({ error: 'Keyword is required' })
    }

    const results = {
      keyword,
      results: [],
    }
    return reply.send(results)
  })
  done()
}
