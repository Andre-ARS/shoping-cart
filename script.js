// const btns = document.getElementsByClassName('item__add');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const items = document.querySelector('.items');
const nameChanger = ({ id, title, thumbnail }) => ({ sku: id, name: title, image: thumbnail });

async function productList(product, callback) {
  const response = await fetchProducts(product);
  const { results } = response;

  results.forEach((result) => {
    items.appendChild(callback(nameChanger(result)));
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const cart = document.querySelector('.cart__items');
function cartItemClickListener(event) {
  const element = event.target;
  element.remove();
  saveCartItems(cart.innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = () => { 
  productList('computador', createProductItemElement);
  getSavedCartItems();
  cart.addEventListener('click', cartItemClickListener);
  document.querySelector('.items').addEventListener('click', function listener(event) {
    fetchItem(event, createCartItemElement);
  });
};
