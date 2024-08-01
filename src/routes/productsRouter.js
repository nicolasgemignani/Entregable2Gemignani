// Importa el modulo Express
import express from 'express'
// Importa la clase que maneja los productos
import ProductsManagersFs from '../daos/FileSystem/productsManagers.js'

// Crea un enrutador de Express
const router = express.Router()

// Crea una instancia de ProducsManagersFs y extrae sus metodos
const {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
} = new ProductsManagersFs()

// Ruta GET para obtener todos los productos o un numero limitado
router.get('/', async (req, res) => {
    try {
        // Obtiene la lista de productos
        const productDb = await getProducts()
        // Lee el parametro de consulta "limit"
        const limit = parseInt(req.query.limit, 10)

        if (limit && limit > 0) {
            // Si hay un limite, devuelve solo los productos hasta el limite especificado
            return res.json(productDb.slice(0, limit))
        }

        // De lo contrario, devuelte todos los productos
        res.json(productDb)
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error', message: 'Error al obtener productos' })
    }
})

// GET para obtener un producto por ID
router.get('/:id', async (req, res) => {
    try {
        // Obtiene el ID del parametro de la URL
        const { id } = req.params;
        // Busca el producto por ID
        const producto = await getProductById(id) 

        if (producto) {
            // Devuelve el producto si se encuentra
            res.json(producto)
        } else {
            res.status(404).send({ status: 'error', message: 'Producto no encontrado' })
        }
    } catch (error) {
        console.error('Error al obtener el producto', error.message);
        res.status(500).send({ status: 'error', message: 'Error al obtener el producto' })
    }
})

// Ruta POST para crear un nuevo producto
router.post('/', async (req, res) => {
    try {
        // Obtiene el producto del cuerpo de la solicitud
        const product = req.body
        // Crea el producto
        const response = await createProduct(product)

        if (response.success) {
            res.status(201).send({status: 'success', message: response.message })
        }else {
            res.status(400).send({ status: 'error', message: response.message })
        }
    } catch (error) {
        console.log('Error al crear el producto',error.message);
        res.status(500).send({status: 'error', message: 'Error al crear el producto' })
    }
})

// Ruta PUT para actualizar un producto por ID
router.put('/:id', async (req, res) => {
    try {
        // Obtiene el ID del parametro de la URL
        const { id } = req.params
        // Obtiene los datos de actualizacion del cuerpo de la solicitud
        const update = req.body
        // Actualiza el producto
        const response = await updateProduct(id, update)

        if (response.success) {
            res.json({ status: 'success', message: response.message, data: response.data})
        } else {
            res.status(404).send({ status: 'error', message: response.message })
        }
    } catch (error) {
        console.log('Error al actualizar el producto', error.message);
        res.status(500).send({ status: 'error', message: 'Error al actualizar el producto' })
    }
})

// Ruta DELETE para eliminar un prodcuto por ID
router.delete('/:id', async (req, res) => {
    try {
        // Obtiene el ID del parametro de la URL
        const { id } = req.params
        // Elimina el producto
        const deleteP = await deleteProduct(id)

        if (deleteP.success) {
            res.json({ status: 'success', message: deleteP.message })
        } else {
            res.status(404).send({ status: 'error', message: deleteP.message })
        }
    } catch (error) {
        console.log('Error al eliminar el producto', error.message);
        res.status(500).send({ status: 'error', message: 'Error al eliminar el producto' })
    }
})

// Exporta el enrutador
export default router;