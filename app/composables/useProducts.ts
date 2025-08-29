// composables/useProducts.ts
export function useProducts() {
  const createProduct = async (productData: FormData) => {
    try {
      const { data, error } = await useFetch('/api/products', {
        method: 'POST',
        body: productData,
      })

      if (error.value) {
        throw error.value
      }

      return data.value
    }
    catch (err) {
      console.error('Error creating product:', err)
      throw err
    }
  }

  const getProducts = async () => {
    try {
      const { data, error } = await useFetch('/api/products', {
        method: 'GET',
      })

      if (error.value) {
        throw error.value
      }

      return data.value
    }
    catch (err) {
      console.error('Error fetching products:', err)
      throw err
    }
  }

  return {
    createProduct,
    getProducts,
  }
}
