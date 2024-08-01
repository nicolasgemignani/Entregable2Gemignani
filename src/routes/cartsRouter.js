// Importa el modulo Express
import express from 'express'
// Importa la clase CartManagersFS
import CartManagersFS from '../daos/FileSystem/cartsManagers.js';

// Crea una nueva instancia del enrutador de Expres
const router = express.Router()
// Crea una nueva instancia de CartManagersFS
const cartManager = new CartManagersFS()

// Ruta GET para obtener los productos de un carrito especifico por ID
router.get('/:cid', async (req, res) => {
    try {
        // Obtiene el Id del carrito de los parametros de la solicitud
        const { cid } = req.params
        // Obtiene el carrito por ID
        const cart = await cartManager.getCartById(cid)

        if (cart) {
            // Devuelve los productos del carrito en formate JSON
            res.json(cart.products)
        } else {
            // Devuelve un error 404 si no se esncuentra el carrito
            res.status(404).send({ status: 'error', message: `Carrito con ID ${cid} no encontrado`})
        }
    } catch (error) {
        // Registra el erro en la consola
        console.log('Error al obtener el carrito', error.message);
        // Devuelve un error 500 en caso de exepcion
        res.status(500).send({ status: 'error', message: 'Error al obtener el carrito' })
    }
})

// Ruta POST para crear un carrito
router.post('/', async (req, res) => {
    try {
        // Crea un nuevo carrito
        const response = await cartManager.createCart()

        if (response.success) {
            // Devuelve un exito 201 con los datos del nuevo carrito
            res.status(201).json({ status: 'succes', message: response.message, data: response.data})
        } else {
            // Devuelve un error 400 si la creacion del carrito falla
            res.status(400).json({ status: 'error', message: response,message })
        }
    } catch (error) {
        // Registra el error en la consola
        console.error('Error al crear el carrito', error.message)
        // Devuelve un erro 500 en caso de exepcion
        res.status(500).json({ status: 'error', message: 'Error al crear el carrito' })
    }
}) 

// Ruta POST para agregar un producto a un carrito especifico por ID del carrito y del producto
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        // Obtiene el ID del carrito y del producto de los parametros de la solicitud
        const { cid, pid } = req.params
        // Agrega el producto al carrito
        const response = await cartManager.addProductToCart(cid, pid)

        if (response.success) {
            // Devuelve un exito con los datos actualizados del carrito
            res.json({ status: 'success', message: response.message, data: response.data })
        } else {
            // Devuelve un erro 400 si la adicion del producto falla
            res.status(400).send({ status: 'error', message: response.message })
        }
    } catch (error) {
        // Registra el error en la consola
        console.error('Error al agregar producto al carrito', error.message)
        // Devuelve un error 500 en caso de exepcion
        res.status(500).send({ status: 'error', message: 'Error al agregar al carrito' })
    }
})

// Exporta el enrutador para su uso en el archivo principal
export default router;