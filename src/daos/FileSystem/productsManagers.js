// Importa el modulo fs para interactuar con el sistema de archivos
import fs from 'fs'

// Define la ruta del archivo JSON donde se almacenan los productos
const path = './dbjson/productsDb.json'

class ProductsManagersFs {
    constructor(){
        // Inicializa la ruta del archivo
        this.path = path
        // Enlaza los metodo de la clase para mantener el contexto de "this"
        this.getProducts = this.getProducts.bind(this);
        this.createProduct = this.createProduct.bind(this);
        this.getProductById = this.getProductById.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
    }

    // Metodo para validar la estructura del producto
    validarProducto(producto) {
        // Verifica que todos los campos necesarios existan y no sean null o undefined
        return (
        producto.title &&
        producto.description &&
        producto.code &&
        producto.price !== undefined &&
        producto.status !== undefined &&
        producto.stock !== undefined &&
        producto.category
        )
    }
    
    // Metodo para obtener todos los productos del archivo
    async getProducts(){
        try{
            // Lee el archivo y los parsea a un objeto JSON
            const resultado = await fs.promises.readFile(this.path, 'utf-8')
            return JSON.parse(resultado)
        } catch (error) {
            if (error.code === 'ENOENT') {
                // Si el archivo no existe, devuelve un array vacio
                return []
            }
            throw new Error('Error al leer los productos');
        }
    }

    // Metodo para crear un nuevo producto
    async createProduct(producto){
        // Valida el producto antes de crearlo
        if (!this.validarProducto(producto)) {
            return { success: false, message: 'Producto incompleto' };
        }

        try {
            // Obtiene la lista de productos existentes
            const productos = await this.getProducts()

            // Verifica si ya existe un producto con el mismo codigo
            const productoExistente = productos.find(p => p.code === producto.code)
            if (productoExistente){
                return { success: false, message: 'Ya existe un producto con este código' }
            }

            // Crea un nuevo producto con Id autogenerado
            const nuevoProducto = {
                id: productos.length > 0 ? productos[productos.length - 1].id + 1: 1,
                ...producto
            }

            // Agrega el nuevo producto a la lista y guarda los cambios en el archivo
            productos.push(nuevoProducto)
            await fs.promises.writeFile(this.path, JSON.stringify(productos, null, 2), 'utf-8')
            return { success: true, message: 'Producto creado correctamente', data: nuevoProducto }
        } catch (error) {
            return { success: false, message: `Error al agregar producto: ${error.message}` }
        }
    }

    // Metodo par obtener un producto por ID
    async getProductById(id) {
        try {
            // Obtiene la lista de productos
            const productos = await this.getProducts()
            // Busca el producto con el ID especificado
            const producto = productos.find(producto => producto.id === parseInt(id))
            return producto || null
        } catch (error) {
            console.error('Error al obtener el producto', error.message)
            throw new Error('Error al obtener el producto')
        }
    }
    
    // Metodo para actualizar un producto existente
    async updateProduct(id, update) {
        try {
            // Obtiene la lista de productos
            const productos = await this.getProducts()
            // Encuentra el indice del producto con el ID especificado
            const index = productos.findIndex(producto => producto.id === parseInt(id))
    
            if (index !== -1) {
                // Actualizar el producto manteniendo el ID original
                const productoActualizado = { ...productos[index], ...update }
                productos[index] = productoActualizado
    
                // Guardar los cambios en el archivo
                await fs.promises.writeFile(this.path, JSON.stringify(productos, null, 2), 'utf-8')
                console.log('Producto actualizado exitosamente', productoActualizado)
                return { success: true, message: 'Producto actualizado exitosamente', producto: productoActualizado }
            } else {
                throw new Error(`Error: El producto con ID ${id} no existe`);
            }
        } catch (error) {
            console.log(error.message)
            return { success: false, message: error.message }
        }
    }
    
    // Metodo para eliminar un producto por ID
    async deleteProduct(id) {
        try {
            // Obtiene la lista de productos
            const productos = await this.getProducts();
            // Filtra el producto con el ID especificado
            const newProducts = productos.filter(producto => producto.id !== parseInt(id, 10));

            if (productos.length === newProducts.length) {
                throw new Error(`Error: El producto con ID ${id} no existe`);
            }

            //Guarda la lista actualizada en el archivo
            await fs.promises.writeFile(this.path, JSON.stringify(newProducts, null, 2), 'utf-8');
            console.log('Producto eliminado exitosamente');
            return { success: true, message: `Producto con ID ${id} eliminado correctamente` };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}

export default ProductsManagersFs;