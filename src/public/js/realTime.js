const socket = io();

/**
 * Actualiza la lista de productos en la vista cuando se emite un evento 'productUpdate'
 * @event productUpdate
 * @param {Object} data - Datos del evento de actualización
 * @param {string} data.type - Tipo de actualización ('create', 'update', 'delete')
 * @param {Object} [data.product] - Objeto del producto (solo para 'create' y 'update')
 * @param {number} [data.productId] - ID del producto (solo para 'delete')
 */
socket.on('productUpdate', ({ type, product, productId }) => {
    const productList = document.getElementById('products-list')

    switch (type) {
        case 'create':
            // Crear un nuevo elemento de producto
            if (product) {
                const li = document.createElement('li');
                li.id = `product-${product.id}`;
                li.innerHTML = `
                    <h2>${product.title}</h2>
                    <p>${product.description}</p>
                    <p>Precio: ${product.price}</p>
                `;
                productList.appendChild(li)
            }
            break
        
        case 'update':
            // Actualizar un producto existente
            if (product) {
                const productItem = document.getElementById(`product-${product.id}`)
                if (productItem) {
                    productItem.innerHTML = `
                        <h2>${product.title}</h2>
                        <p>${product.description}</p>
                        <p>Precio: ${product.price}</p>
                    `;
                }
            }
            break

        case 'delete':
            // Eliminar un producto
            if (productId) {
                const productItem = document.getElementById(`product-${productId}`)
                if (productItem) {
                    productItem.remove()
                }
            }
            break

        default:
            // Manejo de tipos de eventos desconocidos
            console.warn('Tipo de evento desconocido:', type)
            break
    }
});