import { ref, computed } from 'vue'
import type { Product } from '~/types'


export const useCartStore = defineStore('cart', () => {
  const cart = ref<Partial<Product>[]>([])
  const cartLength = ref(0)
  const shippingPrice = ref(0)
  const shippingEstimatedDelivery = ref("")
  const authenticated = ref<boolean | null>(null)

  function addProductToCart(product: Partial<Product>) {
    const cartProduct = cart.value.find((prod: Partial<Product>) => prod._id === product._id)
    
    if (!cartProduct) {
      pushProductToCart(product)
    } else {
      incrementProductQty(cartProduct)
    }

    incrementCartLength()
  }

  function pushProductToCart(product: Partial<Product>) {
    product.quantity = 1
    cart.value.push(product)
  }

  function incrementProductQty(product: Partial<Product>) {
    (product.quantity as number)++
    let indexOfProduct = cart.value.indexOf(product)
    cart.value.splice(indexOfProduct, 1, product)
  }

  function incrementCartLength() {
    cartLength.value = 0
    if (cart.value.length > 0) {
      cart.value.forEach(product => (cartLength.value += (product.quantity as number)))
    }
  }

  function changeQty(product: Partial<Product>, qty: number) {
    let cartProduct = cart.value.find(prod => prod._id === product._id)
    if (cartProduct) {
      cartProduct.quantity = qty

      cartLength.value = 0
      if (cart.value.length > 0) {
        cart.value.forEach(product => (cartLength.value += (product.quantity as number)))
      }

      let indexOfProduct = cart.value.indexOf(cartProduct)
      cart.value.splice(indexOfProduct, 1, cartProduct)
    }
  }

  function removeProduct(product: Partial<Product>) {
    cartLength.value -= (product.quantity as number)
    let indexOfProduct = cart.value.indexOf(product)
    cart.value.splice(indexOfProduct, 1)
  }

  function setShipping(price: number, estimatedDelivery: string) {
    shippingPrice.value = price
    shippingEstimatedDelivery.value = estimatedDelivery
  }

  function clearCart() {
    cart.value = []
    cartLength.value = 0
    shippingPrice.value = 0
    shippingEstimatedDelivery.value = ""
  }

  const getCartLength = computed(() => cartLength.value)

  const getCart = computed(() => cart.value)

  const getCartTotalPrice = computed(() => {
    return cart.value.reduce((total, product) => {
      return total + (product.price as number) * (product.quantity as number)
    }, 0)
  })

  const getCartTotalPriceWithShipping = computed(() => {
    return getCartTotalPrice.value + shippingPrice.value
  })

  const getEstimatedDelivery = computed(() => shippingEstimatedDelivery.value)


  return {
    cart,
    cartLength,
    shippingPrice,
    shippingEstimatedDelivery,
    authenticated,
    addProductToCart,
    changeQty,
    removeProduct,
    setShipping,
    clearCart,
    getCartLength,
    getCart,
    getCartTotalPrice,
    getCartTotalPriceWithShipping,
    getEstimatedDelivery,
  }
}, {
  persist: true,
})