module.exports = function (instance, options, done) {
  instance.route({
    path: '',
    method: 'POST',

    handler: async function (request, reply) {
      if (await instance.bpWebhook.isCall(request))
        return void (await instance.bpWebhook.executeCall(request))
      request.info.log(JSON.stringify(request.body))
    },
  })

  done()
}
