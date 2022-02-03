const getSavedCartItems = () => {
  if (localStorage.cartItems) {
    document.querySelector('.cart__items').innerHTML = localStorage.cartItems;
  }
};

if (typeof module !== 'undefined') {
  module.exports = getSavedCartItems;
}
