module.exports = function(instance, options, done) {
  instance.register(require("./Routes/orders"), {prefix: "/orders"})
  done()
}