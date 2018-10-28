var socket = io()

var params = new URLSearchParams(window.location.search)

if (!params.has('nombre') || !params.has('sala')) {
  window.location = 'index.html'
  throw new Error('El nombre es necesario')
}

var usuario = {
  nombre: params.get('nombre'),
  sala: params.get('sala')
}

socket.on('connect', function () {
  console.log('Conectado al servidor')
  socket.emit('entrarChat', usuario, (resp) => console.log('usuario conectados: ', resp))
})

socket.on('disconnect', function () {
  console.log('Perdimos conexión con el servidor')
})

socket.on('crearMensaje', function (mensaje) {
  console.log('Servidor : ', mensaje)
})

// escuchar cambios de un usuario cuando sale y entra a una sala
socket.on('listarPersona', (personas) => console.log(personas))

// escuchar mensajes privados
socket.on('mensajePrivado', function (mensaje) {
  console.log('Mensaje prvado ', mensaje)
})
