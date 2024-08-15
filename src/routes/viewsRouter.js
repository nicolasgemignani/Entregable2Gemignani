// Importa el módulo Express
import express from 'express';
// Importa la clase que maneja los productos desde el sistema de archivos
import ProductsManagersFs from '../daos/FileSystem/productsManagers.js';

// Crea una instancia del enrutador de Express
const router = express.Router();
// Crea una instancia de ProductsManagersFs para manejar las operaciones de productos
const productManager = new ProductsManagersFs();

/**
 * Ruta GET para renderizar la página principal con la lista de productos.
 * Renderiza la vista 'home' con los productos obtenidos.
 * 
 * @name GET/home
 * @function
 * @async
 * @param {Object} req - El objeto de solicitud (request).
 * @param {Object} res - El objeto de respuesta (response).
 */
router.get('/home', async (req, res) => {
    try {
        // Obtiene la lista de productos desde el manejador de productos
        const productos = await productManager.getProducts();
        // Renderiza la vista 'home' y pasa la lista de productos como datos
        res.render('home', { productos });
    } catch (error) {
        // En caso de error, envía una respuesta de error 500
        res.status(500).send('Error al obtener los productos');
    }
});

/**
 * Ruta GET para renderizar la página de productos en tiempo real.
 * Renderiza la vista 'realTimeProducts' con la lista de productos obtenidos.
 * 
 * @name GET/realtimeproducts
 * @function
 * @async
 * @param {Object} req - El objeto de solicitud (request).
 * @param {Object} res - El objeto de respuesta (response).
 */
router.get('/realtimeproducts', async (req, res) => {
    try {
        // Obtiene la lista de productos desde el manejador de productos
        const productos = await productManager.getProducts();
        // Renderiza la vista 'realTimeProducts' y pasa la lista de productos como datos
        res.render('realTimeProducts', { productos });
    } catch (error) {
        // En caso de error, envía una respuesta de error 500
        res.status(500).send('Error al obtener los productos');
    }
});

// Exporta el enrutador para su uso en la aplicación principal
export default router;