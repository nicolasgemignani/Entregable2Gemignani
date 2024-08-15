// Importa el módulo express para crear el servidor y manejar las rutas
import express from 'express';
// Importa el módulo path para trabajar con rutas de archivos y directorios
import path from 'path';
// Importa utilidades para la gestión de directorios
import __dirname from './utils/utils.js';
// Importa y configura Handlebars como motor de plantillas
import handlebars from 'express-handlebars';
// Importa el servidor de Socket.io para manejo de WebSockets
import { Server } from 'socket.io';

// Importa el enrutador para gestionar rutas de productos
import productsRouter from './routes/productsRouter.js';
// Importa el enrutador para gestionar rutas de carritos
import cartsRouter from './routes/cartsRouter.js';
// Importa el enrutador para gestionar vistas
import viewsRouter from './routes/viewsRouter.js';
// Importa y configura la instancia de Socket.io para manejar eventos
import setupSocketEventsRouter from './routes/socketEventsRouter.js';
// Importa la función para establecer la instancia de Socket.io en el gestor de productos
import { setIoInstance } from './daos/FileSystem/productsManagers.js';

// Crea una instancia de la aplicación Express
const app = express();
// Define el puerto en el que el servidor escuchará las solicitudes entrantes
const httpServer = app.listen(8080, () => console.log("Listening on PORT 8080"));

// Crea una nueva instancia del servidor de WebSockets usando Socket.io
const io = new Server(httpServer);

// Middleware para parsear cuerpos JSON en las solicitudes entrantes
app.use(express.json());
// Middleware para parsear cuerpos de solicitudes con URL codificada (por ejemplo, formularios)
app.use(express.urlencoded({ extended: true }));

// Configura Handlebars como el motor de plantillas para la aplicación
app.engine('handlebars', handlebars.engine());
// Establece la ubicación de las vistas para Handlebars
app.set('views', path.join(__dirname, '../views'));
// Define Handlebars como el motor de vista predeterminado
app.set('view engine', 'handlebars');
// Define el directorio de archivos estáticos (como CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, '../public')));

// Configura las rutas para gestionar productos a través del enrutador de productos
app.use('/api/products', productsRouter);
// Configura las rutas para gestionar carritos a través del enrutador de carritos
app.use('/api/carts', cartsRouter);
// Configura las rutas para renderizar vistas a través del enrutador de vistas
app.use('/', viewsRouter);

// Configura los eventos de Socket.io, incluyendo conexión y desconexión de clientes
setupSocketEventsRouter(io);
// Establece la instancia de Socket.io en el gestor de productos para emitir eventos
setIoInstance(io);