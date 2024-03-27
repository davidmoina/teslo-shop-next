import { type CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  cart: CartProduct[]
}

interface SummaryInformation {
  subtotal: number;
  total: number;
  tax: number;
  itemsInCart: number;
}

interface Action {
  getTotalItems: () => number
  addToCart: (product: CartProduct) => void
  updateProductQuantity: (product: CartProduct, quantity: number) => void
  removeProduct: (product: CartProduct) => void
  getSummaryInformation: () => SummaryInformation
  clearCart: () => void
}

export const useCartStore = create<State & Action>()(
  persist((set, get) => ({
    cart: [],
    // Methods
    getTotalItems: () => {
      const { cart } = get()
      return cart.reduce((total, item) => total + item.quantity, 0)
    },
    addToCart: (product) => {
      const { cart } = get()

      const productInCart = cart.some(item => item.id === product.id && item.size === product.size)

      if (!productInCart) {
        set({ cart: [...cart, product] })
        return
      }

      const outdatedCartProducts = cart.map(item => {
        if (item.id === product.id && item.size === product.size) {
          return { ...item, quantity: item.quantity + product.quantity }
        }

        return item
      })

      set({ cart: outdatedCartProducts })
    },
    updateProductQuantity: (product: CartProduct, quantity: number) => {
      const { cart } = get()

      const updatedCart = cart.map(item => {
        if (item.id === product.id && item.size === product.size) {
          return { ...item, quantity: quantity }
        }

        return item
      })

      set({ cart: updatedCart })
    },
    removeProduct: (product: CartProduct) => {
      const { cart } = get()

      const updatedCart = cart.filter(item => item.id !== product.id || item.size !== product.size)

      set({ cart: updatedCart })
    },
    getSummaryInformation: () => {
      const { cart, getTotalItems } = get()

      const subtotal = cart.reduce((total, product) => total + product.price * product.quantity, 0)

      const tax = subtotal * 0.15
      const total = subtotal + tax
      const itemsInCart = getTotalItems()

      return { subtotal, total, tax, itemsInCart }
    },
    clearCart: () => {
      set({ cart: [] })
    }
  }), {
    name: 'shopping-cart'
  })
)