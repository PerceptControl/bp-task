const { default: S } = require('fluent-json-schema')

module.exports = function (instance, options, done) {
  instance.route({
    path: '/create',
    method: 'POST',
    schema: {
      body: S.object().prop('comment', S.string().required()).valueOf(),
    },

    handler: async function (request, reply) {
      return instance.bp.addOrder(request.body)
    },
  })

  instance.route({
    path: '/webhook',
    method: 'POST',

    handler: async function (request, reply) {
      if (await instance.bpWebhook.isCall(request))
        return void (await instance.bpWebhook.executeCall(request))
    },
  })

  instance.route({
    path: '',
    method: 'GET',

    handler: async function (request, reply) {
      return instance.bp.getOrders()
    },
  })

  done()
}
