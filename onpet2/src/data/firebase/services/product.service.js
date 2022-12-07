import { updateProductByID } from "../repositories/product.repository"

export const updateProductService = async (id, data) => {
    await updateProductByID(id, data)
    alert('Product updated.')
}

