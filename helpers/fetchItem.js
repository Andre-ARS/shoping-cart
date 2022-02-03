const fetchItem = async (item) => {
  const url = `https://api.mercadolibre.com/items/${item}`;

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
