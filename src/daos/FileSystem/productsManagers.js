import { Server } from 'socket.io'
import fs from 'fs'
import Joi from 'joi'

// Definir errores personalizados
class FileError extends Error {
    constructor(message) {
        super(message)
        this.name = 'FileError'
    }
}

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError'
    }
}

// Almacena la instancia de Socket.IO
let io

// Exportamos la funcion
export function setIoInstance(ioInstance) {
    io = ioInstance
}

// Define la ruta del archivo JSON donde se almacenan los productos
const path = './dbjson/productsDb.json'

// Definir esquema de validación con Joi
const productSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    code: Joi.string().required(),
    price: Joi.number().required(),
    status: Joi.boolean().required(),
    stock: Joi.number().required(),
    category: Joi.string().required(),
    thumbnails: Joi.array().items(Joi.alternatives().try(Joi.string(), Joi.number())).optional()
});

class ProductsManagersFs {
    constructor() {
        this.path = path;
        this.getProducts = this.getProducts.bind(this)
        this.createProduct = this.createProduct.bind(this)
        this.getProductById = this.getProductById.bind(this)
        this.updateProduct = this.updateProduct.bind(this)
        this.deleteProduct = this.deleteProduct.bind(this)
    }

    /**
     * Valida la estructura del producto
     * @param {object} producto - El producto a validar
     * @returns {boolean} - True si el producto es válido, de lo contrario false
     */
    validarProducto(producto) {
        const { error } = productSchema.validate(producto)
        return !error
    }

    /**
     * Escribe datos en el archivo
     * @param {object} data - Los datos a escribir
     * @throws {FileError} - Lanza un error si falla la escritura
     */
    async _writeFile(data) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2), 'utf-8')
        } catch (error) {
            throw new FileError('Error al escribir en el archivo')
        }
    }

    /**
     * Obtiene todos los productos
     * @returns {Promise<Array>} - Lista de productos
     * @throws {FileError} - Lanza un error si falla la lectura
     */
    async getProducts() {
        try {
            const resultado = await fs.promises.readFile(this.path, 'utf-8')
            return JSON.parse(resultado)
        } catch (error) {
            if (error.code === 'ENOENT') {
                return []
            }
            throw new FileError('Error al leer los productos')
        }
    }

    /**
     * Emite un evento a través de Socket.io
     * @param {string} type - El tipo de evento
     * @param {object} product - El producto asociado al evento
     */
    _emitEvent(type, product) {
        if (io) {
            io.emit('productUpdate', { type, product })
        }
    }

    /**
     * Crea un nuevo producto.
     * @param {object} producto - El producto a crear
     * @returns {Promise<object>} - Resultado de la operación
     * @throws {ValidationError} - Lanza un error si el producto no es válido
     */
    async createProduct(producto) {
        if (!this.validarProducto(producto)) {
            throw new ValidationError('Producto incompleto')
        }

        try {
            const productos = await this.getProducts()
            const productoExistente = productos.find(p => p.code === producto.code)
            if (productoExistente) {
                return { success: false, message: 'Ya existe un producto con este código' }
            }

            const nuevoProducto = {
                id: productos.length > 0 ? productos[productos.length - 1].id + 1 : 1,
                ...producto
            };

            productos.push(nuevoProducto)
            await this._writeFile(productos)

            this._emitEvent('create', nuevoProducto)

            return { success: true, message: 'Producto creado correctamente', data: nuevoProducto }
        } catch (error) {
            return { success: false, message: `Error al agregar producto: ${error.message}` }
        }
    }

    /**
     * Obtiene un producto por su ID
     * @param {number} id - El ID del producto
     * @returns {Promise<object|null>} - El producto o null si no existe
     * @throws {FileError} - Lanza un error si falla la lectura
     */
    async getProductById(id) {
        try {
            const productos = await this.getProducts()
            return productos.find(producto => producto.id === parseInt(id)) || null
        } catch (error) {
            throw new FileError('Error al obtener el producto')
        }
    }

    /**
     * Actualiza un producto por ID.
     * @param {number} id - El ID del producto a actualizar
     * @param {object} update - Objeto con los campos a actualizar
     * @returns {Promise<object>} - Objeto con el resultado de la operación
     * @throws {FileError} - Lanza un error si el producto no existe o falla la escritura
     */
    async updateProduct(id, update) {
        try {
            const productos = await this.getProducts()
            const index = productos.findIndex(producto => producto.id === parseInt(id))

            if (index !== -1) {
                const { id: idToRemove, ...filteredUpdate } = update
                const productoActualizado = { ...productos[index], ...filteredUpdate }
                productos[index] = productoActualizado

                await this._writeFile(productos)

                this._emitEvent('update', productoActualizado)

                return { success: true, message: 'Producto actualizado exitosamente', producto: productoActualizado }
            } else {
                throw new FileError(`El producto con ID ${id} no existe`)
            }
        } catch (error) {
            return { success: false, message: error.message }
        }
    }

    /**
     * Elimina un producto por ID
     * @param {number} id - El ID del producto a eliminar
     * @returns {Promise<object>} - Resultado de la operación
     * @throws {FileError} - Lanza un error si el producto no existe o falla la escritura
     */
    async deleteProduct(id) {
        try {
            const productos = await this.getProducts()
            const newProducts = productos.filter(producto => producto.id !== parseInt(id, 10))

            if (productos.length === newProducts.length) {
                throw new FileError(`El producto con ID ${id} no existe`)
            }

            await this._writeFile(newProducts)

            if (io) {
                io.emit('productUpdate', { type: 'delete', productId: id})
            }

            return { success: true, message: `Producto con ID ${id} eliminado correctamente` }
        } catch (error) {
            return { success: false, message: error.message }
        }
    }
}

export default ProductsManagersFs