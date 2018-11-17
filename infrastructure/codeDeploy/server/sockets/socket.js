const { io } = require('../server')
const {Usuarios} = require('../classes/usuarios')
const {crearMensaje} = require('../utilidades/utilidades')

const usuarios = new Usuarios()

io.on('connection', (client) => {
  // para cuando un cliente se conecte
  client.on('entrarChat', (data, callback) => {
    if (!data.nombre || !data.sala) {
      let error = {
        error: true,
        mensaje: 'El nombre/sala son necesarios'
      }
      return callback(error)
    }

    client.join(data.sala)

    usuarios.agregarPersona(client.id, data.nombre, data.sala)
    client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala))

    client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${data.nombre} se unio`))
    callback(usuarios.getPersonasPorSala(data.sala))
  })

  client.on('disconnect', () => {
    let personaBorrada = usuarios.borrarPersona(client.id)
    client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salio!!`))
    client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala))
  })

  // enviar mensaje a todo el mundo
  client.on('crearMensaje', (data, callback) => {
    let persona = usuarios.getPersona(client.id)
    let mensaje = crearMensaje(persona.nombre, data.mensaje)
    client.broadcast.to(persona.sala).emit('crearMensaje', mensaje)
    callback(mensaje)
  })

  // Mensajes privados de los clientes
  client.on('mensajePrivado', data => {
    let persona = usuarios.getPersona(client.id)
    client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje))
  })
})
