const net = require('node:net')
const crypto = require('node:crypto')

const PORT = process.env.PORT

const server = new net.Server({ allowHalfOpen: true })

server.listen(PORT, function () {
  console.log(`Server listening on ${PORT}...`)
})

server.on('connection', function (socket) {
  socket.uuid = crypto.randomUUID().split('-').join('')
  socket.writeLock = false

  console.log(`Socket [${socket.uuid}]: connected.`)

  socket.on('data', function (buffer) {
    console.log(`Socket [${socket.uuid}]: data received.`)

    socket.writeLock = true

    if (!socket.writeOnly) {
      socket.write(buffer)
    } else {
      socket.write(buffer, () => socket.end())
    }

    console.log(`Socket [${socket.uuid}]: data echoed.`)
    socket.writeLock = false
  })

  socket.on('end', function () {
    console.log(`Socket [${socket.uuid}]: closed.`)

    if (!socket.writeLock) {
      console.log(`Socket [${socket.uuid}]: destroyed.`)
      socket.destroy()
    }
  })
})