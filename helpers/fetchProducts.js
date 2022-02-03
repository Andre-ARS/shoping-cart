const fetchProducts = async (product) => {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  try {
    if (product) {
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
    fetchProducts,
  };
}
