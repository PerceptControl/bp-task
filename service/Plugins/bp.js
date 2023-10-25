const fp = require('fastify-plugin')

const BP = require('bp-api').default
const bp = new BP(process.env.DOMAIN, process.env.LOGIN, process.env.PASSWORD)

const WAREHOUSE_FIELDS = {
  DATE: 2,
  ORDER: 3,
  COMMENT: 4,
}

const ORDER_FIELDS = {
  STATUS: 2,
  COMMENT: 3,
}

module.exports = fp((instance, opt, done) => {
  instance.decorate('bp', {
    addOrderToWarehouse: async (orderPayload) => {
      const { Warehouse } = await _getCatalogs()
      bp.postRecord(Warehouse.id, {
        [WAREHOUSE_FIELDS.ORDER]: [
          {
            catalogId: orderPayload.catalogId,
            recordId: orderPayload.recordId,
          },
        ],
        [WAREHOUSE_FIELDS.COMMENT]: orderPayload.values[ORDER_FIELDS.COMMENT],
      })
    },

    setOrderComment: async (orderID, comment) => {
      const { Orders } = await _getCatalogs()
      await bp.patchRecord(Orders.id, orderID, {
        [ORDER_FIELDS.COMMENT]: comment,
      })
    },

    getOrders: async () => {
      const { Orders } = await _getCatalogs()

      return bp.getAllRecords(Orders.id)
    },

    addOrder: async ({ comment }) => {
      const { Orders } = await _getCatalogs()
      return bp.postRecord(Orders.id, { [ORDER_FIELDS.COMMENT]: comment })
    },
  })

  done()
})

//TODO можно сделать кэширование
/**
 * Возвращает нужные сервису каталоги
 */
async function _getCatalogs() {
  const catalogs = await bp.getCatalog()
  let Warehouse = null
  let Orders = null

  for (const catalog of catalogs) {
    if (catalog.name.toLowerCase() == 'склад') Warehouse = catalog
    if (catalog.name.toLowerCase() == 'заказы') Orders = catalog
  }

  return {
    Warehouse,
    Orders,
  }
}
