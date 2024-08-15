// Importa el módulo Express para crear rutas y manejar solicitudes HTTP
import express from 'express';

// Importa la clase CartManagersFS que maneja operaciones con carritos
import CartManagersFS from '../daos/FileSystem/cartsManagers.js';

// Crea una nueva instancia del enrutador de Express
const router = express.Router();

// Crea una nueva instancia de CartManagersFS para gestionar carritos
const cartManager = new CartManagersFS();

/**
 * Ruta GET para obtener los productos de un carrito específico por ID.
 * @param {string} cid - El ID del carrito.
 * @returns {Promise<void>}
 */
router.get('/:cid', async (req, res) => {
    try {
        // Obtiene el ID del carrito de los parámetros de la solicitud
        const { cid } = req.params;
        // Obtiene el carrito por ID
        const cart = await cartManager.getCartById(cid);

        if (cart) {
            // Devuelve los productos del carrito en formato JSON
            res.json(cart.products);
        } else {
            // Devuelve un error 404 si no se encuentra el carrito
            res.status(404).send({ status: 'error', message: `Carrito con ID ${cid} no encontrado` });
        }
    } catch (error) {
        // Registra el error en la consola
        console.error('Error al obtener el carrito', error.message);
        // Devuelve un error 500 en caso de excepción
        res.status(500).send({ status: 'error', message: 'Error al obtener el carrito' });
    }
});

/**
 * Ruta POST para crear un nuevo carrito.
 * @returns {Promise<void>}
 */
router.post('/', async (req, res) => {
    try {
        // Crea un nuevo carrito
        const response = await cartManager.createCart();

        if (response.success) {
            // Devuelve un éxito 201 con los datos del nuevo carrito
            res.status(201).json({ status: 'success', message: response.message, data: response.data });
        } else {
            // Devuelve un error 400 si la creación del carrito falla
            res.status(400).json({ status: 'error', message: response.message });
        }
    } catch (error) {
        // Registra el error en la consola
        console.error('Error al crear el carrito', error.message);
        // Devuelve un error 500 en caso de excepción
        res.status(500).json({ status: 'error', message: 'Error al crear el carrito' });
    }
});

/**
 * Ruta POST para agregar un producto a un carrito específico.
 * @param {string} cid - El ID del carrito.
 * @param {string} pid - El ID del producto.
 * @returns {Promise<void>}
 */
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        // Obtiene el ID del carrito y del producto de los parámetros de la solicitud
        const { cid, pid } = req.params;
        // Agrega el producto al carrito
        const response = await cartManager.addProductToCart(cid, pid);

        if (response.success) {
            // Devuelve un éxito con los datos actualizados del carrito
            res.json({ status: 'success', message: response.message, data: response.data });
        } else {
            // Devuelve un error 400 si la adición del producto falla
            res.status(400).send({ status: 'error', message: response.message });
        }
    } catch (error) {
        // Registra el error en la consola
        console.error('Error al agregar producto al carrito', error.message);
        // Devuelve un error 500 en caso de excepción
        res.status(500).send({ status: 'error', message: 'Error al agregar al carrito' });
    }
});

// Exporta el enrutador para su uso en otros archivos
export default router;