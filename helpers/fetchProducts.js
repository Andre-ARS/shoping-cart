const nameChanger = ({ id, title, thumbnail }) => ({ sku: id, name: title, image: thumbnail });

const fetchProducts = async (product, callback) => {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  const items = document.querySelector('.items');
  try {
    if (product === undefined) {
      throw new Error('You must provide an url');
    }
    const response = await (await fetch(url)).json();
    const { results } = response;
    results.forEach((result) => {
      items.appendChild(callback(nameChanger(result)));
    });
  } catch (error) {
    console.log('Produto Inválido: ', error.message);
  }
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchProducts,
  };
}
