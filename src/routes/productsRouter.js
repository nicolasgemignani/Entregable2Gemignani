// Importa el módulo Express para crear rutas y manejar solicitudes HTTP
import express from 'express';
// Importa la clase ProductsManagersFs que maneja operaciones con productos
import ProductsManagersFs from '../daos/FileSystem/productsManagers.js';

// Crea una nueva instancia del enrutador de Express
const router = express.Router();

// Crea una instancia de ProductsManagersFs y extrae sus métodos
const {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
} = new ProductsManagersFs();

/**
 * Ruta GET para obtener todos los productos o un número limitado de ellos.
 * @param {number} [limit] - Número máximo de productos a devolver.
 * @returns {Promise<void>}
 */
router.get('/', async (req, res) => {
    try {
        // Obtiene la lista completa de productos
        const productDb = await getProducts();
        // Lee el parámetro de consulta "limit" para limitar la cantidad de productos devueltos
        const limit = parseInt(req.query.limit, 10);

        if (limit && limit > 0) {
            // Si se especifica un límite válido, devuelve solo los productos hasta el límite
            return res.json(productDb.slice(0, limit));
        }

        // De lo contrario, devuelve todos los productos
        res.json(productDb);
    } catch (error) {
        console.error('Error al obtener productos:', error.message);
        res.status(500).send({ status: 'error', message: 'Error al obtener productos' });
    }
});

/**
 * Ruta GET para obtener un producto específico por ID.
 * @param {string} id - El ID del producto.
 * @returns {Promise<void>}
 */
router.get('/:id', async (req, res) => {
    try {
        // Obtiene el ID del producto de los parámetros de la URL
        const { id } = req.params;
        // Busca el producto por ID
        const producto = await getProductById(id);

        if (producto) {
            // Devuelve el producto si se encuentra
            res.json(producto);
        } else {
            // Devuelve un error 404 si no se encuentra el producto
            res.status(404).send({ status: 'error', message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el producto:', error.message);
        res.status(500).send({ status: 'error', message: 'Error al obtener el producto' });
    }
});

/**
 * Ruta POST para crear un nuevo producto.
 * @param {object} product - Los datos del producto a crear.
 * @returns {Promise<void>}
 */
router.post('/', async (req, res) => {
    try {
        // Obtiene el producto del cuerpo de la solicitud
        const product = req.body;
        // Crea el producto
        const response = await createProduct(product);

        if (response.success) {
            res.status(201).send({ status: 'success', message: response.message });
        } else {
            res.status(400).send({ status: 'error', message: response.message });
        }
    } catch (error) {
        console.error('Error al crear el producto:', error.message);
        res.status(500).send({ status: 'error', message: 'Error al crear el producto' });
    }
});

/**
 * Ruta PUT para actualizar un producto por ID.
 * @param {string} id - El ID del producto.
 * @param {object} update - Los datos a actualizar en el producto.
 * @returns {Promise<void>}
 */
router.put('/:id', async (req, res) => {
    try {
        // Obtiene el ID del producto de los parámetros de la URL
        const { id } = req.params;
        // Obtiene los datos de actualización del cuerpo de la solicitud
        const update = req.body;
        // Actualiza el producto
        const response = await updateProduct(id, update);

        if (response.success) {
            res.json({ status: 'success', message: response.message, data: response.data });
        } else {
            res.status(404).send({ status: 'error', message: response.message });
        }
    } catch (error) {
        console.error('Error al actualizar el producto:', error.message);
        res.status(500).send({ status: 'error', message: 'Error al actualizar el producto' });
    }
});

/**
 * Ruta DELETE para eliminar un producto por ID.
 * @param {string} id - El ID del producto.
 * @returns {Promise<void>}
 */
router.delete('/:id', async (req, res) => {
    try {
        // Obtiene el ID del producto de los parámetros de la URL
        const { id } = req.params;
        // Elimina el producto
        const deleteP = await deleteProduct(id);

        if (deleteP.success) {
            res.json({ status: 'success', message: deleteP.message });
        } else {
            res.status(404).send({ status: 'error', message: deleteP.message });
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error.message);
        res.status(500).send({ status: 'error', message: 'Error al eliminar el producto' });
    }
});

// Exporta el enrutador para su uso en otros archivos
export default router;