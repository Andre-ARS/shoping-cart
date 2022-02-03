const changer = ({ id, title, price }) => ({ sku: id, name: title, salePrice: price });

const fetchItem = async (item) => {
  const url = `https://api.mercadolibre.com/items/${item}`;
  const cart = document.querySelector('.cart__items');

  try {
    if (item) {      
      const promise = await fetch(url);
      const response = await promise.json();
      return response;
    }
    throw new Error('You must provide an url');
  } catch (error) {
    return error;
  }
}; 

if (typeof module !== 'undefined') {
  module.exports = {
    fetchItem,
  };
}
