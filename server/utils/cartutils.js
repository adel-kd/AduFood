export const getCartTotal = (cartItems) => {
    if (!cartItems || !Array.isArray(cartItems)) return 0
    return cartItems.reduce((total, item) => {
      const price = Number(item.price) || 0
      const qty = Number(item.quantity) || 0
      return total + price * qty
    }, 0)
  }
  