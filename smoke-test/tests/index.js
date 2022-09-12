const net = require('node:net')

const PORT = process.env.PORT

const socket = new net.Socket({
  allowHalfOpen: true,
  readable: true,
  writable: true
})

socket.connect(PORT, 'localhost')

socket.write('batata')
socket.end(function () {
  console.log('Closing write end...')
})

socket.on('data', function (buffer) {
  console.log(`Data received from server: ${buffer}`)
  socket.destroy()
})