const changer = ({ id, title, price }) => ({ sku: id, name: title, salePrice: price });

const fetchItem = async (event, callback) => {
  const id = event.target.parentElement.firstElementChild.innerText;
  const url = `https://api.mercadolibre.com/items/${id}`;
  const cart = document.querySelector('.cart__items');
  
  if (event.target.className === 'item__add') {    
    console.log(id);
    try {
      const response = await (await fetch(url)).json();
      
      cart.appendChild(callback(changer(response)));
    } catch (error) {
      console.log('Produto Inválido: ', error.message);
    }
  }
}; 
// console.log('kks');
if (typeof module !== 'undefined') {
  module.exports = {
    fetchItem,
  };
}
