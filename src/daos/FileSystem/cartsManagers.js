// Importa el modulo 'fs' para operacion de archivos
import fs from 'fs'
// Ruta del archivo JSON que almacena los carritos
const path = './dbjson/cartsDb.json'

class CartManagersFS {
    constructor (){
        // Inicializa la ruta del archivo
        this.path = path
    }

    // Lee el archivo de carritos y lo devuelve como un array
    async readCart(){
        try {
            // Lee el archivo
            const data = await fs.promises.readFile(this.path, 'utf-8')
            // Parsea y devuelve los datos
            return JSON.parse(data)
        } catch (error) {
            if (error.code === 'ENOENT') {
                // Si el archivo no existe, crea uno vacio
                await fs.promises.writeFile(this.path, JSON.stringify([]), 'utf-8')
                return []
            }else {
                // Lanza un error para otros problemas
                throw new Error('Error al leer los carritods')
            }
        }
    }

    // Crea un nuevo carrito y lo guarda en el archivo JSON
    async createCart(){
        try {
            // Obtiene todos los carritos
            const carts = await this.readCart()
            const newCart = {
                // Asigna un nuebo ID
                id: carts.length > 0 ? carts[carts.length - 1].id + 1: 1,
                // Inicializa con un array vacio de productos
                products: []
            }

            // Agrega el nuevo carrito al array
            carts.push(newCart)
            // Guarda el array actualizado
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8')

            return { success: true, message: 'Carrito creado correctamente', data: newCart}
        } catch (error) {
            return { success: false, message: `Error al crear el carrito: ${error.message}`}
        }
    }

    // Obtiene un carrito especifico por ID
    async getCartById(id){
        try {
            // Obtiene todos los carritos
            const carts = await this.readCart()
            // Busca el carrito por ID
            const cart = carts.find(cart => cart.id === parseInt(id))
            // Devuelve el carrito encontrado o null si no se encuetra
            return cart || null
        } catch (error) {
            throw new Error('Error al obtener el carrito')
        }
    }

    // Agrega un producto a un carrito especifico
    async addProductToCart(cartId, product){
        try {
            // Obtiene todos los carritos
            const carts = await this.readCart()
            // Busca el carrito por ID
            const cartIndex = carts.findIndex(cart => cart.id === parseInt(cartId))

            if (cartIndex === -1) {
                return { success: false, message: `Carrito con ID ${cartId} no encontrado`}
            }

            // Busca el producto dentro del carrito
            const productIndex = carts[cartIndex].products.findIndex(p => p.product === product)

            if (productIndex !== -1) {
                // Si el producto ya esta en el carrito, incrementa la cantidad
                carts[cartIndex].products[productIndex].quantity += 1
            } else {
                // Si el producto no esta en el carrito, lo agrega
                carts[cartIndex].products.push({ productID: product, quantity: 1 })
            }

            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8')
            return { success: true, message: 'Producto agregado al carrito', data: carts[cartIndex] }
        } catch (error) {
            return { success: false, message: `Error al agregar prodcuto al carrito: ${error.message}` }
        }
    }
}

// Exporta la clase para su uso en otros archivos
export default CartManagersFS;