import fs from 'fs/promises'
import ProductsManagersFs from './productsManagers.js'

const productManager = new ProductsManagersFs()

const path = './dbjson/cartsDb.json'

class CartManagersFS {
    constructor() {
        this.path = path
    }

    /**
     * Escribe datos en el archivo
     * @param {Array} data - Los datos a escribir
     * @throws {Error} - Lanza un error si falla la escritura
     */
    async _writeFile(data) {
        try {
            await fs.writeFile(this.path, JSON.stringify(data, null, 2), 'utf-8')
        } catch (error) {
            throw new Error('Error al escribir en el archivo: ' + error.message)
        }
    }

    /**
     * Lee el archivo de carritos y lo devuelve como un array
     * @returns {Promise<Array>} - Una promesa que resuelve con la lista de carritos
     * @throws {Error} - Lanza un error si falla la lectura
     */
    async readCart() {
        try {
            const data = await fs.readFile(this.path, 'utf-8')
            return JSON.parse(data)
        } catch (error) {
            if (error.code === 'ENOENT') {
                await this._writeFile([])
                return [];
            }
            throw new Error('Error al leer los carritos: ' + error.message)
        }
    }

    /**
     * Crea un nuevo carrito y lo guarda en el archivo JSON
     * @returns {Promise<object>} - Resultado de la operación
     * @throws {Error} - Lanza un error si falla la creación del carrito
     */
    async createCart() {
        try {
            const carts = await this.readCart()
            const newCart = {
                id: carts.length ? carts[carts.length - 1].id + 1 : 1,
                products: []
            };

            carts.push(newCart);
            await this._writeFile(carts)

            return { success: true, message: 'Carrito creado correctamente', data: newCart }
        } catch (error) {
            return { success: false, message: 'Error al crear el carrito: ' + error.message }
        }
    }

    /**
     * Obtiene un carrito específico por ID
     * @param {number} id - El ID del carrito
     * @returns {Promise<object|null>} - El carrito encontrado o null si no se encuentra
     * @throws {Error} - Lanza un error si falla la lectura
     */
    async getCartById(id) {
        try {
            const carts = await this.readCart()
            return carts.find(cart => cart.id === parseInt(id, 10)) || null
        } catch (error) {
            throw new Error('Error al obtener el carrito: ' + error.message)
        }
    }

    /**
     * Agrega un producto a un carrito específico
     * @param {number} cartId - El ID del carrito
     * @param {number} productId - El ID del producto
     * @returns {Promise<object>} - Resultado de la operación
     * @throws {Error} - Lanza un error si el carrito o el producto no existen, o si falla la actualización
     */
    async addProductToCart(cartId, productId) {
        try {
            const carts = await this.readCart()
            const cartIndex = carts.findIndex(cart => cart.id === parseInt(cartId, 10))

            if (cartIndex === -1) {
                return { success: false, message: `Carrito con ID ${cartId} no encontrado` }
            }

            const product = await productManager.getProductById(productId)

            if (!product) {
                return { success: false, message: `Producto con ID ${productId} no encontrado` }
            }

            const productIndex = carts[cartIndex].products.findIndex(p => p.productID === productId)

            if (productIndex !== -1) {
                carts[cartIndex].products[productIndex].quantity += 1
            } else {
                carts[cartIndex].products.push({ productID: productId, quantity: 1 })
            }

            await this._writeFile(carts)

            return { success: true, message: 'Producto agregado al carrito', data: carts[cartIndex] }
        } catch (error) {
            return { success: false, message: 'Error al agregar producto al carrito: ' + error.message }
        }
    }
}

export default CartManagersFS