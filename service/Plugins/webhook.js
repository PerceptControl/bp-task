const fp = require('fastify-plugin')
const crypto = require('node:crypto')

module.exports.default = fp(function (instance, options, done) {
  instance.decorateRequest('webhook', null)
  instance.decorate('bpWebhook', {
    isCall: async (request) => {
      const HOOK_SIGNATURE = request.headers['x-hook-signature']
      if (!HOOK_SIGNATURE || !_isValidHookSignature(HOOK_SIGNATURE, request))
        return false

      const { hook, payload } = request.body
      if (hook == null || payload == null) return false

      request.webhook = {
        hook,
        payload,
      }
      return true
    },

    executeCall: async (request) => {
      switch (request.webhook.hook.event) {
        case 'record.created':
          await _onOrderCreate(instance, request)
          break
        case 'record.updated':
          await _onOrderUpdate(instance, request)
          break
        default:
          return
      }
    },
  })

  done()
})

async function _onOrderCreate(instance, request) {
  const { payload } = request.webhook
  instance.bp.addOrderToWarehouse(payload)
}

async function _onOrderUpdate(instance, request) {
  const { payload } = request.webhook
  const current = payload.values[2]
  const prev = payload.prevValues[2]

  if (current[0] == prev[0]) return //т.к. статус не изменился можем не продолжать выполнение скрипта
  await fetch('https://test.bpium.ru/api/webrequest/request').then(
    async (res) => {
      const parsedRes = await res.json()
      instance.bp.setOrderComment(payload.recordId, parsedRes.value)
    },
  )
}

function _isValidHookSignature(sign, req) {
  const hmac = crypto.createHmac('md5', process.env.HOOK_SECRET)
  hmac.setEncoding('base64')
  hmac.write(JSON.stringify(req.body))
  hmac.end()
  return hmac.read() == sign
}
