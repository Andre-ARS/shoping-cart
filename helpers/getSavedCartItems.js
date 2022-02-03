const getSavedCartItems = () => {
  const storage = localStorage.getItem('cartItems');
  if (localStorage.cartItems) {
    document.querySelector('.cart__items').innerHTML = storage;
  }
};

if (typeof module !== 'undefined') {
  module.exports = getSavedCartItems;
}
