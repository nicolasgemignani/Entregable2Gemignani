/**
 * Configura los eventos de WebSocket para manejar las conexiones y actualizaciones de productos.
 * @param {object} io - La instancia del servidor de Socket.IO.
 */
export default function setupSocketEvents(io) {
    // Maneja la conexión de un nuevo cliente
    io.on('connection', (socket) => {
        console.log('Usuario conectado');

        /**
         * Escucha el evento 'productChange' desde el cliente.
         * Emite un evento 'productUpdate' a todos los clientes conectados cuando hay un cambio en los productos.
         * @param {object} data - Los datos relacionados con la actualización del producto.
         */
        socket.on('productChange', (data) => {
            io.emit('productUpdate', data);
        });

        // Maneja la desconexión del cliente
        socket.on('disconnect', () => {
            console.log('Usuario desconectado');
        });
    });
}

