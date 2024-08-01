// Importa el module express para crear el servidor y manejar las rutas
import express from 'express'
// Importa el modulo path para trabajar con rutas de archivos
import path from 'path'
//Importa fileURLPath para convertir la URL del archivo en una ruta de archivo
import { fileURLToPath } from 'url'
// Importa el enrutador de productos
import productsRouter from './routes/productsRouter.js'
// Importa el enrutador de carritos
import cartsRouter from './routes/cartsRouter.js'

// Convierte la URL del archivo en una ruta de archivo
const __filename = fileURLToPath(import.meta.url);
//Obtiene el directorio del archivo actual
const __dirname = path.dirname(__filename)

// Crea una instancia de al aplicacion Express
const app = express();
// Define el puerto en el que el servidor va a escuchar
const PORT = 8080

// Middleware para parsear los cuerpos JSON en las solicitudes
app.use(express.json())
// Middleware para parsear cuerpo de la solicitud con URL codificada
app.use(express.urlencoded({ extended: true}));

//Configura las rutas para productos
app.use('/api/products', productsRouter)
//Configura las rutas para carritos
app.use('/api/carts', cartsRouter)

// Inicia el servidor en el puerto definido y muestra un mensaje en la consola
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
})