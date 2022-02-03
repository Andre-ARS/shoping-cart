const saveCartItems = (items) => {
  localStorage.cartItems = items;
};

if (typeof module !== 'undefined') {
  module.exports = saveCartItems;
}
