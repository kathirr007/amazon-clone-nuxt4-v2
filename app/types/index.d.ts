import type { IProduct } from '~~/server/api/models/product'

export interface Product extends IProduct {
  quantity: number
  price: number
}
